const SensorService = require('../services/sensorService');

exports.getSensors = async (req, res, next) => {
  try {
    const data = await SensorService.getAll(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getSensor = async (req, res, next) => {
  try {
    const data = await SensorService.getById(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Sensor not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.createSensor = async (req, res, next) => {
  try {
    const data = await SensorService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateSensor = async (req, res, next) => {
  try {
    const data = await SensorService.update(req.params.id, req.body);
    if (!data) {
      res.status(404);
      return next(new Error('Sensor not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteSensor = async (req, res, next) => {
  try {
    const data = await SensorService.delete(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Sensor not found'));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
