/**
 * Simple in-memory lock manager to prevent race conditions during concurrent bookings.
 */
const activeLocks = new Set();

export const acquireLock = async (workerId, timeSlot) => {
  const lockKey = `${workerId}-${timeSlot}`;
  if (activeLocks.has(lockKey)) {
    return false;
  }
  activeLocks.add(lockKey);
  return true;
};

export const releaseLock = (workerId, timeSlot) => {
  const lockKey = `${workerId}-${timeSlot}`;
  activeLocks.delete(lockKey);
};
