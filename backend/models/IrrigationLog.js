const mongoose = require('mongoose');

const irrigationLogSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: [true, 'Please provide device ID']
  },
  action: {
    type: String,
    enum: ['auto', 'manual', 'scheduled', 'emergency'],
    required: [true, 'Please provide action type']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide duration in seconds']
  },
  moistureBefore: {
    type: Number,
    required: [true, 'Please provide moisture level before irrigation']
  },
  moistureAfter: {
    type: Number,
    required: [true, 'Please provide moisture level after irrigation']
  },
  triggeredBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  executedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IrrigationLog', irrigationLogSchema);