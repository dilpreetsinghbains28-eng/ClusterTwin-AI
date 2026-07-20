const express = require('express');
const router = express.Router();
const {
  getMaintenances,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMaintenances)
  .post(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), createMaintenance);

router.route('/:id')
  .get(protect, getMaintenance)
  .put(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), updateMaintenance)
  .delete(protect, authorize('Admin'), deleteMaintenance);

module.exports = router;
