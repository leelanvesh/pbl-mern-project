const express = require('express');
const router = express.Router();
const { getDashboardStats, getBloodGroupReport } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats', authorize('admin'), getDashboardStats);
router.get('/blood-groups', authorize('admin'), getBloodGroupReport);

module.exports = router;
