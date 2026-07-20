const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/v1/simulations/run
// @desc    Run a What-If Scenario and generate an impact report
// @access  Private
router.post('/run', protect, simulationController.runSimulation);

// @route   GET /api/v1/simulations
// @desc    Get simulation history for a factory
// @access  Private
router.get('/', protect, simulationController.getSimulationHistory);

module.exports = router;
