const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  modelNumber: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['CNC', 'Assembly Arm', 'Conveyor', 'Furnace', 'Packaging', 'Inspection', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Idle', 'Maintenance', 'Fault'],
    default: 'Active',
    index: true
  },
  installationDate: {
    type: Date
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  maintenanceSchedule: {
    nextMaintenance: Date,
    lastMaintenance: Date
  }
}, {
  timestamps: true
});

machineSchema.index({ factory: 1, status: 1 });
machineSchema.index({ type: 1 });

module.exports = mongoose.model('Machine', machineSchema);
