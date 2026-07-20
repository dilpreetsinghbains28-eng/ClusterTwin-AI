const Machine = require('../models/Machine');
const Sensor = require('../models/Sensor');
const SensorReading = require('../models/SensorReading');
const Recommendation = require('../models/Recommendation');
const Alert = require('../models/Alert');
const Factory = require('../models/Factory');
const { generateInsights } = require('../services/recommendationEngine');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.getFactoryInsights = async (req, res) => {
  try {
    const { factoryId } = req.query;

    if (!factoryId) {
      return res.status(400).json({ success: false, error: 'factoryId query parameter is required' });
    }

    // 1. Get all machines for this factory
    const machines = await Machine.find({ factory: factoryId }).lean();
    if (machines.length === 0) {
      return res.status(404).json({ success: false, error: 'No machines found for this factory' });
    }
    const machineIds = machines.map(m => m._id);

    // 2. Get all sensors for these machines
    const sensors = await Sensor.find({ machine: { $in: machineIds } }).lean();
    const sensorMap = {}; 
    sensors.forEach(s => {
      sensorMap[s._id.toString()] = { type: s.type, machineId: s.machine.toString() };
    });

    // 3. Get the absolute latest reading for each sensor
    const latestReadings = await SensorReading.aggregate([
      { $match: { machine: { $in: machineIds } } },
      { $sort: { timestamp: -1 } },
      { $group: {
          _id: '$sensor',
          value: { $first: '$value' },
          timestamp: { $first: '$timestamp' },
          machine: { $first: '$machine' }
      }}
    ]);

    const machineDataMap = {};
    machines.forEach(m => {
      machineDataMap[m._id.toString()] = {
        machineId: m._id.toString(),
        name: m.name,
        telemetry: {
          status: m.status
        }
      };
    });

    latestReadings.forEach(reading => {
      const sensorInfo = sensorMap[reading._id.toString()];
      if (sensorInfo) {
        const mId = sensorInfo.machineId;
        const type = sensorInfo.type;
        
        let key = type.toLowerCase();
        if (type === 'Temperature') key = 'temp';
        if (type === 'Vibration') key = 'vib';
        if (type === 'Power') key = 'pwr';
        if (type === 'RPM') key = 'rpm';
        if (type === 'ProductionCount') key = 'prod';

        if (machineDataMap[mId]) {
          machineDataMap[mId].telemetry[key] = reading.value;
        }
      }
    });

    const machineDataList = Object.values(machineDataMap);

    // Run the engine to get live health scores
    const insights = generateInsights(machineDataList);

    // Fetch persisted recommendations from DB instead of returning ephemeral ones
    const activeRecommendations = await Recommendation.find({ 
      factory: factoryId, 
      status: 'Active' 
    }).sort({ confidence: -1 }).limit(10).lean();

    // Attach them to the insights payload
    insights.recommendations = activeRecommendations;

    return res.status(200).json({
      success: true,
      data: insights
    });

  } catch (error) {
    
    return res.status(500).json({ success: false, error: 'Failed to generate AI insights' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { factoryId, status } = req.query;
    const query = {};
    if (factoryId) query.factory = factoryId;
    if (status) query.status = status;

    const recommendations = await Recommendation.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateRecommendationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Applied', 'Dismissed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const recommendation = await Recommendation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!recommendation) {
      return res.status(404).json({ success: false, error: 'Recommendation not found' });
    }

    res.status(200).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.chatCopilot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

    // 1. Fetch Real-Time Telemetry & Status
    const totalMachines = await Machine.countDocuments();
    const activeMachines = await Machine.countDocuments({ status: { $ne: 'Idle' } });
    const idleMachines = totalMachines - activeMachines;
    const oee = totalMachines > 0 ? Math.round((activeMachines / totalMachines) * 100) : 0;
    
    // Group machines by status for context
    const machines = await Machine.find({}).lean();
    let overloadedMachines = [];
    let warningMachines = [];
    machines.forEach(m => {
       if (m.status === 'Overloaded') overloadedMachines.push(m.name);
       else if (['Overheating', 'Bearing Wear', 'Power Fluctuations'].includes(m.status)) warningMachines.push(`${m.name} (${m.status})`);
    });

    const powerSensors = await Sensor.find({ type: 'Power' }).lean();
    const powerReadings = await SensorReading.aggregate([
      { $match: { sensor: { $in: powerSensors.map(s => s._id) } } },
      { $sort: { timestamp: -1 } },
      { $group: { _id: '$sensor', value: { $first: '$value' } } }
    ]);
    const totalPowerDraw = powerReadings.reduce((acc, curr) => acc + curr.value, 0);
    const carbonFootprint = (totalPowerDraw * 0.4).toFixed(1);

    const prodSensors = await Sensor.find({ type: 'ProductionCount' }).lean();
    const prodReadings = await SensorReading.aggregate([
      { $match: { sensor: { $in: prodSensors.map(s => s._id) } } },
      { $sort: { timestamp: -1 } },
      { $group: { _id: '$sensor', value: { $first: '$value' } } }
    ]);
    const totalProduction = prodReadings.reduce((acc, curr) => acc + curr.value, 0);

    const activeAlerts = await Alert.find({ isAcknowledged: false }).lean();
    const alertSummary = activeAlerts.map(a => `[${a.severity}] ${a.message}`).join('; ');

    // 2. Compile dynamic context
    const contextPrompt = `
You are an Industrial AI Operations Manager for ClusterTwin AI. 
Analyze the following live telemetry and provide data-driven recommendations.

Live Cluster Data:
- OEE: ${oee}%
- Total Machines: ${totalMachines} (${activeMachines} active, ${idleMachines} idle)
- Total Energy Consumption: ${Math.round(totalPowerDraw)} kW
- Total Production Today: ${totalProduction} units
- Carbon Emissions: ${carbonFootprint} kg CO2
- Overloaded Machines: ${overloadedMachines.length > 0 ? overloadedMachines.join(', ') : 'None'}
- Machines Needing Maintenance: ${warningMachines.length > 0 ? warningMachines.join(', ') : 'None'}
- Unresolved Alerts: ${activeAlerts.length > 0 ? alertSummary : 'None'}

Rules for answering:
1. Always base your answer on the provided live data.
2. Mention specific machines, factories, production, OEE, energy, and downtime if relevant.
3. Give actionable recommendations.
4. Estimate expected improvements (production, profit, energy saving, or downtime reduction).
5. Format the answer professionally.
6. Do NOT say you don't have real-time data, use the data provided above.
`;

    // 3. Call Gemini API
    const rawKey = process.env.GEMINI_API_KEY;
    const apiKey = rawKey ? rawKey.trim() : null;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.log("[Gemini] API Key missing or default.");
      return res.status(200).json({ success: true, data: { reply: 'API Key not configured. Please add GEMINI_API_KEY to your backend .env file.' } });
    }
    
    console.log("[Gemini] API key detected.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); // free tier model
    
    console.log("[Gemini] Client initialized successfully.");
    
    try {
      console.log(`[Gemini] Sending request for user query: "${message}"`);
      const result = await model.generateContent([
        { text: contextPrompt },
        { text: `User Query: ${message}` }
      ]);
      const response = await result.response;
      const text = response.text();
      
      console.log("[Gemini] Response received successfully.");
      return res.status(200).json({ success: true, data: { reply: text } });
    } catch (aiError) {
      console.error("[Gemini] API Error:", aiError);
      const errMsg = aiError.message ? aiError.message.toLowerCase() : '';
      if (errMsg.includes('quota') || errMsg.includes('limit') || errMsg.includes('429')) {
         console.log("[Gemini] Handled quota/limit error gracefully.");
         return res.status(200).json({ success: true, data: { reply: "The AI service has temporarily reached its free usage limit. Please try again later." } });
      }
      if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('unavailable')) {
         console.log("[Gemini] Handled 503 high demand error gracefully.");
         return res.status(200).json({ success: true, data: { reply: "The AI service is currently experiencing high demand and is temporarily unavailable. Please try again later." } });
      }
      return res.status(500).json({ success: false, error: 'AI processing failed: ' + (aiError.message || 'Unknown error') });
    }

  } catch (error) {
    console.error("AI Copilot Error:", error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
