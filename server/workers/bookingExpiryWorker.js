import Booking from '../models/Booking.js';

export const startBookingExpiryScheduler = () => {
  console.log('[Scheduler]: Booking Expiry check initialized (running every 60s)');
  
  setInterval(async () => {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      
      const result = await Booking.updateMany(
        {
          status: 'Pending',
          createdAt: { $lt: fifteenMinutesAgo }
        },
        {
          $set: { status: 'Expired' }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`[Scheduler]: Transitioned ${result.modifiedCount} stale pending bookings to Expired`);
      }
    } catch (error) {
      console.error('[Scheduler Error]: Failed to expire stale bookings:', error.message);
    }
  }, 60000); // 60 seconds
};
