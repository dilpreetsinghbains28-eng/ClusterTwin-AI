const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true,
    index: true
  },
  batchId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  targetQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  actualQuantity: {
    type: Number,
    default: 0
  },
  defects: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Halted'],
    default: 'Scheduled',
    index: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  }
}, {
  timestamps: true
});

productionSchema.index({ factory: 1, status: 1 });
productionSchema.index({ startTime: -1 });

module.exports = mongoose.model('Production', productionSchema);
