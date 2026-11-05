const express = require('express');
const {
  getDashboard,
  getBloodAvailability,
  getReports
} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/dashboard', verifyToken, authorize('admin'), getDashboard);
router.get('/blood-availability', verifyToken, authorize('admin', 'hospital'), getBloodAvailability);
router.get('/reports', verifyToken, authorize('admin'), getReports);

module.exports = router;
