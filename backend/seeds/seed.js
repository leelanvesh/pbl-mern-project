const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Donation = require('../models/Donation');

const seed = async () => {
  try {
    await connectDB();

    console.log('🌱 Clearing existing data...');
    await Donation.deleteMany({});
    await Donor.deleteMany({});
    await User.deleteMany({});

    console.log('👤 Creating demo users...');

    // Admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@portal.com',
      password: 'Admin@123',
      role: 'admin',
    });

    // Hospital user
    const hospitalUser = await User.create({
      name: 'City Hospital',
      email: 'hospital@portal.com',
      password: 'Hospital@123',
      role: 'hospital',
    });

    // Donor users
    const donorData = [
      { name: 'Rahul Sharma', email: 'donor@portal.com', password: 'Donor@123', bloodGroup: 'O+', age: 28, gender: 'Male', mobile: '9876543210', city: 'Hyderabad', eligibilityStatus: 'Eligible' },
      { name: 'Priya Reddy', email: 'priya@portal.com', password: 'Donor@123', bloodGroup: 'A+', age: 25, gender: 'Female', mobile: '9876543211', city: 'Hyderabad', eligibilityStatus: 'Eligible' },
      { name: 'Suresh Kumar', email: 'suresh@portal.com', password: 'Donor@123', bloodGroup: 'B+', age: 32, gender: 'Male', mobile: '9876543212', city: 'Bangalore', eligibilityStatus: 'Eligible' },
      { name: 'Anjali Singh', email: 'anjali@portal.com', password: 'Donor@123', bloodGroup: 'AB+', age: 27, gender: 'Female', mobile: '9876543213', city: 'Mumbai', eligibilityStatus: 'Pending' },
      { name: 'Vikram Patel', email: 'vikram@portal.com', password: 'Donor@123', bloodGroup: 'O-', age: 35, gender: 'Male', mobile: '9876543214', city: 'Hyderabad', eligibilityStatus: 'Not Eligible' },
      { name: 'Meena Iyer', email: 'meena@portal.com', password: 'Donor@123', bloodGroup: 'A-', age: 29, gender: 'Female', mobile: '9876543215', city: 'Chennai', eligibilityStatus: 'Eligible' },
      { name: 'Arjun Nair', email: 'arjun@portal.com', password: 'Donor@123', bloodGroup: 'B-', age: 31, gender: 'Male', mobile: '9876543216', city: 'Bangalore', eligibilityStatus: 'Eligible' },
      { name: 'Kavita Joshi', email: 'kavita@portal.com', password: 'Donor@123', bloodGroup: 'AB-', age: 26, gender: 'Female', mobile: '9876543217', city: 'Pune', eligibilityStatus: 'Pending' },
    ];

    const createdDonors = [];

    for (const d of donorData) {
      const user = await User.create({
        name: d.name,
        email: d.email,
        password: d.password,
        role: 'donor',
      });

      const donor = await Donor.create({
        userId: user._id,
        donorName: d.name,
        bloodGroup: d.bloodGroup,
        age: d.age,
        gender: d.gender,
        mobile: d.mobile,
        city: d.city,
        eligibilityStatus: d.eligibilityStatus,
        isVerified: d.eligibilityStatus === 'Eligible',
      });

      createdDonors.push(donor);
    }

    console.log('💉 Creating demo donations...');

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    await Donation.create([
      {
        donorId: createdDonors[0]._id,
        donationDate: threeMonthsAgo,
        hospitalName: 'City General Hospital',
        unitsDonated: 1,
        nextEligibleDate: new Date(),
      },
      {
        donorId: createdDonors[1]._id,
        donationDate: new Date('2026-06-15'),
        hospitalName: 'Apollo Hospital',
        unitsDonated: 1,
        nextEligibleDate: new Date('2026-09-15'),
      },
      {
        donorId: createdDonors[2]._id,
        donationDate: new Date('2026-05-20'),
        hospitalName: 'Fortis Hospital',
        unitsDonated: 2,
        nextEligibleDate: new Date('2026-08-20'),
      },
      {
        donorId: createdDonors[4]._id,
        donationDate: oneMonthAgo,
        hospitalName: 'KIMS Hospital',
        unitsDonated: 1,
        nextEligibleDate: new Date(oneMonthAgo.getTime() + 90 * 24 * 60 * 60 * 1000),
      },
    ]);

    // Update donor 4 (Vikram) - not eligible
    createdDonors[4].lastDonationDate = oneMonthAgo;
    createdDonors[4].nextEligibleDate = new Date(oneMonthAgo.getTime() + 90 * 24 * 60 * 60 * 1000);
    await createdDonors[4].save();

    console.log('\n✅ Seed data inserted successfully!\n');
    console.log('===========================================');
    console.log('          DEMO CREDENTIALS                ');
    console.log('===========================================');
    console.log('Admin:    admin@portal.com    / Admin@123');
    console.log('Donor:    donor@portal.com    / Donor@123');
    console.log('Hospital: hospital@portal.com / Hospital@123');
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
