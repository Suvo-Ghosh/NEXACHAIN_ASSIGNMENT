import express from 'express';
import { getDirectReferrals, getReferralTree } from '../controllers/referralController.js';
import { getReferralHistory } from '../controllers/historyController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { globalLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Apply middleware
router.use(protect);
router.use(globalLimiter);

// Referral Routes
router.get('/direct', getDirectReferrals);
router.get('/tree', getReferralTree);
router.get('/history', getReferralHistory);

export default router;