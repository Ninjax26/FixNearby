import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

// Helper: generate time slots between two times in 1-hour increments
const generateSlots = (startTime, endTime) => {
  const slots = [];
  const [startH] = startTime.split(':').map(Number);
  const [endH] = endTime.split(':').map(Number);
  for (let h = startH; h < endH; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
  }
  return slots;
};

// @desc    Get worker's schedule for a date range (bookings + availability)
// @route   GET /api/schedule/
// @access  Private (Worker)
export const getWorkerSchedule = async (req, res) => {
  try {
    const workerId = req.worker._id;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide startDate and endDate query parameters'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use ISO date strings.'
      });
    }

    // Fetch bookings in the range
    const bookings = await Booking.find({
      workerId,
      scheduledTime: { $gte: start, $lte: end },
      status: { $in: ['Accepted', 'In-Progress', 'Pending'] }
    }).select('scheduledTime durationHours service status');

    // Fetch blocked slots in range
    const worker = await Worker.findById(workerId).select('recurringAvailability blockedSlots');
    const blockedSlots = (worker.blockedSlots || []).filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate >= start && slotDate <= end;
    });

    // Format bookings into day-keyed structure
    const schedule = {};
    const dayMs = 24 * 60 * 60 * 1000;
    let current = new Date(start);
    while (current <= end) {
      const dateKey = current.toISOString().split('T')[0];
      schedule[dateKey] = {
        date: dateKey,
        bookings: [],
        blocked: [],
        available: true
      };
      current = new Date(current.getTime() + dayMs);
    }

    // Populate bookings
    for (const b of bookings) {
      const dateKey = new Date(b.scheduledTime).toISOString().split('T')[0];
      if (schedule[dateKey]) {
        schedule[dateKey].bookings.push({
          _id: b._id,
          time: b.scheduledTime,
          duration: b.durationHours,
          service: b.service,
          status: b.status
        });
        schedule[dateKey].available = false;
      }
    }

    // Populate blocked slots
    for (const bs of blockedSlots) {
      const dateKey = new Date(bs.date).toISOString().split('T')[0];
      if (schedule[dateKey]) {
        schedule[dateKey].blocked.push({
          startTime: bs.startTime,
          endTime: bs.endTime,
          reason: bs.reason
        });
      }
    }

    res.status(200).json({
      success: true,
      schedule,
      recurringAvailability: worker.recurringAvailability || []
    });
  } catch (error) {
    console.error('Error fetching worker schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching schedule'
    });
  }
};

// @desc    Set recurring weekly availability
// @route   POST /api/schedule/recurring
// @access  Private (Worker)
export const setRecurringAvailability = async (req, res) => {
  try {
    const workerId = req.worker._id;
    const { slots } = req.body;

    if (!Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: 'Slots must be an array of { dayOfWeek, startTime, endTime }'
      });
    }

    // Validate each slot
    for (const slot of slots) {
      if (slot.dayOfWeek === undefined || slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
        return res.status(400).json({
          success: false,
          message: `Invalid dayOfWeek value: ${slot.dayOfWeek}. Must be 0-6.`
        });
      }
      if (!slot.startTime || !slot.endTime) {
        return res.status(400).json({
          success: false,
          message: 'Each slot must have startTime and endTime (e.g. "09:00", "17:00")'
        });
      }
    }

    await Worker.findByIdAndUpdate(workerId, {
      $set: { recurringAvailability: slots }
    });

    res.status(200).json({
      success: true,
      message: 'Recurring availability updated',
      recurringAvailability: slots
    });
  } catch (error) {
    console.error('Error setting recurring availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recurring availability'
    });
  }
};

// @desc    Block a specific time slot
// @route   POST /api/schedule/block
// @access  Private (Worker)
export const blockTimeSlot = async (req, res) => {
  try {
    const workerId = req.worker._id;
    const { date, startTime, endTime, reason } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date, startTime, and endTime'
      });
    }

    // Check for overlapping bookings
    const slotDate = new Date(date);
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const slotStart = new Date(slotDate);
    slotStart.setHours(startH, startM, 0, 0);
    const slotEnd = new Date(slotDate);
    slotEnd.setHours(endH, endM, 0, 0);

    const overlappingBooking = await Booking.findOne({
      workerId,
      scheduledTime: { $lt: slotEnd },
      $expr: {
        $lt: ['$scheduledTime', slotEnd]
      },
      status: { $in: ['Accepted', 'Pending', 'In-Progress'] }
    });

    const blockData = {
      date: slotDate,
      startTime,
      endTime,
      reason: reason || ''
    };

    await Worker.findByIdAndUpdate(workerId, {
      $push: { blockedSlots: blockData }
    });

    res.status(201).json({
      success: true,
      message: 'Time slot blocked successfully',
      blockedSlot: blockData
    });
  } catch (error) {
    console.error('Error blocking time slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to block time slot'
    });
  }
};

// @desc    Get blocked slots for a date range
// @route   GET /api/schedule/blocked
// @access  Private (Worker)
export const getBlockedSlots = async (req, res) => {
  try {
    const workerId = req.worker._id;
    const { startDate, endDate } = req.query;

    const worker = await Worker.findById(workerId).select('blockedSlots');
    let blocked = worker.blockedSlots || [];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      blocked = blocked.filter(slot => {
        const d = new Date(slot.date);
        return d >= start && d <= end;
      });
    }

    // Sort by date descending
    blocked.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      blockedSlots: blocked
    });
  } catch (error) {
    console.error('Error fetching blocked slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blocked slots'
    });
  }
};

// @desc    Remove a blocked slot
// @route   DELETE /api/schedule/block/:id
// @access  Private (Worker)
export const removeBlockedSlot = async (req, res) => {
  try {
    const workerId = req.worker._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid slot ID' });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const slotIndex = worker.blockedSlots.findIndex(
      slot => slot._id.toString() === id
    );

    if (slotIndex === -1) {
      return res.status(404).json({ success: false, message: 'Blocked slot not found' });
    }

    worker.blockedSlots.splice(slotIndex, 1);
    await worker.save();

    res.status(200).json({
      success: true,
      message: 'Blocked slot removed'
    });
  } catch (error) {
    console.error('Error removing blocked slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove blocked slot'
    });
  }
};
