import User from '../models/User.js';
import Worker from '../models/Worker.js';

export const handlePresenceUpdate = (io, socket, userId, userType) => async (data, callback) => {
  try {
    const allowed = ['available', 'busy', 'offline'];
    const { status } = data;
    if (!allowed.includes(status)) {
      if (callback) callback({ success: false, error: 'Invalid status' });
      return;
    }
    // Update DB based on user type
    if (userType === 'Worker') {
      await Worker.findByIdAndUpdate(userId, { availabilityStatus: status, lastActive: new Date() });
    } else {
      await User.findByIdAndUpdate(userId, { status });
    }
    io.emit('user-presence', { userId, status, userType });
    if (callback) callback({ success: true });
  } catch (err) {
    if (callback) callback({ success: false, error: err.message });
  }
};
