module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
    COOKIE_EXPIRE: process.env.COOKIE_EXPIRE || 30,
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    SMTP_PORT: process.env.SMTP_PORT || 2525,
    SMTP_EMAIL: process.env.SMTP_EMAIL || 'your-email',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'your-password',
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@aquasmart.com',
    FROM_NAME: process.env.FROM_NAME || 'AquaSmart',
    WEATHER_API_KEY: process.env.WEATHER_API_KEY || 'your-weather-api-key'
  };