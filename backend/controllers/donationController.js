const Donation = require('../models/Donation');
const Donor = require('../models/Donor');

// Helper: Calculate next eligible date (3 months after donation)
const calculateNextEligibleDate = (donationDate) => {
  const date = new Date(donationDate);
  date.setMonth(date.getMonth() + 3);
  return date;
};

// @desc    Get all donations (admin) or donor's own donations
// @route   GET /api/donations
// @access  Private
const getDonations = async (req, res) => {
  try {
    let filter = {};

    // Donors can only see their own donations
    if (req.user.role === 'donor') {
      const donor = await Donor.findOne({ userId: req.user._id });
      if (!donor) {
        return res.status(404).json({ success: false, message: 'Donor profile not found' });
      }
      filter.donorId = donor._id;
    }

    // Optional filter by donorId for admin
    if (req.user.role === 'admin' && req.query.donorId) {
      filter.donorId = req.query.donorId;
    }

    const donations = await Donation.find(filter)
      .populate('donorId', 'donorName bloodGroup city')
      .sort({ donationDate: -1 });

    return res.status(200).json({
      success: true,
      data: donations,
      count: donations.length,
    });
  } catch (error) {
    console.error('GetDonations error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching donations' });
  }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Private
const getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('donorId', 'donorName bloodGroup');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    return res.status(200).json({ success: true, data: donation });
  } catch (error) {
    console.error('GetDonation error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create donation record
// @route   POST /api/donations
// @access  Private (admin)
const createDonation = async (req, res) => {
  try {
    const { donorId, donationDate, hospitalName, unitsDonated, notes } = req.body;

    if (!donorId || !hospitalName) {
      return res.status(400).json({ success: false, message: 'Donor ID and hospital name are required' });
    }

    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    const date = donationDate ? new Date(donationDate) : new Date();
    const nextEligibleDate = calculateNextEligibleDate(date);

    const donation = await Donation.create({
      donorId,
      donationDate: date,
      hospitalName,
      unitsDonated: unitsDonated || 1,
      nextEligibleDate,
      notes,
    });

    // Update donor's last donation date and next eligible date
    donor.lastDonationDate = date;
    donor.nextEligibleDate = nextEligibleDate;

    // Check if still eligible (next eligible date in the future means not eligible yet)
    const now = new Date();
    donor.eligibilityStatus = nextEligibleDate > now ? 'Not Eligible' : 'Eligible';
    await donor.save();

    const populatedDonation = await Donation.findById(donation._id).populate(
      'donorId',
      'donorName bloodGroup'
    );

    return res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      data: populatedDonation,
    });
  } catch (error) {
    console.error('CreateDonation error:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    return res.status(500).json({ success: false, message: 'Server error creating donation' });
  }
};

// @desc    Update donation record
// @route   PUT /api/donations/:id
// @access  Private (admin)
const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    const { donationDate, hospitalName, unitsDonated, notes } = req.body;

    let updateData = {};
    if (hospitalName) updateData.hospitalName = hospitalName;
    if (unitsDonated) updateData.unitsDonated = unitsDonated;
    if (notes !== undefined) updateData.notes = notes;

    if (donationDate) {
      updateData.donationDate = new Date(donationDate);
      updateData.nextEligibleDate = calculateNextEligibleDate(new Date(donationDate));
    }

    const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('donorId', 'donorName bloodGroup');

    // Recalculate donor eligibility based on most recent donation
    const latestDonation = await Donation.findOne({ donorId: donation.donorId }).sort({ donationDate: -1 });
    if (latestDonation) {
      const donor = await Donor.findById(donation.donorId);
      if (donor) {
        donor.lastDonationDate = latestDonation.donationDate;
        donor.nextEligibleDate = latestDonation.nextEligibleDate;
        const now = new Date();
        donor.eligibilityStatus =
          latestDonation.nextEligibleDate > now ? 'Not Eligible' : 'Eligible';
        await donor.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Donation updated successfully',
      data: updatedDonation,
    });
  } catch (error) {
    console.error('UpdateDonation error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error updating donation' });
  }
};

// @desc    Delete donation record
// @route   DELETE /api/donations/:id
// @access  Private (admin)
const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    await Donation.findByIdAndDelete(req.params.id);

    // Recalculate donor eligibility
    const donor = await Donor.findById(donation.donorId);
    if (donor) {
      const latestDonation = await Donation.findOne({ donorId: donation.donorId }).sort({
        donationDate: -1,
      });

      if (latestDonation) {
        donor.lastDonationDate = latestDonation.donationDate;
        donor.nextEligibleDate = latestDonation.nextEligibleDate;
        const now = new Date();
        donor.eligibilityStatus =
          latestDonation.nextEligibleDate > now ? 'Not Eligible' : 'Eligible';
      } else {
        // No more donations — reset to Eligible
        donor.lastDonationDate = null;
        donor.nextEligibleDate = null;
        donor.eligibilityStatus = 'Eligible';
      }
      await donor.save();
    }

    return res.status(200).json({ success: true, message: 'Donation deleted successfully' });
  } catch (error) {
    console.error('DeleteDonation error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting donation' });
  }
};

module.exports = { getDonations, getDonation, createDonation, updateDonation, deleteDonation };
