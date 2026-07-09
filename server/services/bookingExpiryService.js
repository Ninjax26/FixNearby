import Booking from '../models/Booking.js';

export const expirePendingBookings = async () => {
  const expirationThreshold = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const result = await Booking.updateMany(
    {
      status: 'Pending',
      createdAt: { $lte: expirationThreshold }
    },
    {
      status: 'Cancelled',
      cancellationReason: 'Automated timeout: No worker response within 48h'
    }
  );

  return result.modifiedCount;
};
