import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import Issue from '../models/Issue.js';
import logger from '../utils/logger.js';

export const getAdminStats = async (req, res) => {
  try {
    const [users, workers, bookings, issues] = await Promise.all([
      User.countDocuments(),
      Worker.countDocuments(),
      Booking.countDocuments(),
      Issue.countDocuments({ status: { $in: ['open', 'in-progress'] } }),
    ]);

    res.json({
      success: true,
      stats: { users, workers, bookings, issues },
    });
  } catch (err) {
    logger.error({ err }, 'Failed to fetch admin stats');
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email role status createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: users.length, users });
  } catch (err) {
    logger.error({ err }, 'Failed to fetch admin users');
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getAdminWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({})
      .select('name email category status experience averageRating karmaScore createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: workers.length, workers });
  } catch (err) {
    logger.error({ err }, 'Failed to fetch admin workers');
    res.status(500).json({ success: false, message: 'Failed to fetch workers' });
  }
};
