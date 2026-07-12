// Extended audit controller checks
import AuditLog from '../models/AuditLog.js';

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private (Admin or authorized personnel)
export const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.action) {
      query.action = req.query.action;
    }
    if (req.query.actorType) {
      query.actorType = req.query.actorType;
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: logs.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: logs
    });
  } catch (err) {
    next(err);
  }
};
