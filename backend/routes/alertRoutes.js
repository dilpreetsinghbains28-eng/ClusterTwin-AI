const express = require('express');
const router = express.Router();
const {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
  acknowledgeAlert,
  getAlertAnalytics,
  dispatchMockEmail
} = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');
const cacheMiddleware = require('../middleware/cacheMiddleware');

router.get('/analytics', protect, cacheMiddleware(60), getAlertAnalytics);
router.post('/dispatch', protect, dispatchMockEmail);
router.put('/:id/acknowledge', protect, acknowledgeAlert);

router.route('/')
  .get(protect, cacheMiddleware(60), getAlerts)
  .post(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), createAlert);

router.route('/:id')
  .get(protect, getAlert)
  .put(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), updateAlert)
  .delete(protect, authorize('Admin'), deleteAlert);

module.exports = router;
