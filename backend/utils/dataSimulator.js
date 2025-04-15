const SensorData = require('../models/SensorData');
const IrrigationLog = require('../models/IrrigationLog');

// Simulate sensor data for demo purposes
exports.simulateSensorData = async (deviceId) => {
  // Get latest data to base simulation on
  const latestData = await SensorData.findOne({ deviceId })
    .sort({ recordedAt: -1 });

  let moisture = 50;
  let temperature = 22;
  let humidity = 65;

  if (latestData) {
    moisture = latestData.moisture;
    temperature = latestData.temperature;
    humidity = latestData.humidity;
  }

  // Simulate natural changes
  moisture = Math.max(10, moisture - (Math.random() * 0.5));
  temperature = temperature + (Math.random() * 2 - 1);
  humidity = humidity + (Math.random() * 3 - 1.5);

  // Check if we need to simulate irrigation
  const lastIrrigation = await IrrigationLog.findOne({ deviceId })
    .sort({ executedAt: -1 });

  if (lastIrrigation && (new Date() - lastIrrigation.executedAt < 1000 * 60 * 60)) {
    // Within 1 hour of irrigation, moisture should be higher
    moisture = Math.min(100, moisture + (Math.random() * 2));
    temperature = temperature - 0.5; // Temp might drop slightly
    humidity = humidity + 2; // Humidity might increase
  }

  // Create new sensor data
  const newData = await SensorData.create({
    deviceId,
    moisture: parseFloat(moisture.toFixed(2)),
    temperature: parseFloat(temperature.toFixed(2)),
    humidity: parseFloat(humidity.toFixed(2))
  });

  return newData;
};