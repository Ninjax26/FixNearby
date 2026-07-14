import express from 'express';
import {
  getEarningsDashboard,
  getEarningsHistory,
  requestPayout
} from '../controllers/earningController.js';
import { protectWorker } from '../middleware/authMiddleware.js';

const router = express.Router();

// All earning routes require worker authentication
router.use(protectWorker);

router.get('/dashboard/stats', getEarningsDashboard);
router.get('/history', getEarningsHistory);
router.post('/payout', requestPayout);

export default router;
