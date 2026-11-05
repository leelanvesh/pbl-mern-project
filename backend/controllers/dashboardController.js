const Donor = require('../models/Donor');
const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (admin)
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalDonors,
      eligibleDonors,
      pendingDonors,
      notEligibleDonors,
      totalDonations,
      verifiedDonors,
    ] = await Promise.all([
      Donor.countDocuments(),
      Donor.countDocuments({ eligibilityStatus: 'Eligible' }),
      Donor.countDocuments({ eligibilityStatus: 'Pending' }),
      Donor.countDocuments({ eligibilityStatus: 'Not Eligible' }),
      Donation.countDocuments(),
      Donor.countDocuments({ isVerified: true }),
    ]);

    // Blood group counts
    const bloodGroupStats = await Donor.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalDonors,
        eligibleDonors,
        pendingDonors,
        notEligibleDonors,
        totalDonations,
        verifiedDonors,
        bloodGroupStats,
      },
    });
  } catch (error) {
    console.error('GetDashboardStats error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};

// @desc    Get blood group report
// @route   GET /api/reports/blood-groups
// @access  Private (admin)
const getBloodGroupReport = async (req, res) => {
  try {
    const bloodGroupStats = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          total: { $sum: 1 },
          eligible: {
            $sum: { $cond: [{ $eq: ['$eligibilityStatus', 'Eligible'] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$eligibilityStatus', 'Pending'] }, 1, 0] },
          },
          notEligible: {
            $sum: { $cond: [{ $eq: ['$eligibilityStatus', 'Not Eligible'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const donationsByHospital = await Donation.aggregate([
      { $group: { _id: '$hospitalName', totalDonations: { $sum: 1 }, totalUnits: { $sum: '$unitsDonated' } } },
      { $sort: { totalDonations: -1 } },
      { $limit: 10 },
    ]);

    const recentDonations = await Donation.find()
      .populate('donorId', 'donorName bloodGroup city')
      .sort({ donationDate: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: {
        bloodGroupStats,
        donationsByHospital,
        recentDonations,
      },
    });
  } catch (error) {
    console.error('GetBloodGroupReport error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error fetching report' });
  }
};

module.exports = { getDashboardStats, getBloodGroupReport };
