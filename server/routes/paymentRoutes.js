import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
  requestRefund
} from '../controllers/paymentController.js';

const router = express.Router();

// All payment routes require authentication
router.use(protect);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/history', getPaymentHistory);
router.get('/:id', getPaymentById);
router.post('/:id/refund', requestRefund);

export default router;
