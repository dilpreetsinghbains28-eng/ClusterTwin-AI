const express = require('express');
const router = express.Router();
const {
  getFactorys,
  getFactory,
  createFactory,
  updateFactory,
  deleteFactory
} = require('../controllers/factoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const cacheMiddleware = require('../middleware/cacheMiddleware');

router.route('/')
  .get(protect, cacheMiddleware(60), getFactorys)
  .post(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), createFactory);

router.route('/:id')
  .get(protect, cacheMiddleware(60), getFactory)
  .put(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), updateFactory)
  .delete(protect, authorize('Admin'), deleteFactory);

module.exports = router;
