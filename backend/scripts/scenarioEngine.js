/**
 * Scenario Simulation Engine
 * Evaluates hypothetical "What-If" conditions and generates detailed 9-point impact reports.
 */

const simulateScenario = (factoryId, scenarioType, _activeMachinesCount) => {
  let productionLoss = 0; // %
  let revenueLoss = 0; // $
  let deliveryDelay = 0; // Hours
  let carbonImpact = 0; // %
  let energyImpact = 0; // %
  let recoveryTime = 0; // Hours
  let recommendedActions = [];
  let alternateFactory = 'None';
  let costSavings = 0; // $ (Estimated savings if mitigated)

  const baseRevenuePerHour = 5000; 
  
  switch (scenarioType) {
    case 'Machine Failure':
      productionLoss = 15;
      revenueLoss = baseRevenuePerHour * 8;
      deliveryDelay = 4;
      energyImpact = -5;
      carbonImpact = 0;
      recoveryTime = 8;
      alternateFactory = 'Factory Beta (Node 4)';
      costSavings = 12000;
      recommendedActions.push('Dispatch specialized technician immediately.');
      recommendedActions.push('Reroute priority orders to adjacent CNC cluster to mitigate SLA breach.');
      break;
      
    case 'Power Outage':
      productionLoss = 100;
      revenueLoss = baseRevenuePerHour * 12 + 25000; 
      deliveryDelay = 24;
      energyImpact = -100;
      carbonImpact = 15; // Spike upon grid reconnection
      recoveryTime = 12;
      alternateFactory = 'Factory Omega (Node 1)';
      costSavings = 45000;
      recommendedActions.push('Install localized Battery Energy Storage System (BESS) for critical assembly lines.');
      recommendedActions.push('Implement automated safe-shutdown sequences to prevent WIP material scrapping during abrupt power loss.');
      break;

    case 'Worker Shortage':
      productionLoss = 30;
      revenueLoss = baseRevenuePerHour * 24 * 0.2;
      deliveryDelay = 18;
      energyImpact = -25;
      carbonImpact = -25;
      recoveryTime = 24;
      alternateFactory = 'Factory Delta (Node 2)';
      costSavings = 8000;
      recommendedActions.push('Reallocate available workforce to high-margin priority orders.');
      recommendedActions.push('Defer standard stock replenishment runs until next shift.');
      break;

    case 'Raw Material Delay':
      productionLoss = 50;
      revenueLoss = baseRevenuePerHour * 48 * 0.4;
      deliveryDelay = 48;
      energyImpact = -40;
      carbonImpact = -40;
      recoveryTime = 48;
      alternateFactory = 'Factory Alpha-7 (Node 3)';
      costSavings = 25000;
      recommendedActions.push('Source secondary alloy suppliers within a 50-mile radius immediately.');
      recommendedActions.push('Adjust production schedule to prioritize alternate product lines requiring different raw materials.');
      break;

    case 'Demand Surge':
      productionLoss = -20; // Actually a gain, so loss is negative
      revenueLoss = -50000; // Gain of 50k
      deliveryDelay = 0;
      energyImpact = 35; 
      carbonImpact = 35;
      recoveryTime = 72; // Time to return to normal inventory levels
      alternateFactory = 'Factory Sigma (Node 5)';
      costSavings = 15000; // Optimization savings
      recommendedActions.push('Authorize immediate overtime for all operational shifts.');
      recommendedActions.push('Monitor Extruder thermal loads closely; risk of bearing failure increases by 40% during sustained overcapacity.');
      break;

    case 'Equipment Breakdown':
      productionLoss = 20;
      revenueLoss = baseRevenuePerHour * 36 * 0.2 + 50000;
      deliveryDelay = 12;
      energyImpact = -15;
      carbonImpact = 0;
      recoveryTime = 36;
      alternateFactory = 'Factory Beta (Node 4)';
      costSavings = 30000;
      recommendedActions.push('Initiate emergency procurement for replacement drivetrain components.');
      recommendedActions.push('Shift affected workload to Factory Beta to maintain supply chain continuity.');
      break;

    case 'Network Failure':
      productionLoss = 10;
      revenueLoss = baseRevenuePerHour * 2;
      deliveryDelay = 2;
      energyImpact = 0;
      carbonImpact = 0;
      recoveryTime = 2;
      alternateFactory = 'Local Fallback Buffer';
      costSavings = 5000;
      recommendedActions.push('Switch to local intranet fallback mode for PLC controllers.');
      recommendedActions.push('Deploy edge-computing buffer to store telemetry until cloud connection is restored.');
      break;

    case 'Conveyor Failure':
      productionLoss = 40;
      revenueLoss = baseRevenuePerHour * 6;
      deliveryDelay = 8;
      energyImpact = -10;
      carbonImpact = 0;
      recoveryTime = 6;
      alternateFactory = 'Manual Routing Protocol';
      costSavings = 18000;
      recommendedActions.push('Deploy automated guided vehicles (AGVs) to bridge the faulty conveyor gap.');
      recommendedActions.push('Halt upstream feeder nodes to prevent physical material pileup.');
      break;

    default:
      throw new Error('Unknown scenario type: ' + scenarioType);
  }

  return {
    scenarioType,
    factoryId,
    timestamp: new Date(),
    metrics: {
      productionLoss,
      revenueLoss,
      deliveryDelay,
      carbonImpact,
      energyImpact,
      recoveryTime,
      alternateFactory,
      costSavings
    },
    aiRecommendations: recommendedActions
  };
};

module.exports = {
  simulateScenario
};
