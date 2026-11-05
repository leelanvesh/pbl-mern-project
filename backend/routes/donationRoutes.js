const express = require('express');
const router = express.Router();
const {
  getDonations,
  getDonation,
  createDonation,
  updateDonation,
  deleteDonation,
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Get donations (admin sees all, donor sees own)
router.get('/', getDonations);
router.get('/:id', getDonation);

// Admin only: create, update, delete
router.post('/', authorize('admin'), createDonation);
router.put('/:id', authorize('admin'), updateDonation);
router.delete('/:id', authorize('admin'), deleteDonation);

module.exports = router;
