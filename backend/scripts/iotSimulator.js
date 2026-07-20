require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Factory = require('../models/Factory');
const Machine = require('../models/Machine');
const Sensor = require('../models/Sensor');
const SensorReading = require('../models/SensorReading');
const User = require('../models/User');
const Alert = require('../models/Alert');
const Recommendation = require('../models/Recommendation');
const { generateInsights } = require('../services/recommendationEngine');

const SENSOR_TYPES = ['Temperature', 'Vibration', 'Voltage', 'Current', 'Power', 'RPM', 'Runtime', 'ProductionCount'];
const MACHINE_STATES = ['Normal', 'Overheating', 'Power Fluctuations', 'Bearing Wear', 'Idle', 'Overloaded'];

let ioInstance = null;

const randomGaussian = (mean, stdev) => {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
};

const getUnitForType = (type) => {
  const map = { 'Temperature': 'C', 'Vibration': 'g', 'Voltage': 'V', 'Current': 'A', 'Power': 'kW', 'RPM': 'rpm', 'Runtime': 'hrs', 'ProductionCount': 'units' };
  return map[type] || 'units';
};

const seedDatabase = async () => {
  const factoryCount = await Factory.countDocuments();
  if (factoryCount > 0) return;

  
  let adminUser = await User.findOne({ email: 'simulator@clustertwin.ai' });
  if (!adminUser) {
    adminUser = await User.create({
      firstName: 'Simulator', lastName: 'Admin', email: 'simulator@clustertwin.ai', password: 'password123', role: 'Admin', organizationName: 'ClusterTwin AI'
    });
  }

  const factoriesToInsert = [];
  for (let i = 1; i <= 25; i++) {
    factoriesToInsert.push({ name: `Factory Alpha-${i}`, location: { city: 'Metropolis', country: 'US', coordinates: { lat: 34.05, lng: -118.24 } }, owner: adminUser._id, industry: 'Automotive', status: 'Operational' });
  }
  const createdFactories = await Factory.insertMany(factoriesToInsert);

  const machinesToInsert = [];
  createdFactories.forEach(factory => {
    for (let m = 1; m <= 4; m++) {
      machinesToInsert.push({ factory: factory._id, name: `CNC Unit ${m}`, type: 'CNC', status: 'Active' });
    }
  });
  const createdMachines = await Machine.insertMany(machinesToInsert);

  const sensorsToInsert = [];
  createdMachines.forEach(machine => {
    SENSOR_TYPES.forEach(type => {
      sensorsToInsert.push({ machine: machine._id, type: type, unitOfMeasurement: getUnitForType(type) });
    });
  });
  await Sensor.insertMany(sensorsToInsert);
  
};

let activeMachines = [];
let machineStates = {};

const loadMemory = async () => {
  const machines = await Machine.find().lean();
  const sensors = await Sensor.find().lean();

  const sensorMap = {};
  sensors.forEach(s => {
    if (!sensorMap[s.machine]) sensorMap[s.machine] = {};
    sensorMap[s.machine][s.type] = s._id;
  });

  machines.forEach(m => {
    activeMachines.push({
      id: m._id,
      factory: m.factory,
      name: m.name,
      sensors: sensorMap[m._id]
    });
    
    machineStates[m._id] = {
      state: 'Normal',
      runtime: Math.floor(Math.random() * 1000),
      productionCount: 0,
      tempBase: 70,
      vibBase: 0.02
    };
  });
};

const calculatePhysics = (machine) => {
  const stateData = machineStates[machine.id];
  let { state, productionCount } = stateData;

  if (Math.random() < 0.01) {
    const oldState = state;
    state = MACHINE_STATES[Math.floor(Math.random() * MACHINE_STATES.length)];
    stateData.state = state;
    
    // Auto-Dismiss Rule: If returning to Normal, clear old alerts for this machine
    if (state === 'Normal' && oldState !== 'Normal') {
      Alert.updateMany(
        { machine: machine.id, isResolved: false }, 
        { $set: { isResolved: true, autoDismissed: true, resolutionNotes: 'Auto-dismissed by physics engine returning to Normal' } }
      ).exec().catch(err => {});
    }

    // Generate Alert if shifting to critical state
    if (state === 'Overheating' || state === 'Bearing Wear' || state === 'Overloaded' || state === 'Power Fluctuations') {
      let severity = 'Low';
      if (state === 'Overheating') severity = 'Critical';
      else if (state === 'Bearing Wear') severity = 'High';
      else if (state === 'Power Fluctuations') severity = 'Medium';
      else if (state === 'Overloaded') severity = 'High';

      const alert = {
        factory: machine.factory,
        machine: machine.id,
        type: 'Predictive Warning',
        severity: severity,
        message: `Machine ${machine.name} shifted to ${state} mode.`
      };
      
      Alert.create(alert).then(doc => {
        if (ioInstance) {
          console.log('EMITTED EVENT [alert:new] globally');
          ioInstance.emit('alert:new', doc);
          console.log(`EMITTED EVENT [alert:new] to room [factory_${machine.factory}]`);
          ioInstance.to(`factory_${machine.factory}`).emit('alert:new', doc);
        }
      }).catch(err => {});
    }
  }

  let temp, vib, vol, cur, pwr, rpm;

  switch (state) {
    case 'Normal':
      temp = randomGaussian(70, 2); vib = Math.max(0, randomGaussian(0.02, 0.005)); vol = randomGaussian(400, 5); cur = randomGaussian(20, 1); rpm = randomGaussian(1500, 10);
      productionCount += Math.floor(Math.random() * 3);
      if (stateData.tempBase > 70) stateData.tempBase -= 0.5;
      if (stateData.vibBase > 0.02) stateData.vibBase -= 0.002;
      break;
    case 'Overheating':
      stateData.tempBase += 1.5; temp = randomGaussian(stateData.tempBase, 3); vib = Math.max(0, randomGaussian(0.03, 0.01)); vol = randomGaussian(395, 8); cur = randomGaussian(25, 2); rpm = randomGaussian(1450, 15);
      productionCount += Math.floor(Math.random() * 2);
      break;
    case 'Bearing Wear':
      stateData.vibBase += 0.005; temp = randomGaussian(75, 4); vib = Math.max(0, randomGaussian(stateData.vibBase, 0.02)); vol = randomGaussian(400, 5); cur = randomGaussian(23, 1.5); rpm = randomGaussian(1480, 20);
      productionCount += Math.floor(Math.random() * 2);
      break;
    case 'Power Fluctuations':
      temp = randomGaussian(72, 3); vib = Math.max(0, randomGaussian(0.025, 0.01)); vol = randomGaussian(380, 40); cur = randomGaussian(22, 5); rpm = randomGaussian(1400, 100);
      productionCount += Math.floor(Math.random() * 2);
      break;
    case 'Overloaded':
      temp = randomGaussian(85, 5); vib = Math.max(0, randomGaussian(0.05, 0.01)); vol = randomGaussian(390, 5); cur = randomGaussian(40, 5); rpm = randomGaussian(1200, 30);
      productionCount += Math.floor(Math.random() * 1);
      break;
    case 'Idle':
      temp = randomGaussian(25, 1); vib = Math.max(0, randomGaussian(0.001, 0.0005)); vol = randomGaussian(400, 2); cur = randomGaussian(0.5, 0.1); rpm = 0;
      break;
  }

  pwr = (vol * cur * Math.sqrt(3) * 0.8) / 1000;
  if (stateData.tempBase > 120) stateData.tempBase = 120;
  if (stateData.vibBase > 0.2) stateData.vibBase = 0.2;

  stateData.runtime += (5 / 3600);
  stateData.productionCount = productionCount;

  return { temp, vib, vol, cur, pwr, rpm, runtime: stateData.runtime, prod: productionCount, status: state };
};

let tickCounter = 0;

const runSimulationTick = async () => {
  const readingsToInsert = [];
  const now = new Date();
  
  const factoryKPIs = {};
  const factoryMachineUpdates = {};

  activeMachines.forEach(m => {
    const vals = calculatePhysics(m);
    const sensors = m.sensors;

    // Build DB readings
    if (sensors['Temperature']) readingsToInsert.push({ sensor: sensors['Temperature'], machine: m.id, value: vals.temp, timestamp: now });
    if (sensors['Vibration']) readingsToInsert.push({ sensor: sensors['Vibration'], machine: m.id, value: vals.vib, timestamp: now });
    if (sensors['Voltage']) readingsToInsert.push({ sensor: sensors['Voltage'], machine: m.id, value: vals.vol, timestamp: now });
    if (sensors['Current']) readingsToInsert.push({ sensor: sensors['Current'], machine: m.id, value: vals.cur, timestamp: now });
    if (sensors['Power']) readingsToInsert.push({ sensor: sensors['Power'], machine: m.id, value: vals.pwr, timestamp: now });
    if (sensors['RPM']) readingsToInsert.push({ sensor: sensors['RPM'], machine: m.id, value: vals.rpm, timestamp: now });
    if (sensors['Runtime']) readingsToInsert.push({ sensor: sensors['Runtime'], machine: m.id, value: vals.runtime, timestamp: now });
    if (sensors['ProductionCount']) readingsToInsert.push({ sensor: sensors['ProductionCount'], machine: m.id, value: vals.prod, timestamp: now });

    // Aggregate Factory KPIs
    if (!factoryKPIs[m.factory]) factoryKPIs[m.factory] = { totalPowerKw: 0, totalProduction: 0, activeMachines: 0, alertsCount: 0 };
    factoryKPIs[m.factory].totalPowerKw += vals.pwr;
    factoryKPIs[m.factory].totalProduction += vals.prod;
    if (vals.status !== 'Idle') factoryKPIs[m.factory].activeMachines += 1;

    // Prep Socket.IO Machine Data
    if (!factoryMachineUpdates[m.factory]) factoryMachineUpdates[m.factory] = [];
    factoryMachineUpdates[m.factory].push({
      machineId: m.id,
      name: m.name,
      status: vals.status,
      telemetry: { 
        temp: vals.temp.toFixed(1), 
        vib: vals.vib.toFixed(3), 
        pwr: vals.pwr.toFixed(2), 
        rpm: vals.rpm.toFixed(0),
        vol: vals.vol.toFixed(1),
        cur: vals.cur.toFixed(2),
        runtime: vals.runtime.toFixed(1),
        prod: vals.prod
      }
    });
  });

  // Emit Socket.IO Events before DB insertion to guarantee real-time flow
  if (ioInstance) {
    // Global dashboard KPI update
    console.log('Tick:', tickCounter, '| Active Machines:', activeMachines.length, '| Factories with KPIs:', Object.keys(factoryKPIs).length);
    console.log('EMITTED EVENT [telemetry:factory_summary]');
    ioInstance.emit('telemetry:factory_summary', factoryKPIs);

    // Room-specific machine streaming
    for (const [factoryId, machines] of Object.entries(factoryMachineUpdates)) {
      console.log(`EMITTED EVENT [telemetry:machines] to room [factory_${factoryId}]`);
      ioInstance.to(`factory_${factoryId}`).emit('telemetry:machines', machines);
    }
  }

  try {
    await SensorReading.insertMany(readingsToInsert, { ordered: false });
  } catch (error) {
    console.error("Error inserting sensor readings:", error.message);
  }

  tickCounter++;
  
  // Run AI Recommendation Engine every 6 ticks (approx 30 seconds)
  if (tickCounter % 6 === 0) {
    for (const [factoryId, machines] of Object.entries(factoryMachineUpdates)) {
      // Parse strings back to numbers for engine
      const parsedMachines = machines.map(m => ({
        ...m,
        telemetry: {
          temp: parseFloat(m.telemetry.temp),
          vib: parseFloat(m.telemetry.vib),
          pwr: parseFloat(m.telemetry.pwr),
          rpm: parseFloat(m.telemetry.rpm),
          prod: parseInt(m.telemetry.prod),
          status: m.status
        }
      }));

      try {
        const insights = generateInsights(parsedMachines);
        
        if (insights.recommendations.length > 0) {
          // Check for existing active recommendations to debounce
          const existingRecs = await Recommendation.find({ factory: factoryId, status: 'Active' }).lean();
          
          for (const newRec of insights.recommendations) {
            const isDuplicate = existingRecs.some(r => r.type === newRec.type && r.target === newRec.target);
            if (!isDuplicate) {
              await Recommendation.create({
                factory: factoryId,
                ...newRec
              });
              
              if (ioInstance) {
                // Map external severities if needed (e.g. Warning -> Medium)
                let sev = newRec.severity;
                if (sev === 'Warning') sev = 'Medium';
                
                // Also emit as a high priority alert for UI toast
                console.log(`EMITTED EVENT [alert:new] to room [factory_${factoryId}]`);
                ioInstance.to(`factory_${factoryId}`).emit('alert:new', {
                  factory: factoryId,
                  type: 'AI Recommendation',
                  severity: sev,
                  message: `[AI ${newRec.type}] ${newRec.explanation}`
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error running AI Engine:", err.message);
      }
    }
  }
};

const startSimulator = async (io) => {
  ioInstance = io;
  console.log('IoT Simulator engine starting...');
  try {
    // If mongoose isn't connected (standalone run), connect it
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/clustertwin';
      await mongoose.connect(mongoUri);
    }
    
    await seedDatabase();
    await loadMemory();


    setInterval(runSimulationTick, 5000);
  } catch (error) {
    console.error("Error in startSimulator:", error);
  }
};

// Allow standalone execution if called directly (npm run simulate)
if (require.main === module) {
  startSimulator(null);
}

module.exports = startSimulator;
