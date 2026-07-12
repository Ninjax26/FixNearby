import { io } from 'socket.io-client';

let socket = null;
let listeners = new Map();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const connectSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
  });

  socket.on('connect', () => {
    console.debug('[Socket] Connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.debug('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('[Socket] Error:', error.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    listeners.forEach((handler, event) => {
      socket.off(event, handler);
    });
    listeners.clear();
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const isConnected = () => socket?.connected || false;

export const sendMessage = (data) => {
  if (!socket?.connected) {
    console.warn('[Socket] Cannot send message: not connected');
    return false;
  }
  socket.emit('send_message', data);
  return true;
};

export const joinConversation = (conversationId) => {
  if (!socket?.connected) return;
  socket.emit('join_conversation', { conversationId });
};

export const leaveConversation = (conversationId) => {
  if (!socket?.connected) return;
  socket.emit('leave_conversation', { conversationId });
};

export const startTyping = (conversationId, recipientId) => {
  if (!socket?.connected) return;
  socket.emit('typing_start', { conversationId, recipientId });
};

export const stopTyping = (conversationId, recipientId) => {
  if (!socket?.connected) return;
  socket.emit('typing_stop', { conversationId, recipientId });
};

export const onMessage = (handler) => {
  if (!socket) return () => {};
  socket.on('new_message', handler);
  listeners.set('new_message', handler);
  return () => {
    socket.off('new_message', handler);
    listeners.delete('new_message');
  };
};

export const onTyping = (handler) => {
  if (!socket) return () => {};
  socket.on('typing', handler);
  listeners.set('typing', handler);
  return () => {
    socket.off('typing', handler);
    listeners.delete('typing');
  };
};

export const onPresenceUpdate = (handler) => {
  if (!socket) return () => {};
  socket.on('presence_update', handler);
  listeners.set('presence_update', handler);
  return () => {
    socket.off('presence_update', handler);
    listeners.delete('presence_update');
  };
};

export const onConversationUpdate = (handler) => {
  if (!socket) return () => {};
  socket.on('conversation_update', handler);
  listeners.set('conversation_update', handler);
  return () => {
    socket.off('conversation_update', handler);
    listeners.delete('conversation_update');
  };
};

export default {
  connectSocket,
  disconnectSocket,
  getSocket,
  isConnected,
  sendMessage,
  joinConversation,
  leaveConversation,
  startTyping,
  stopTyping,
  onMessage,
  onTyping,
  onPresenceUpdate,
  onConversationUpdate,
};
