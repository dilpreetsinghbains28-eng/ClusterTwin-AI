const InventoryService = require('../services/inventoryService');

exports.getInventorys = async (req, res, next) => {
  try {
    const data = await InventoryService.getAll(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getInventory = async (req, res, next) => {
  try {
    const data = await InventoryService.getById(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Inventory not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.createInventory = async (req, res, next) => {
  try {
    const data = await InventoryService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    const data = await InventoryService.update(req.params.id, req.body);
    if (!data) {
      res.status(404);
      return next(new Error('Inventory not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteInventory = async (req, res, next) => {
  try {
    const data = await InventoryService.delete(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Inventory not found'));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
