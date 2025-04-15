const app = require('./app');
const connectDB = require('./config/db');
const { simulateSensorData } = require('./utils/dataSimulator');
const { fetchWeatherData } = require('./utils/weatherAPI');
const config = require('./config/config');

// Connect to database
connectDB();

// Start server
const PORT = config.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Simulate device data for demo purposes
if (process.env.NODE_ENV === 'development') {
  const DEVICE_ID = 'demo-device-001';
  
  // Simulate sensor data every 5 seconds
  setInterval(async () => {
    await simulateSensorData(DEVICE_ID);
  }, 5000);
  
  // Fetch weather data every hour
  setInterval(async () => {
    await fetchWeatherData('EcoCity');
  }, 60 * 60 * 1000);
  
  // Initial calls
  simulateSensorData(DEVICE_ID);
  fetchWeatherData('EcoCity');
}