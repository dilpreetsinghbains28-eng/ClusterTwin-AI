const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Running', 'Completed', 'Failed', 'Aborted'],
    default: 'Pending',
    index: true
  },
  parameters: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  results: {
    type: mongoose.Schema.Types.Mixed
  },
  metrics: {
    executionTimeMs: Number,
    confidenceScore: Number
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

simulationSchema.index({ factory: 1, status: 1 });
simulationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Simulation', simulationSchema);
