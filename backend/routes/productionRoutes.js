const express = require('express');
const router = express.Router();
const {
  getProductions,
  getProduction,
  createProduction,
  updateProduction,
  deleteProduction
} = require('../controllers/productionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProductions)
  .post(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), createProduction);

router.route('/:id')
  .get(protect, getProduction)
  .put(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), updateProduction)
  .delete(protect, authorize('Admin'), deleteProduction);

module.exports = router;
