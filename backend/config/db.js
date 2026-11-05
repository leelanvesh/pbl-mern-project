const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGO_URI or MONGODB_URI is not defined in your environment variables.');
    }

    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || 'blood_donor_portal',
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please verify your connection string and network access in MongoDB Atlas.');
    process.exit(1);
  }
};

module.exports = connectDB;
