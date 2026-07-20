const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/v1/transfers/recommend
// @desc    Get AI recommendation for resource transfer
// @access  Private
router.post('/recommend', protect, transferController.recommendTransfer);

// @route   POST /api/v1/transfers/execute
// @desc    Execute and log a transfer
// @access  Private
router.post('/execute', protect, transferController.executeTransfer);

// @route   GET /api/v1/transfers/history
// @desc    Get transfer history for the cluster
// @access  Private
router.get('/history', protect, transferController.getTransferHistory);

module.exports = router;
