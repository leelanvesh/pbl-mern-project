require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Donation = require('../models/Donation');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blood_donor_portal';

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB for seeding');

    await User.deleteMany({});
    await Donor.deleteMany({});
    await Donation.deleteMany({});
    console.log('Cleared existing data');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bloodconnect.com',
      password: 'Admin@123',
      role: 'admin'
    });

    const hospital = await User.create({
      name: 'City Hospital',
      email: 'cityhospital@example.com',
      password: 'Hospital@123',
      role: 'hospital'
    });

    const donorUsers = await User.create([
      { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'donor' },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'donor' },
      { name: 'Bob Wilson', email: 'bob@example.com', password: 'password123', role: 'donor' },
      { name: 'Alice Brown', email: 'alice@example.com', password: 'password123', role: 'donor' },
      { name: 'Charlie Davis', email: 'charlie@example.com', password: 'password123', role: 'donor' }
    ]);

    const donorsData = [
      { userId: donorUsers[0]._id, donorName: 'John Doe', bloodGroup: 'O+', age: 25, gender: 'Male', mobile: '9876543210', city: 'New York', eligibilityStatus: 'Eligible' },
      { userId: donorUsers[1]._id, donorName: 'Jane Smith', bloodGroup: 'A-', age: 30, gender: 'Female', mobile: '9876543211', city: 'Los Angeles', eligibilityStatus: 'Eligible' },
      { userId: donorUsers[2]._id, donorName: 'Bob Wilson', bloodGroup: 'B+', age: 35, gender: 'Male', mobile: '9876543212', city: 'Chicago', eligibilityStatus: 'Pending Verification' },
      { userId: donorUsers[3]._id, donorName: 'Alice Brown', bloodGroup: 'AB+', age: 28, gender: 'Female', mobile: '9876543213', city: 'Houston', eligibilityStatus: 'Eligible' },
      { userId: donorUsers[4]._id, donorName: 'Charlie Davis', bloodGroup: 'O-', age: 40, gender: 'Male', mobile: '9876543214', city: 'Phoenix', eligibilityStatus: 'Not Eligible' }
    ];

    const donors = await Donor.create(donorsData);

    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 100);

    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 10);

    const nextDate = new Date(recentDate);
    nextDate.setDate(nextDate.getDate() + 56);

    const donationsData = [
      { donorId: donors[0]._id, donorUserId: donorUsers[0]._id, donationDate: oldDate, hospitalName: 'General Hospital', unitsDonated: 1, nextEligibleDate: new Date(oldDate.getTime() + 56*24*60*60*1000), recordedBy: admin._id },
      { donorId: donors[1]._id, donorUserId: donorUsers[1]._id, donationDate: oldDate, hospitalName: 'City Clinic', unitsDonated: 1, nextEligibleDate: new Date(oldDate.getTime() + 56*24*60*60*1000), recordedBy: admin._id },
      { donorId: donors[4]._id, donorUserId: donorUsers[4]._id, donationDate: recentDate, hospitalName: 'Regional Med Center', unitsDonated: 2, nextEligibleDate: nextDate, recordedBy: admin._id }
    ];

    await Donation.create(donationsData);

    await Donor.findByIdAndUpdate(donors[0]._id, { lastDonationDate: oldDate, nextEligibleDate: donationsData[0].nextEligibleDate, totalDonations: 1 });
    await Donor.findByIdAndUpdate(donors[1]._id, { lastDonationDate: oldDate, nextEligibleDate: donationsData[1].nextEligibleDate, totalDonations: 1 });
    await Donor.findByIdAndUpdate(donors[4]._id, { lastDonationDate: recentDate, nextEligibleDate: nextDate, totalDonations: 1 });

    console.log('Data seeded successfully!');
    console.table([
      { Role: 'Admin', Email: 'admin@bloodconnect.com', Password: 'Admin@123' },
      { Role: 'Hospital', Email: 'cityhospital@example.com', Password: 'Hospital@123' },
      { Role: 'Donor', Email: 'john@example.com', Password: 'password123' }
    ]);

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
