const express = require('express');
const router = express.Router();
const {
  getDonors,
  getDonor,
  getDonorByUserId,
  createDonor,
  updateDonor,
  deleteDonor,
  verifyDonor,
  getDonorDonations,
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Admin and hospital can get all donors with filters
router.get('/', getDonors);

// Get donor by user ID (donor own profile)
router.get('/user/:userId', getDonorByUserId);

// Get single donor
router.get('/:id', getDonor);

// Get donor's donations
router.get('/:id/donations', getDonorDonations);

// Admin only: create donor
router.post('/', authorize('admin'), createDonor);

// Admin or donor (own profile): update donor
router.put('/:id', updateDonor);

// Admin only: delete donor
router.delete('/:id', authorize('admin'), deleteDonor);

// Admin only: verify donor
router.put('/:id/verify', authorize('admin'), verifyDonor);

module.exports = router;
