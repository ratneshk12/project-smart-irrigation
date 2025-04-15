const IrrigationLog = require('../models/IrrigationLog');
const SensorData = require('../models/SensorData');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');

// @desc    Get all irrigation logs
// @route   GET /api/v1/irrigation
// @route   GET /api/v1/devices/:deviceId/irrigation
// @access  Private
exports.getIrrigationLogs = asyncHandler(async (req, res, next) => {
  if (req.params.deviceId) {
    const logs = await IrrigationLog.find({ deviceId: req.params.deviceId })
      .sort({ executedAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Trigger irrigation
// @route   POST /api/v1/irrigation
// @access  Private
exports.triggerIrrigation = asyncHandler(async (req, res, next) => {
  const { deviceId, action, duration } = req.body;

  // Get latest sensor data
  const sensorData = await SensorData.findOne({ deviceId })
    .sort({ recordedAt: -1 })
    .limit(1);

  if (!sensorData) {
    return next(
      new ErrorResponse(`No sensor data found for device ${deviceId}`, 404)
    );
  }

  // Create irrigation log
  const log = await IrrigationLog.create({
    deviceId,
    action,
    duration,
    moistureBefore: sensorData.moisture,
    moistureAfter: sensorData.moisture + (duration * 0.5), // Simulate moisture increase
    triggeredBy: req.user.id
  });

  // Simulate updating sensor data after irrigation
  const newSensorData = await SensorData.create({
    deviceId,
    moisture: sensorData.moisture + (duration * 0.5),
    temperature: sensorData.temperature - 1, // Temp might drop slightly
    humidity: sensorData.humidity + 5 // Humidity might increase
  });

  res.status(201).json({
    success: true,
    data: {
      log,
      newSensorData
    }
  });
});

// @desc    Get irrigation statistics
// @route   GET /api/v1/irrigation/stats/:deviceId
// @access  Private
exports.getIrrigationStats = asyncHandler(async (req, res, next) => {
  const stats = await IrrigationLog.aggregate([
    {
      $match: { 
        deviceId: req.params.deviceId,
        executedAt: { 
          $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
        } 
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: "$executedAt" },
        count: { $sum: 1 },
        totalDuration: { $sum: "$duration" },
        avgMoistureIncrease: { $avg: { $subtract: ["$moistureAfter", "$moistureBefore"] } }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});