import Booking from '../models/Booking.js';

export const checkBookingOverlap = async (req, res, next) => {
  try {
    const { workerId, scheduledTime, durationHours } = req.body;

    if (!workerId || !scheduledTime || !durationHours) {
      return res.status(400).json({
        success: false,
        message: 'Please provide workerId, scheduledTime, and durationHours'
      });
    }

    const start = new Date(scheduledTime);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scheduledTime'
      });
    }

    const end = new Date(start.getTime() + durationHours * 3600000);

    // Overlap condition: start1 < end2 && start2 < end1
    // We check existing bookings where status is 'Accepted' or 'In-Progress' for the worker
    const overlap = await Booking.findOne({
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
    });

    if (overlap) {
      return res.status(409).json({
        success: false,
        message: 'Worker has an overlapping accepted or in-progress booking during this time slot.'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
