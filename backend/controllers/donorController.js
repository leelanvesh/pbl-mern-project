const Donor = require('../models/Donor');
const User = require('../models/User');
const Donation = require('../models/Donation');

// @desc    Get all donors (with optional filters)
// @route   GET /api/donors
// @access  Private (admin, hospital)
const getDonors = async (req, res) => {
  try {
    const { bloodGroup, city, eligibilityStatus, search } = req.query;

    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (eligibilityStatus) filter.eligibilityStatus = eligibilityStatus;
    if (search) {
      filter.$or = [
        { donorName: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const donors = await Donor.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Donors retrieved successfully',
      data: donors,
      count: donors.length,
    });
  } catch (error) {
    console.error('GetDonors error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching donors' });
  }
};

// @desc    Get single donor
// @route   GET /api/donors/:id
// @access  Private
const getDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    return res.status(200).json({ success: true, data: donor });
  } catch (error) {
    console.error('GetDonor error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching donor' });
  }
};

// @desc    Get donor by userId (for donor's own profile)
// @route   GET /api/donors/user/:userId
// @access  Private (donor - own profile)
const getDonorByUserId = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.params.userId });

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor profile not found' });
    }

    // Donors can only view their own profile unless admin
    if (req.user.role === 'donor' && donor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({ success: true, data: donor });
  } catch (error) {
    console.error('GetDonorByUserId error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a donor (Admin use)
// @route   POST /api/donors
// @access  Private (admin)
const createDonor = async (req, res) => {
  try {
    const { donorName, bloodGroup, age, gender, mobile, city, eligibilityStatus, email, password } =
      req.body;

    if (!donorName || !bloodGroup || !age || !gender || !mobile || !city) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    // Admin creating a donor must also create a user account
    if (email && password) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: 'Email already registered' });
      }

      const user = await User.create({ name: donorName, email, password, role: 'donor' });
      const donor = await Donor.create({
        userId: user._id,
        donorName,
        bloodGroup,
        age: parseInt(age),
        gender,
        mobile,
        city,
        eligibilityStatus: eligibilityStatus || 'Pending',
      });

      return res.status(201).json({
        success: true,
        message: 'Donor created successfully',
        data: donor,
      });
    }

    return res.status(400).json({ success: false, message: 'Email and password are required to create a donor' });
  } catch (error) {
    console.error('CreateDonor error:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    return res.status(500).json({ success: false, message: 'Server error creating donor' });
  }
};

// @desc    Update donor
// @route   PUT /api/donors/:id
// @access  Private (admin or own donor)
const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    // Check authorization: donors can only update their own profile
    if (req.user.role === 'donor' && donor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    // Donors cannot change eligibility status or verification
    const allowedFields = ['donorName', 'bloodGroup', 'age', 'gender', 'mobile', 'city'];
    const adminOnlyFields = ['eligibilityStatus', 'isVerified', 'lastDonationDate', 'nextEligibleDate'];

    let updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    // Admin can also update admin-only fields
    if (req.user.role === 'admin') {
      adminOnlyFields.forEach((field) => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
      });
    }

    const updatedDonor = await Donor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Update the name in User collection too if donorName changed
    if (updateData.donorName) {
      await User.findByIdAndUpdate(donor.userId, { name: updateData.donorName });
    }

    return res.status(200).json({
      success: true,
      message: 'Donor updated successfully',
      data: updatedDonor,
    });
  } catch (error) {
    console.error('UpdateDonor error:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    return res.status(500).json({ success: false, message: 'Server error updating donor' });
  }
};

// @desc    Delete donor
// @route   DELETE /api/donors/:id
// @access  Private (admin)
const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    // Delete associated donations
    await Donation.deleteMany({ donorId: donor._id });

    // Delete associated user account
    await User.findByIdAndDelete(donor.userId);

    // Delete donor
    await Donor.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Donor and associated records deleted successfully',
    });
  } catch (error) {
    console.error('DeleteDonor error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error deleting donor' });
  }
};

// @desc    Verify donor (admin only)
// @route   PUT /api/donors/:id/verify
// @access  Private (admin)
const verifyDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    donor.isVerified = true;
    if (donor.eligibilityStatus === 'Pending') {
      donor.eligibilityStatus = 'Eligible';
    }
    await donor.save();

    return res.status(200).json({
      success: true,
      message: 'Donor verified successfully',
      data: donor,
    });
  } catch (error) {
    console.error('VerifyDonor error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error verifying donor' });
  }
};

// @desc    Get donor's own donation history
// @route   GET /api/donors/:id/donations
// @access  Private
const getDonorDonations = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    // Donors can only view their own donations
    if (req.user.role === 'donor' && donor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const donations = await Donation.find({ donorId: donor._id }).sort({ donationDate: -1 });

    return res.status(200).json({
      success: true,
      data: donations,
      count: donations.length,
    });
  } catch (error) {
    console.error('GetDonorDonations error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDonors,
  getDonor,
  getDonorByUserId,
  createDonor,
  updateDonor,
  deleteDonor,
  verifyDonor,
  getDonorDonations,
};
