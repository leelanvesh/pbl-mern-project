const Donor = require('../models/Donor');
const Donation = require('../models/Donation');

exports.getDashboard = async (req, res, next) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const eligibleDonors = await Donor.countDocuments({ eligibilityStatus: 'Eligible' });
    const pendingVerification = await Donor.countDocuments({ eligibilityStatus: 'Pending Verification' });
    const totalDonations = await Donation.countDocuments();

    const bloodGroupCounts = await Donor.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ]);

    const recentDonors = await Donor.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');

    res.status(200).json({
      success: true,
      data: {
        totalDonors,
        eligibleDonors,
        pendingVerification,
        totalDonations,
        bloodGroupCounts,
        recentDonors
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getBloodAvailability = async (req, res, next) => {
  try {
    const counts = await Donor.aggregate([
      { $match: { eligibilityStatus: 'Eligible' } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ]);

    const availability = {};
    counts.forEach(item => {
      availability[item._id] = item.count;
    });

    res.status(200).json({ success: true, data: availability });
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const bloodGroupDistribution = await Donor.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ]);

    const eligibilityBreakdown = await Donor.aggregate([
      { $group: { _id: '$eligibilityStatus', count: { $sum: 1 } } }
    ]);

    const donationsByMonth = await Donation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$donationDate' },
            month: { $month: '$donationDate' }
          },
          count: { $sum: 1 },
          totalUnits: { $sum: '$unitsDonated' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    const cityWiseDistribution = await Donor.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        bloodGroupDistribution,
        eligibilityBreakdown,
        donationsByMonth,
        cityWiseDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};
