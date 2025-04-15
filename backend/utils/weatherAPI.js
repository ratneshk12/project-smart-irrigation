const axios = require('axios');
const WeatherData = require('../models/WeatherData');
const config = require('../config/config');

// Fetch weather data from external API
exports.fetchWeatherData = async (location) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${config.WEATHER_API_KEY}&units=metric`
    );

    const weatherData = {
      location: response.data.name,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      precipitation: response.data.rain ? response.data.rain['1h'] || 0 : 0,
      windSpeed: response.data.wind.speed,
      forecast: response.data.weather[0].main
    };

    // Save to database
    await WeatherData.create(weatherData);

    return weatherData;
  } catch (err) {
    console.error('Error fetching weather data:', err.message);
    // Return last known weather data if available
    const lastData = await WeatherData.findOne({ location })
      .sort({ recordedAt: -1 });
    return lastData || null;
  }
};