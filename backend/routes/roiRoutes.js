import express from 'express';
import { getRoiHistory } from '../controllers/historyController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getRoiHistory);

export default router;