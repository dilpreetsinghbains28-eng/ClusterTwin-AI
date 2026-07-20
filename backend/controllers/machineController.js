const MachineService = require('../services/machineService');

exports.getMachines = async (req, res, next) => {
  try {
    const data = await MachineService.getAll(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getMachine = async (req, res, next) => {
  try {
    const data = await MachineService.getById(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Machine not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.createMachine = async (req, res, next) => {
  try {
    const data = await MachineService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateMachine = async (req, res, next) => {
  try {
    const data = await MachineService.update(req.params.id, req.body);
    if (!data) {
      res.status(404);
      return next(new Error('Machine not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteMachine = async (req, res, next) => {
  try {
    const data = await MachineService.delete(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Machine not found'));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
