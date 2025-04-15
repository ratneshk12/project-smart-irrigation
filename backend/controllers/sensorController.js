const SensorData = require('../models/SensorData');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');

// @desc    Get all sensor data
// @route   GET /api/v1/sensordata
// @route   GET /api/v1/devices/:deviceId/sensordata
// @access  Private
exports.getSensorData = asyncHandler(async (req, res, next) => {
  if (req.params.deviceId) {
    const data = await SensorData.find({ deviceId: req.params.deviceId })
      .sort({ recordedAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single sensor data
// @route   GET /api/v1/sensordata/:id
// @access  Private
exports.getSingleSensorData = asyncHandler(async (req, res, next) => {
  const data = await SensorData.findById(req.params.id);

  if (!data) {
    return next(
      new ErrorResponse(`No sensor data found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Add sensor data
// @route   POST /api/v1/sensordata
// @access  Private
exports.addSensorData = asyncHandler(async (req, res, next) => {
  const { deviceId, moisture, temperature, humidity } = req.body;

  const data = await SensorData.create({
    deviceId,
    moisture,
    temperature,
    humidity
  });

  res.status(201).json({
    success: true,
    data
  });
});

// @desc    Get latest sensor data
// @route   GET /api/v1/sensordata/latest/:deviceId
// @access  Private
exports.getLatestSensorData = asyncHandler(async (req, res, next) => {
  const data = await SensorData.findOne({ deviceId: req.params.deviceId })
    .sort({ recordedAt: -1 })
    .limit(1);

  if (!data) {
    return next(
      new ErrorResponse(`No sensor data found for device ${req.params.deviceId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data
  });
});

// @desc    Get sensor data statistics
// @route   GET /api/v1/sensordata/stats/:deviceId
// @access  Private
exports.getSensorStats = asyncHandler(async (req, res, next) => {
  const stats = await SensorData.aggregate([
    {
      $match: { 
        deviceId: req.params.deviceId,
        recordedAt: { 
          $gte: new Date(new Date() - 24 * 60 * 60 * 1000) 
        } 
      }
    },
    {
      $group: {
        _id: null,
        avgMoisture: { $avg: "$moisture" },
        avgTemp: { $avg: "$temperature" },
        avgHumidity: { $avg: "$humidity" },
        minMoisture: { $min: "$moisture" },
        maxMoisture: { $max: "$moisture" }
      }
    }
  ]);

  if (stats.length === 0) {
    return next(
      new ErrorResponse(`No statistics found for device ${req.params.deviceId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: stats[0]
  });
});