import Booking from '../models/Booking.js';
import { queueNotification } from '../utils/queue.js';
import mongoose from 'mongoose';

// @desc    Create a new booking with concurrency control, transactions, and standalone DB fallback
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  const executeCreate = async (useSession) => {
    let session = null;
    if (useSession) {
      try {
        session = await mongoose.startSession();
        session.startTransaction();
      } catch (err) {
        session = null;
      }
    }

    const { workerId, service, scheduledTime, durationHours, address, price } = req.body;
    const start = new Date(scheduledTime);
    const end = new Date(start.getTime() + durationHours * 3600000);

    // Overlap condition query
    const query = {
      workerId,
      status: { $in: ['Accepted', 'In-Progress'] },
      $expr: {
        $and: [
          { $lt: ['$scheduledTime', end] },
          {
            $lt: [
              start,
              {
                $add: [
                  '$scheduledTime',
                  { $multiply: ['$durationHours', 3600000] }
                ]
              }
            ]
          }
        ]
      }
    };

    const overlap = session
      ? await Booking.findOne(query).session(session)
      : await Booking.findOne(query);

    if (overlap) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
      }
      return {
        status: 409,
        data: {
          success: false,
          message: 'Worker has an overlapping accepted or in-progress booking during this time slot.'
        }
      };
    }

    const bookingData = {
      userId: req.user._id,
      workerId,
      service,
      scheduledTime: start,
      durationHours,
      address,
      price,
      status: 'Pending'
    };

    const bookingArray = session
      ? await Booking.create([bookingData], { session })
      : [await Booking.create(bookingData)];

    const booking = bookingArray[0];

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    return {
      status: 201,
      data: {
        success: true,
        message: 'Booking created successfully',
        booking
      }
    };
  };

  try {
    const { workerId, service, scheduledTime, durationHours, address, price } = req.body;

    if (!workerId || !service || !scheduledTime || !durationHours || !address || !price) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: workerId, service, scheduledTime, durationHours, address, price'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid worker ID'
      });
    }

    const start = new Date(scheduledTime);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scheduledTime'
      });
    }

    let result;
    try {
      result = await executeCreate(true);
    } catch (err) {
      if (err.message.includes('Transaction numbers are only allowed') || err.code === 20) {
        console.warn('MongoDB transactions not supported (standalone mode). Retrying creation without session...');
        result = await executeCreate(false);
      } else {
        throw err;
      }
    }

    if (result.status === 201) {
      const { booking } = result.data;

      // Queue booking confirmation notification
      try {
        await queueNotification('booking_confirmation', { bookingId: booking._id });
      } catch (notifyErr) {
        console.error('Failed to queue notification:', notifyErr.message);
      }

      // Setup a timeout to automatically transition status to 'Expired' in 15 minutes
      const expiryTimeMs = req.body._testExpiryTimeMs || 15 * 60 * 1000;
      setTimeout(async () => {
        try {
          const pendingBooking = await Booking.findById(booking._id);
          if (pendingBooking && pendingBooking.status === 'Pending') {
            pendingBooking.status = 'Expired';
            await pendingBooking.save();
            console.log(`Booking ${booking._id} has expired due to worker response timeout.`);
          }
        } catch (err) {
          console.error('Error running booking expiry timeout:', err.message);
        }
      }, expiryTimeMs);
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};

// @desc    Worker accepts booking
// @route   PATCH /api/bookings/:id/accept
// @access  Private
export const acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only pending bookings can be accepted' });
    }

    booking.status = 'Accepted';
    await booking.save();

    try {
      await queueNotification('booking_status_update', {
        bookingId: booking._id,
        oldStatus: 'Pending',
        newStatus: 'Accepted'
      });
    } catch (notifyErr) {
      console.error('Failed to queue status update notification:', notifyErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Booking accepted successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete booking
// @route   PATCH /api/bookings/:id/complete
// @access  Private
export const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const oldStatus = booking.status;
    booking.status = 'Completed';
    await booking.save();

    try {
      await queueNotification('booking_status_update', {
        bookingId: booking._id,
        oldStatus,
        newStatus: 'Completed'
      });
    } catch (notifyErr) {
      console.error('Failed to queue status update notification:', notifyErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const oldStatus = booking.status;
    booking.status = 'Cancelled';
    await booking.save();

    try {
      await queueNotification('booking_status_update', {
        bookingId: booking._id,
        oldStatus,
        newStatus: 'Cancelled'
      });
    } catch (notifyErr) {
      console.error('Failed to queue status update notification:', notifyErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for user
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('workerId', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};
