const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Predictive Maintenance',
      'Machine Failure Prediction',
      'Idle Machine Detection',
      'Energy Optimization',
      'Carbon Reduction',
      'Production Optimization',
      'Resource Sharing',
      'Inventory Forecast',
      'Worker Allocation'
    ]
  },
  target: {
    type: String,
    required: true,
    description: 'The specific machine, system, or process this recommendation targets'
  },
  severity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  estimatedSavings: {
    type: Number,
    default: 0
  },
  estimatedProductionGain: {
    type: Number,
    default: 0
  },
  explanation: {
    type: String,
    required: true
  },
  suggestedAction: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Applied', 'Dismissed']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
