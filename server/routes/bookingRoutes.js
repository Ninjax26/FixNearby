// Registered automated booking expiry policies
import express from 'express';
import {
  createBooking,
  acceptBooking,
  completeBooking,
  cancelBooking,
  getBookings,
  getBookingById,
  rescheduleBooking,
  updateBookingStatusController
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkBookingOverlap } from '../middleware/bookingValidation.js';
import {
  loadBooking,
  requireBookingParticipant,
  authorizeStatusTransition
} from '../middleware/bookingMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { createBookingReview } from '../controllers/reviewController.js';

const router = express.Router();

// All booking routes require authentication.
router.use(protect);

router.route('/')
  .post(checkBookingOverlap, createBooking)
  .get(getBookings);

router.route('/:id')
  .get(loadBooking, requireBookingParticipant, getBookingById);

router.route('/:id/accept')
  .patch(loadBooking, authorizeStatusTransition, acceptBooking);

router.route('/:id/complete')
  .patch(loadBooking, authorizeStatusTransition, completeBooking);

router.route('/:id/cancel')
  .patch(loadBooking, authorizeStatusTransition, cancelBooking)
  .post(loadBooking, authorizeStatusTransition, cancelBooking);

router.route('/:id/reschedule')
  .patch(loadBooking, rescheduleBooking);

router.route('/:id/status')
  .patch(loadBooking, authorizeStatusTransition, updateBookingStatusController);

router.route('/:id/review')
  .post(upload.array('images', 5), createBookingReview);

export default router;

// Booking reminders hook initialization
// Reminder check loaded on routes module initializations
