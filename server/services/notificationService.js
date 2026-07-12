export const sendNotification = async (userId, payload) => {
  console.log(`[Notification Service] Sent notification to user ${userId}:`, payload);
  return { success: true, userId, payload };
};

export const sendBookingReminder = async (userId, booking) => {
  return sendNotification(userId, {
    title: 'Service Reminder',
    message: `Your booking for ${booking.service} is coming up.`
  });
};
