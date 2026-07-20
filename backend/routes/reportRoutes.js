const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/v1/reports/generate
// @desc    Dynamically generate reports (JSON, PDF, Excel) with filtering and pagination
// @access  Private
router.get('/generate', protect, reportController.generateReport);

module.exports = router;
