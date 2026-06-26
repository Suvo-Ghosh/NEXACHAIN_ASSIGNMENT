import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { registerValidation, loginValidation, validateResult } from '../middlewares/validator.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply strict rate limiting to all auth routes
router.use(authLimiter);

// Authentication Routes with Validation
router.post('/register', registerValidation, validateResult, registerUser);
router.post('/login', loginValidation, validateResult, loginUser);

// Protected route to verify token and get user data
router.get('/me', protect, getMe);

export default router;