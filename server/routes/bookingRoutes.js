import express from 'express';
import { createBooking, updateBookingStatus, getBookings } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, getBookings);

router.route('/:id/status')
  .patch(protect, updateBookingStatus);

export default router;
