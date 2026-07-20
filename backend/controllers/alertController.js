const AlertService = require('../services/alertService');

exports.getAlerts = async (req, res, next) => {
  try {
    const data = await AlertService.getAll(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

exports.getAlert = async (req, res, next) => {
  try {
    const data = await AlertService.getById(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Alert not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.createAlert = async (req, res, next) => {
  try {
    const data = await AlertService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.updateAlert = async (req, res, next) => {
  try {
    const data = await AlertService.update(req.params.id, req.body);
    if (!data) {
      res.status(404);
      return next(new Error('Alert not found'));
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.deleteAlert = async (req, res, next) => {
  try {
    const data = await AlertService.delete(req.params.id);
    if (!data) {
      res.status(404);
      return next(new Error('Alert not found'));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

const Alert = require('../models/Alert');

exports.acknowledgeAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
    
    alert.isAcknowledged = true;
    alert.acknowledgedAt = Date.now();
    if (req.user) alert.acknowledgedBy = req.user._id;
    
    await alert.save();
    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

exports.getAlertAnalytics = async (req, res, next) => {
  try {
    // Group by severity
    const counts = await Alert.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    
    // Group by autoDismissed
    const dismissed = await Alert.countDocuments({ autoDismissed: true });
    const acknowledged = await Alert.countDocuments({ isAcknowledged: true });
    
    res.status(200).json({ 
      success: true, 
      data: { counts, dismissed, acknowledged } 
    });
  } catch (error) {
    next(error);
  }
};

exports.dispatchMockEmail = async (req, res, next) => {
  try {
    const { email, alertId } = req.body;
    const alert = await Alert.findById(alertId).populate('factory machine');
    
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });

    // Email mock dispatch

    res.status(200).json({ success: true, message: 'Email dispatched successfully (check console)' });
  } catch (error) {
    next(error);
  }
};
