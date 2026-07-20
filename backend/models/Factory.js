const mongoose = require('mongoose');

const factorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Factory name is required'],
    trim: true,
    index: true
  },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  industry: {
    type: String,
    enum: ['Automotive', 'Electronics', 'Textiles', 'Aerospace', 'Pharmaceuticals', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Operational', 'Maintenance', 'Degraded', 'Offline'],
    default: 'Operational'
  },
  metrics: {
    oee: { type: Number, default: 0 },
    productionEfficiency: { type: Number, default: 0 },
    energyRating: { type: String, default: 'N/A' }
  }
}, {
  timestamps: true
});

factorySchema.index({ 'location.country': 1, status: 1 });

module.exports = mongoose.model('Factory', factorySchema);
