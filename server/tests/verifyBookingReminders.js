import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Booking from '../models/Booking.js';
import { checkUpcomingBookings } from '../workers/bookingReminderWorker.js';
import dotenv from 'dotenv';

dotenv.config();

async function runTests() {
  console.log("--- STARTING BOOKING REMINDERS WORKER TESTS ---");
  await connectDB();

  const b = await Booking.create({
    userId: new mongoose.Types.ObjectId(),
    workerId: new mongoose.Types.ObjectId(),
    service: 'Carpentry',
    scheduledTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    durationHours: 1,
    address: '123 Wood Road',
    price: 90,
    status: 'Accepted',
    reminderSent: false
  });

  try {
    const processed = await checkUpcomingBookings();
    console.log(`SUCCESS: Processed ${processed} booking reminders.`);
    const updated = await Booking.findById(b._id);
    if (!updated.reminderSent) {
      throw new Error("Reminder flag was not updated on booking");
    }
    console.log("SUCCESS: Booking reminderSent set to true.");
  } finally {
    await Booking.deleteOne({ _id: b._id });
    await mongoose.connection.close();
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error("REMINDER TESTS FAILED:", err);
  process.exit(1);
});
