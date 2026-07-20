const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true,
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  type: {
    type: String,
    enum: ['Preventive', 'Corrective', 'Predictive', 'Condition-Based'],
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled',
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  scheduledDate: {
    type: Date,
    required: true,
    index: true
  },
  completedDate: {
    type: Date
  },
  cost: {
    parts: { type: Number, default: 0 },
    labor: { type: Number, default: 0 }
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

maintenanceSchema.index({ machine: 1, status: 1 });
maintenanceSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
