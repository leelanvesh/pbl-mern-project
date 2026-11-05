const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: [true, 'Donor ID is required'],
    },
    donationDate: {
      type: Date,
      required: [true, 'Donation date is required'],
      default: Date.now,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    unitsDonated: {
      type: Number,
      required: [true, 'Units donated is required'],
      min: [1, 'Units must be at least 1'],
      max: [4, 'Units cannot exceed 4 per donation'],
      default: 1,
    },
    nextEligibleDate: {
      type: Date,
      required: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

donationSchema.index({ donorId: 1 });
donationSchema.index({ donationDate: -1 });

module.exports = mongoose.model('Donation', donationSchema);
