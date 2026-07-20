const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true,
    index: true
  },
  sku: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Raw Material', 'Work in Progress', 'Finished Good', 'Spare Part'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true
  },
  reorderLevel: {
    type: Number,
    required: true
  },
  locationInPlant: {
    type: String,
    trim: true
  },
  lastRestocked: {
    type: Date
  }
}, {
  timestamps: true
});

inventorySchema.index({ factory: 1, sku: 1 }, { unique: true });
inventorySchema.index({ category: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
