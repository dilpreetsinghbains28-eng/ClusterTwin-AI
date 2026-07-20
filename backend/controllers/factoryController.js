const FactoryService = require('../services/factoryService');

exports.getFactorys = async (req, res, next) => {
  try {
    const data = await FactoryService.getAll(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getFactory = async (req, res, next) => {
  try {
    const data = await FactoryService.getById(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Factory not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.createFactory = async (req, res, next) => {
  try {
    const data = await FactoryService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateFactory = async (req, res, next) => {
  try {
    const data = await FactoryService.update(req.params.id, req.body);
    if (!data) {
      res.status(404);
      return next(new Error('Factory not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteFactory = async (req, res, next) => {
  try {
    const data = await FactoryService.delete(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Factory not found'));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
