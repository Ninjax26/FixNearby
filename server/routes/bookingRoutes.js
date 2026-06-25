import express from 'express';
import {
  createBooking,
  acceptBooking,
  completeBooking,
  cancelBooking,
  getBookings
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkBookingOverlap } from '../middleware/bookingValidation.js';

const router = express.Router();

router.route('/')
  .post(protect, checkBookingOverlap, createBooking)
  .get(protect, getBookings);

router.route('/:id/accept')
  .patch(protect, acceptBooking);

router.route('/:id/complete')
  .patch(protect, completeBooking);

router.route('/:id/cancel')
  .patch(protect, cancelBooking);

export default router;
