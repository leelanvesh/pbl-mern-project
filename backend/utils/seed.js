const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Donation = require('../models/Donation');

dotenv.config();

const seedData = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Drop existing data
    await User.deleteMany();
    await Donor.deleteMany();
    await Donation.deleteMany();
    console.log('Data destroyed');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@bloodportal.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create hospital user
    const hospitalUser = await User.create({
      name: 'City Hospital',
      email: 'hospital@bloodportal.com',
      password: 'hospital123',
      role: 'hospital'
    });

    // Create 2 donor users
    const donorUser1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@bloodportal.com',
      password: 'donor123',
      role: 'donor'
    });

    const donorUser2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@bloodportal.com',
      password: 'donor123',
      role: 'donor'
    });

    // Create donor profiles
    const donor1 = await Donor.create({
      userId: donorUser1._id,
      donorName: 'Rahul Sharma',
      bloodGroup: 'O+',
      age: 28,
      gender: 'Male',
      mobile: '9876543210',
      city: 'Hyderabad',
      eligibilityStatus: 'Eligible'
    });

    const donor2 = await Donor.create({
      userId: donorUser2._id,
      donorName: 'Priya Patel',
      bloodGroup: 'A+',
      age: 25,
      gender: 'Female',
      mobile: '9876543211',
      city: 'Mumbai',
      eligibilityStatus: 'Eligible'
    });

    // Create sample donation
    await Donation.create({
      donorId: donor1._id,
      donationDate: new Date(),
      hospitalName: 'Apollo Hospitals',
      unitsDonated: 1,
      nextEligibleDate: new Date(new Date().setDate(new Date().getDate() + 90))
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
