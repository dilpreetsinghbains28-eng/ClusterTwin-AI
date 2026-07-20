const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  sensor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sensor',
    required: true,
    index: true
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: true,
    index: true
  },
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  }
}, {
  // Disable automatic timestamps for massive time-series collections
  timestamps: false,
  // Ensure we can handle massive scale using a timeseries collection in MongoDB 5.0+
  timeseries: {
    timeField: 'timestamp',
    metaField: 'sensor',
    granularity: 'seconds'
  }
});

// Index to quickly query readings by sensor over time
sensorReadingSchema.index({ sensor: 1, timestamp: -1 });
sensorReadingSchema.index({ machine: 1, timestamp: -1 });
// TTL Index for auto-purging old data (7 days)
sensorReadingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
