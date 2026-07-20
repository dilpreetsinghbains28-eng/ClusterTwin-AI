const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
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
  consumptionKwh: {
    type: Number,
    required: true
  },
  cost: {
    type: Number
  },
  peakDemandKw: {
    type: Number
  },
  recordedAt: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  }
}, {
  timestamps: false,
  timeseries: {
    timeField: 'recordedAt',
    metaField: 'factory',
    granularity: 'minutes'
  }
});

energySchema.index({ factory: 1, recordedAt: -1 });

module.exports = mongoose.model('Energy', energySchema);
