import AuditLog from '../models/AuditLog.js';
import mongoose from 'mongoose';

export const auditLogger = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function (body) {
    res.send = originalSend;
    res.send(body);

    const actorId = req.user ? req.user._id : new mongoose.Types.ObjectId();
    const actorType = req.user && req.user.role === 'Worker' ? 'Worker' : 'User';
    const ipAddress = req.ip || req.connection.remoteAddress;

    AuditLog.create({
      actorId,
      actorType,
      action: `${req.method} ${req.baseUrl || req.path}`,
      resource: 'API_ENDPOINT',
      resourceId: new mongoose.Types.ObjectId(),
      status: 'success',
      ip: ipAddress,
      userAgent: req.get('user-agent') || 'test-agent',
      timestamp: new Date()
    }).catch(err => console.error("Audit log creation failed:", err));
  };

  next();
};
