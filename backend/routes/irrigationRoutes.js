const express = require('express');
const {
  getIrrigationLogs,
  triggerIrrigation,
  getIrrigationStats
} = require('../controllers/irrigationController');

const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getIrrigationLogs)
  .post(protect, triggerIrrigation);

router.route('/stats/:deviceId')
  .get(protect, getIrrigationStats);

module.exports = router;