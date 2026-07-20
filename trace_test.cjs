const express = require('express');
const authController = require('./backend/controllers/authController');
const { check, validationResult } = require('express-validator');
const User = require('./backend/models/User');

const app = express();
app.use(express.json());

// Mock User Model functions for this test
User.findOne = async () => null; // user doesn't exist
User.create = async (data) => ({
  _id: '123',
  ...data
});

const registerValidation = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

// Add temporary logging wrapper around authController.registerUser
const registerUserWrapped = async (req, res, next) => {
  console.log('1. Controller reached. Body:', req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('2. Validation failed:', errors.array());
      return res.status(400).json({ error: errors.array() });
    }
    console.log('2. Validation passed.');
    
    const { firstName, lastName, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    console.log('3. Checked userExists:', userExists);
    
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: 'Operator'
    });
    console.log('4. User created:', user);
    
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Error caught in controller:', error);
    res.status(500).json({ error: error.message });
  }
};

app.post('/register', registerValidation, registerUserWrapped);

const reqBody = {
  firstName: 'Dilpreet',
  lastName: 'Singh',
  email: 'test@example.com',
  password: 'password123'
};

const axios = require('axios');
const server = app.listen(5001, async () => {
  console.log('Mock server started on 5001');
  try {
    const res = await axios.post('http://localhost:5001/register', reqBody);
    console.log('API Response:', res.status, res.data);
  } catch (err) {
    console.log('API Error:', err.response?.data || err.message);
  }
  server.close();
});
