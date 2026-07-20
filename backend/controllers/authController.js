const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  console.log('7. [Backend] registerUser route hit. Body:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('8. [Backend] Validation failed:', errors.array());
    res.status(400);
    return next(new Error(errors.array().map(err => err.msg).join(', ')));
  }

  const { firstName, lastName, email, organizationName, password } = req.body;

  try {
    console.log('9. [Backend] Checking if user exists with email:', email);
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('10. [Backend] User already exists.');
      res.status(400);
      return next(new Error('User already exists'));
    }
    
    console.log('11. [Backend] Creating new user...');

    // Create user (Force role to 'Operator' for public registration)
    const user = await User.create({
      firstName,
      lastName,
      email,
      organizationName,
      password,
      role: 'Operator'
    });
    console.log('12. [Backend] User successfully created in MongoDB:', user._id);

    if (user) {
      console.log('13. [Backend] Sending 201 Created response');
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      console.log('13. [Backend] User is null, sending 400');
      res.status(400);
      return next(new Error('Invalid user data'));
    }
  } catch (error) {
    console.error('14. [Backend] Catch block hit. Error:', error);
    res.status(500);
    return next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array().map(err => err.msg).join(', ')));
  }

  const { email, password } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        res.status(401);
        return next(new Error('User account is disabled'));
      }

      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    res.status(500);
    return next(error);
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    return next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
