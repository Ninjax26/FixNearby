import Booking from '../models/Booking.js';
import { queueNotification } from '../utils/queue.js';
import mongoose from 'mongoose';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { worker, service, price } = req.body;

    if (!worker || !service || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide worker ID, service, and price'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(worker)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid worker ID'
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      worker,
      service,
      price,
      status: 'Pending'
    });

    // Queue booking confirmation notification
    await queueNotification('booking_confirmation', { bookingId: booking._id });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();

    // Queue booking status update notification
    await queueNotification('booking_status_update', {
      bookingId: booking._id,
      oldStatus,
      newStatus: status
    });

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// @desc    Get all user bookings
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('worker', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};
