import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { getIo } from '../socket.js';

const normalizeRecipient = ({ userId, userModel, workerId, workerModel, recipientId, recipientModel }) => {
  // Accept either direct recipientId/recipientModel OR userId/userModel OR workerId/workerModel
  const id = recipientId || userId || workerId;
  const model = recipientModel || userModel || workerModel;
  return { id, model };
};

export const sendNotification = async (req, res, next) => {
  try {
    const {
      userId,
      userModel,
      workerId,
      workerModel,
      recipientId,
      recipientModel,
      type,
      title,
      message,
      entityId,
    } = req.body;

    const { id, model } = normalizeRecipient({
      userId,
      userModel,
      workerId,
      workerModel,
      recipientId,
      recipientModel,
    });

    if (!id || !model) {
      return res.status(400).json({
        success: false,
        message: 'recipientId/recipientModel (or userId/userModel or workerId/workerModel) is required',
      });
    }

    if (!['User', 'Worker'].includes(model)) {
      return res.status(400).json({ success: false, message: 'recipientModel must be User or Worker' });
    }

    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'type, title, and message are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid recipientId' });
    }

    if (entityId && !mongoose.Types.ObjectId.isValid(entityId)) {
      return res.status(400).json({ success: false, message: 'Invalid entityId' });
    }

    const notification = await Notification.create({
      recipientId: id,
      recipientModel: model,
      type,
      title,
      message,
      entityId: entityId || undefined,
      status: 'unread',
      readAt: null,
    });

    // Emit to personal room: socket.join(userId)
    try {
      const io = getIo();
      io?.to(String(id)).emit('notification:new', { notification });
    } catch {}

    res.status(201).json({ success: true, notification });
  } catch (err) {
    next(err);
  }
};

export const listMyNotifications = async (req, res, next) => {
  try {
    const principal = req.principal || req.user; // support potential middleware differences
    const { _id } = principal;
    const model = principal?.model || principal?.userType || (req.userType === 'Worker' ? 'Worker' : 'User');

    // In this codebase, authMiddleware sets req.user and likely includes role/model.
    // We'll fall back to req.user.role if present.
    const resolvedModel = model || (principal?.role ? (principal.role === 'worker' ? 'Worker' : 'User') : 'User');

    const notifications = await Notification.find({
      recipientId: _id,
      recipientModel: resolvedModel,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = notifications.filter((n) => n.status === 'unread').length;

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const principal = req.principal || req.user;
    const { _id } = principal;
    const model = principal?.model || principal?.userType || (req.userType === 'Worker' ? 'Worker' : 'User');
    const resolvedModel = model || (principal?.role ? (principal.role === 'worker' ? 'Worker' : 'User') : 'User');

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification id' });
    }

    const updated = await Notification.findOneAndUpdate(
      { _id: id, recipientId: _id, recipientModel: resolvedModel },
      { status: 'read', readAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, notification: updated });
  } catch (err) {
    next(err);
  }
};

