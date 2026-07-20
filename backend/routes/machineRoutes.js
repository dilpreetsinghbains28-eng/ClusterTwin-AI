const express = require('express');
const router = express.Router();
const {
  getMachines,
  getMachine,
  createMachine,
  updateMachine,
  deleteMachine
} = require('../controllers/machineController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMachines)
  .post(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), createMachine);

router.route('/:id')
  .get(protect, getMachine)
  .put(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), updateMachine)
  .delete(protect, authorize('Admin'), deleteMachine);

module.exports = router;
