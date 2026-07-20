const MaintenanceService = require('../services/maintenanceService');

exports.getMaintenances = async (req, res, next) => {
  try {
    const data = await MaintenanceService.getAll(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getMaintenance = async (req, res, next) => {
  try {
    const data = await MaintenanceService.getById(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Maintenance not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.createMaintenance = async (req, res, next) => {
  try {
    const data = await MaintenanceService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateMaintenance = async (req, res, next) => {
  try {
    const data = await MaintenanceService.update(req.params.id, req.body);
    if (!data) {
      res.status(404);
      return next(new Error('Maintenance not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteMaintenance = async (req, res, next) => {
  try {
    const data = await MaintenanceService.delete(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Maintenance not found'));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
