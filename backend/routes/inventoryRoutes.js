const express = require('express');
const router = express.Router();
const {
  getInventorys,
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getInventorys)
  .post(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), createInventory);

router.route('/:id')
  .get(protect, getInventory)
  .put(protect, authorize('Admin', 'Government', 'Factory Owner', 'Factory Manager'), updateInventory)
  .delete(protect, authorize('Admin'), deleteInventory);

module.exports = router;
