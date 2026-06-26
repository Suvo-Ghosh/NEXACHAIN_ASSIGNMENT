import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { globalLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Apply middleware
router.use(protect);
router.use(globalLimiter);

// Dashboard Routes
router.get('/', getDashboardData);

export default router;