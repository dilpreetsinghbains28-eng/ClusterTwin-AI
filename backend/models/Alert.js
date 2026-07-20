const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true,
    index: true
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    index: true
  },
  sensor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor'
  },
  type: {
    type: String,
    enum: ['Anomaly', 'Threshold Breach', 'System Error', 'Predictive Warning', 'AI Recommendation'],
    required: true,
    index: true
  },
  severity: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isResolved: {
    type: Boolean,
    default: false,
    index: true
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: {
    type: String,
    trim: true
  },
  // Smart Alerts Fields
  isAcknowledged: {
    type: Boolean,
    default: false
  },
  acknowledgedAt: {
    type: Date
  },
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  autoDismissed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

alertSchema.index({ factory: 1, isResolved: 1, severity: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
