const mongoose = require('mongoose');

const resourceTransferSchema = new mongoose.Schema({
  sourceFactory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true,
    index: true
  },
  destinationFactory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true,
    index: true
  },
  resourceType: {
    type: String,
    enum: ['Machines', 'Workers', 'Raw Materials', 'Spare Parts', 'Warehouse Space', 'Transport'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  distance: Number,
  cost: Number,
  etaHours: Number,
  expectedSavings: Number,
  carbonSavings: Number,
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Completed'],
    default: 'Pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ResourceTransfer', resourceTransferSchema);
