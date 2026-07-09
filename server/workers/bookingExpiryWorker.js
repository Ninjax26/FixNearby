import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import Booking from '../models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const startBookingExpiryScheduler = () => {
  console.log('[BullMQ Expiry Worker]: Initializing booking expiry check worker...');

  let connection = null;
  try {
    connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    });
    connection.on('error', (err) => {
      console.warn(`[Expiry Worker Redis Warning] Redis unreachable: ${err.message}`);
    });
  } catch (err) {
    console.warn(`[Expiry Worker Redis Warning] Failed: ${err.message}`);
  }

  const performExpiryCheck = async () => {
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
      console.log(`[BullMQ Expiry Worker]: Transitioned ${result.modifiedCount} stale pending bookings to Expired`);
    }
  };

  // If Redis is online, use BullMQ Worker. Otherwise fallback to setInterval.
  if (connection) {
    const expiryWorker = new Worker(
      'booking-expiry-queue',
      async (job) => {
        if (job.name === 'check_expiry') {
          console.log('[BullMQ Expiry Worker]: Executing scheduled expiry scan...');
          await performExpiryCheck();
        }
      },
      { connection }
    );

    expiryWorker.on('completed', (job) => {
      console.log(`[BullMQ Expiry Worker]: Job completed successfully: ${job.id}`);
    });

    expiryWorker.on('failed', (job, err) => {
      console.error(`[BullMQ Expiry Worker]: Job failed for ID ${job?.id}:`, err.message);
    });

    console.log('[BullMQ Expiry Worker]: Registered BullMQ consumer.');
  } else {
    console.log('[BullMQ Expiry Worker]: Fallback to standard setInterval loop.');
    setInterval(async () => {
      try {
        await performExpiryCheck();
      } catch (err) {
        console.error('[Expiry Scheduler Fallback Error]: Failed to expire stale bookings:', err.message);
      }
    }, 60000);
  }
};
