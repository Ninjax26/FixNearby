import express from 'express';
import { previewEstimate, confirmEstimate } from '../controllers/estimateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Both routes require authenticated user
router.use(protect);

router.post('/preview', previewEstimate);
router.post('/confirm', confirmEstimate);

export default router;
