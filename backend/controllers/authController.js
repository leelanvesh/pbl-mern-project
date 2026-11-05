const User = require('../models/User');
const Donor = require('../models/Donor');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, bloodGroup, age, gender, mobile, city } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role',
      });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Validate role
    if (!['admin', 'donor', 'hospital'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, donor, or hospital',
      });
    }

    // For donor registration, validate donor-specific fields
    if (role === 'donor') {
      if (!bloodGroup || !age || !gender || !mobile || !city) {
        return res.status(400).json({
          success: false,
          message: 'Donors must provide blood group, age, gender, mobile, and city',
        });
      }

      const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      if (!validBloodGroups.includes(bloodGroup)) {
        return res.status(400).json({ success: false, message: 'Invalid blood group' });
      }

      if (age < 18 || age > 65) {
        return res.status(400).json({
          success: false,
          message: 'Donor age must be between 18 and 65',
        });
      }
    }

    // Create user
    const user = await User.create({ name, email, password, role });

    // If donor, also create donor profile
    let donorProfile = null;
    if (role === 'donor') {
      donorProfile = await Donor.create({
        userId: user._id,
        donorName: name,
        bloodGroup,
        age: parseInt(age),
        gender,
        mobile,
        city,
        eligibilityStatus: 'Pending',
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        donor: donorProfile,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Find donor profile if role is donor
    let donorProfile = null;
    if (user.role === 'donor') {
      donorProfile = await Donor.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        donor: donorProfile,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    let donorProfile = null;
    if (user.role === 'donor') {
      donorProfile = await Donor.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        donor: donorProfile,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login, getMe };
