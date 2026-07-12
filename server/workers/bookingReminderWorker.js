import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import { sendNotification } from '../services/notificationService.js';

dotenv.config();

export const checkUpcomingBookings = async () => {
  const now = new Date();
  const targetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  const bookings = await Booking.find({
    scheduledTime: { $gte: now, $lte: targetTime },
    status: 'Accepted',
    reminderSent: { $ne: true }
  });

  for (const booking of bookings) {
    await sendNotification(booking.userId, {
      title: "Upcoming Service Reminder",
      message: `Your service booking for ${booking.service} is scheduled in less than 24 hours.`
    });
    booking.reminderSent = true;
    await booking.save();
  }
  return bookings.length;
};
