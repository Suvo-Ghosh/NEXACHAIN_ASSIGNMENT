import express from 'express';
import { createInvestment, getUserInvestments } from '../controllers/investmentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { globalLimiter } from '../middlewares/rateLimiter.js';
import { investmentValidation, validateResult } from '../middlewares/validator.js';

const router = express.Router();

// Apply JWT protection and general rate limiting to all investment routes
router.use(protect);
router.use(globalLimiter);

// Routes
router.route('/')
    .post(investmentValidation, validateResult, createInvestment) // Validates body before creating
    .get(getUserInvestments);

export default router;