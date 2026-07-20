const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  factory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    index: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Production', 'Energy', 'Maintenance', 'Carbon', 'Comprehensive'],
    required: true,
    index: true
  },
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  format: {
    type: String,
    enum: ['PDF', 'CSV', 'JSON'],
    default: 'PDF'
  },
  s3Url: {
    type: String,
    trim: true
  },
  dataSnapshot: {
    type: mongoose.Schema.Types.Mixed // For storing raw JSON snapshots if needed
  }
}, {
  timestamps: true
});

reportSchema.index({ factory: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
