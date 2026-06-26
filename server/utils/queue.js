import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let connection = null;
try {
  connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });
  connection.on('error', (err) => {
    // Gracefully catch Redis connection issues to avoid crashing the server if Redis is offline
    console.warn(`[Redis Connection Warning] Redis is offline or unreachable: ${err.message}`);
  });
} catch (err) {
  console.warn(`[Redis Initialization Warning] Failed to initialize IORedis connection: ${err.message}`);
}

export const notificationQueue = connection ? new Queue('notification-queue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000 // 1s, 2s, 4s...
    },
    removeOnComplete: true,
    removeOnFail: false
  }
}) : null;

export const queueNotification = async (jobName, data) => {
  if (!notificationQueue || !connection || connection.status !== 'ready') {
    console.log(`[Queue Fallback Logging] Redis offline. Simulating queueing of Job: "${jobName}" with data:`, data);
    return null;
  }
  try {
    const job = await notificationQueue.add(jobName, data);
    console.log(`[Queue] Job queued successfully: "${jobName}", Job ID: ${job.id}`);
    return job;
  } catch (error) {
    console.error(`[Queue Error] Failed to queue job "${jobName}":`, error.message || error);
    console.log(`[Queue Fallback Logging] Simulating queueing of Job: "${jobName}" due to error:`, data);
    return null;
  }
};
