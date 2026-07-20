const Machine = require('../models/Machine');
const Simulation = require('../models/Simulation');
const { simulateScenario } = require('../scripts/scenarioEngine');

exports.runSimulation = async (req, res) => {
  try {
    const { factoryId, scenarioType } = req.body;

    if (!factoryId || !scenarioType) {
      return res.status(400).json({ success: false, error: 'factoryId and scenarioType are required' });
    }

    // Determine how many machines are in the factory for scale calculations
    const activeMachinesCount = await Machine.countDocuments({ factory: factoryId, status: { $ne: 'Maintenance' } });

    const startTime = Date.now();

    // Run the engine heuristics
    const report = simulateScenario(factoryId, scenarioType, activeMachinesCount || 4); // Default to 4 if none found for some reason

    const executionTimeMs = Date.now() - startTime;

    // Persist the report to the database
    const simulationDoc = await Simulation.create({
      factory: factoryId,
      createdBy: req.user._id,
      name: `${scenarioType} Scenario Analysis`,
      description: `Generated What-If analysis for ${scenarioType}`,
      status: 'Completed',
      parameters: {
        type: scenarioType,
        baseActiveMachines: activeMachinesCount
      },
      results: {
        metrics: report.metrics,
        aiRecommendations: report.aiRecommendations
      },
      metrics: {
        executionTimeMs,
        confidenceScore: 85 // Heuristic confidence
      },
      startedAt: new Date(startTime),
      completedAt: new Date()
    });

    return res.status(200).json({
      success: true,
      data: simulationDoc
    });

  } catch (error) {
    
    return res.status(500).json({ success: false, error: 'Failed to run simulation scenario' });
  }
};

exports.getSimulationHistory = async (req, res) => {
  try {
    const { factoryId } = req.query;
    const query = {};
    if (factoryId) query.factory = factoryId;

    const history = await Simulation.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    
    return res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
};
