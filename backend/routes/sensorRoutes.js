const express = require('express');
const {
  getSensorData,
  getSingleSensorData,
  addSensorData,
  getLatestSensorData,
  getSensorStats
} = require('../controllers/sensorController');

const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getSensorData)
  .post(protect, addSensorData);

router.route('/:id')
  .get(protect, getSingleSensorData);

router.route('/latest/:deviceId')
  .get(protect, getLatestSensorData);

router.route('/stats/:deviceId')
  .get(protect, getSensorStats);

module.exports = router;