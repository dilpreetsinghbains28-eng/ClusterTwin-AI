const EnergyService = require('../services/energyService');

exports.getEnergys = async (req, res, next) => {
  try {
    const data = await EnergyService.getAll(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getEnergy = async (req, res, next) => {
  try {
    const data = await EnergyService.getById(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Energy not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.createEnergy = async (req, res, next) => {
  try {
    const data = await EnergyService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateEnergy = async (req, res, next) => {
  try {
    const data = await EnergyService.update(req.params.id, req.body);
    if (!data) {
      res.status(404);
      return next(new Error('Energy not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteEnergy = async (req, res, next) => {
  try {
    const data = await EnergyService.delete(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Energy not found'));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
