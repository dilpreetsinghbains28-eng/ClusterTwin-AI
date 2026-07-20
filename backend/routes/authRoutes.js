const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Brute-force protection for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// Validation rules
const registerValidation = [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('organizationName', 'Organization name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginLimiter, loginValidation, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
