const ProductionService = require('../services/productionService');

exports.getProductions = async (req, res, next) => {
  try {
    const data = await ProductionService.getAll(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getProduction = async (req, res, next) => {
  try {
    const data = await ProductionService.getById(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Production not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.createProduction = async (req, res, next) => {
  try {
    const data = await ProductionService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateProduction = async (req, res, next) => {
  try {
    const data = await ProductionService.update(req.params.id, req.body);
    if (!data) {
      res.status(404);
      return next(new Error('Production not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduction = async (req, res, next) => {
  try {
    const data = await ProductionService.delete(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Production not found'));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
