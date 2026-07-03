import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Worker from './models/Worker.js';
import Message from './models/Message.js';
import { verifySocketAuth } from './utils/verifySocketAuth.js';
import { messageRetryService } from './services/messageRetryService.js;

// Map to track active user socket mappings
// Map format: userId -> Set of socket.ids
const userSockets = new Map();

let ioInstance;

export const getIo = () => ioInstance;

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      credentials: true
    }
  });

  ioInstance = io;

  // Socket middleware for authentication
  io.use(verifySocketAuth);

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    const userType = socket.userType;

    // Track active connection
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    // Join personal room for targeting user directly
    socket.join(userId);

    // Set online status in database and broadcast
    try {
      if (userType === 'Worker') {
        await Worker.findByIdAndUpdate(userId, { availabilityStatus: 'available', lastActive: new Date() });
        io.emit('user-presence', { userId, status: 'available', userType });
      } else {
        await User.findByIdAndUpdate(userId, { status: 'online' });
        io.emit('user-presence', { userId, status: 'online', userType });
      }
    } catch (err) {
      console.error('Error setting status on connect:', err);
    }

    // Message transmission
    // Presence update from client
  socket.on('presence_update', async (data, callback) => {
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
  });

  // Message transmission with ordering & ack
  socket.on('sendMessage', async (data, callback) => {
    try {
      const { receiverId, receiverModel, text, timestamp } = data;
      if (!receiverId || !receiverModel || !text) {
        if (callback) callback({ success: false, error: 'Invalid message payload' });
        return;
      }
      if (!['User', 'Worker'].includes(receiverModel)) {
        if (callback) callback({ success: false, error: 'Invalid receiver model' });
        return;
      }
      // Simple ordering check – reject if timestamp older than last stored (optional)
      if (timestamp) {
        const lastMsg = await Message.findOne({
          $or: [
            { senderId: userId, receiverId },
            { senderId: receiverId, receiverId: userId }
          ]
        }).sort({ createdAt: -1 });
        if (lastMsg && new Date(timestamp) < lastMsg.createdAt) {
          if (callback) callback({ success: false, error: 'Out‑of‑order message' });
          return;
        }
      }
      // Persist message
      const message = await Message.create({
        senderId: userId,
        senderModel: userType,
        receiverId,
        receiverModel,
        text,
        createdAt: timestamp ? new Date(timestamp) : undefined
      });
      const msgData = {
        _id: message._id,
        senderId: message.senderId,
        senderModel: message.senderModel,
        receiverId: message.receiverId,
        receiverModel: message.receiverModel,
        text: message.text,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt
      };
      io.to(receiverId).emit('receiveMessage', msgData);
      io.to(userId).emit('receiveMessage', msgData);
      // Ack to sender
      socket.emit('message_ack', { messageId: message._id });
      if (callback) callback({ success: true, message: msgData });
    } catch (err) {
      if (callback) callback({ success: false, error: err.message });
    }
  });

    // Typing indicators
    socket.on('typing', (data) => {
      const { receiverId } = data;
      if (receiverId) {
        io.to(receiverId).emit('typing', { senderId: userId });
      }
    });

    socket.on('stop_typing', (data) => {
      const { receiverId } = data;
      if (receiverId) {
        io.to(receiverId).emit('stop_typing', { senderId: userId });
      }
    });

    // Presence management toggles
    socket.on('update_status', async (data) => {
      try {
        const { status } = data; // 'online' / 'available', 'busy', 'offline'
        if (!['online', 'available', 'busy', 'offline'].includes(status)) return;

        let dbStatus = status;
        if (userType === 'Worker') {
          // Map online to available for workers
          if (status === 'online') dbStatus = 'available';
          await Worker.findByIdAndUpdate(userId, { availabilityStatus: dbStatus, lastActive: new Date() });
        } else {
          // Map available to online for users
          if (status === 'available') dbStatus = 'online';
          await User.findByIdAndUpdate(userId, { status: dbStatus });
        }

        io.emit('user-presence', { userId, status: dbStatus, userType });
      } catch (err) {
        console.error('Error updating status:', err);
      }
    });

    // Handle Socket Disconnection
    socket.on('disconnect', async () => {
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
          
          try {
            if (userType === 'Worker') {
              await Worker.findByIdAndUpdate(userId, { availabilityStatus: 'offline', lastActive: new Date() });
              io.emit('user-presence', { userId, status: 'offline', userType });
            } else {
              await User.findByIdAndUpdate(userId, { status: 'offline' });
              io.emit('user-presence', { userId, status: 'offline', userType });
            }
          } catch (err) {
            console.error('Error setting offline status on disconnect:', err);
          }
        }
      }
    });
  });

  return io;
};
