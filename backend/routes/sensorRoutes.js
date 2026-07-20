const express = require('express');
const router = express.Router();
const {
  getSensors,
  getSensor,
  createSensor,
  updateSensor,
  deleteSensor
} = require('../controllers/sensorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getSensors)
  .post(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), createSensor);

router.route('/:id')
  .get(protect, getSensor)
  .put(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), updateSensor)
  .delete(protect, authorize('Admin'), deleteSensor);

module.exports = router;
