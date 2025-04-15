const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, 'Please provide location']
  },
  temperature: {
    type: Number,
    required: [true, 'Please provide temperature']
  },
  humidity: {
    type: Number,
    required: [true, 'Please provide humidity']
  },
  precipitation: {
    type: Number,
    required: [true, 'Please provide precipitation chance']
  },
  windSpeed: {
    type: Number,
    required: [true, 'Please provide wind speed']
  },
  forecast: {
    type: String,
    required: [true, 'Please provide forecast']
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WeatherData', weatherDataSchema);