const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: [true, 'Please provide device ID']
  },
  moisture: {
    type: Number,
    required: [true, 'Please provide moisture level'],
    min: [0, 'Moisture cannot be negative'],
    max: [100, 'Moisture cannot exceed 100%']
  },
  temperature: {
    type: Number,
    required: [true, 'Please provide temperature']
  },
  humidity: {
    type: Number,
    required: [true, 'Please provide humidity'],
    min: [0, 'Humidity cannot be negative'],
    max: [100, 'Humidity cannot exceed 100%']
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
sensorDataSchema.index({ deviceId: 1, recordedAt: -1 });

module.exports = mongoose.model('SensorData', sensorDataSchema);