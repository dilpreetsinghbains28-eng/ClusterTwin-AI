const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['Temperature', 'Vibration', 'Pressure', 'Voltage', 'Optical', 'Flow', 'Current', 'Power', 'RPM', 'Runtime', 'ProductionCount'],
    required: true,
    index: true
  },
  model: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Online', 'Offline', 'Calibrating', 'Error'],
    default: 'Online'
  },
  unitOfMeasurement: {
    type: String,
    required: true
  },
  thresholds: {
    warningHigh: Number,
    criticalHigh: Number,
    warningLow: Number,
    criticalLow: Number
  }
}, {
  timestamps: true
});

sensorSchema.index({ machine: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Sensor', sensorSchema);
