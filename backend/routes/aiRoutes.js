const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/v1/ai/insights
// @desc    Get AI recommendations and health scores for a specific factory
// @access  Private
router.get('/insights', protect, aiController.getFactoryInsights);

// @route   GET /api/v1/ai/recommendations
// @desc    Get historical and active recommendations
// @access  Private
router.get('/recommendations', protect, aiController.getRecommendations);

// @route   PUT /api/v1/ai/recommendations/:id/status
// @desc    Update status of a recommendation
// @access  Private (Admin/Manager)
router.put('/recommendations/:id/status', protect, authorize('Admin', 'Manager'), aiController.updateRecommendationStatus);

// @route   POST /api/v1/ai/chat
// @desc    Interact with AI Copilot
// @access  Private
router.post('/chat', protect, aiController.chatCopilot);

module.exports = router;
