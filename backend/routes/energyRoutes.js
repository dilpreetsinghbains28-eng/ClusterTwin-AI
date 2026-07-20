const express = require('express');
const router = express.Router();
const {
  getEnergys,
  getEnergy,
  createEnergy,
  updateEnergy,
  deleteEnergy
} = require('../controllers/energyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getEnergys)
  .post(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), createEnergy);

router.route('/:id')
  .get(protect, getEnergy)
  .put(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), updateEnergy)
  .delete(protect, authorize('Admin'), deleteEnergy);

module.exports = router;
