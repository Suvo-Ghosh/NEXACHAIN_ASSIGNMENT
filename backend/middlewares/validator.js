import { check, validationResult } from 'express-validator';

// Middleware to check for validation errors and return them
export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return a 400 Bad Request with the array of validation errors
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Validation rules for User Registration
export const registerValidation = [
  check('fullName', 'Full name is required').trim().not().isEmpty(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('mobileNumber', 'Mobile number is required').trim().not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('referredByCode', 'Referral code must be a string').optional().isString()
];

// Validation rules for User Login
export const loginValidation = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists()
];

// Validation rules for Creating an Investment
export const investmentValidation = [
  check('investmentAmount', 'Investment amount must be a positive number').isFloat({ gt: 0 }),
  check('planDetails', 'Plan details are required').trim().not().isEmpty(),
  check('durationInDays', 'Duration must be a valid whole number greater than 0').isInt({ gt: 0 }),
  check('dailyRoiPercentage', 'Daily ROI percentage must be a valid number greater than 0').isFloat({ gt: 0 })
];