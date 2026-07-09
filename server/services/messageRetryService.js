import Message from '../models/Message.js';

/**
 * Simple in-memory message retry service.
 * For each socket, maintain a queue of pending messages with retry attempts.
 * Retries use exponential backoff up to a max attempts.
 */
class MessageRetryService {
  constructor() {
    this.queues = new Map(); // socket.id => [{msgData, attempts, timer}]
    this.maxAttempts = 5;
    this.baseDelay = 500; // ms
  }

  _getQueue(socketId) {
    if (!this.queues.has(socketId)) {
      this.queues.set(socketId, []);
    }
    return this.queues.get(socketId);
  }

  enqueue(socket, msgData) {
    const queue = this._getQueue(socket.id);
    queue.push({ msgData, attempts: 0 });
    this._processQueue(socket);
  }

  _processQueue(socket) {
    const queue = this._getQueue(socket.id);
    if (queue.length === 0) return;
    const item = queue[0];
    const { msgData, attempts } = item;
    try {
      socket.emit('sendMessage', msgData, (ack) => {
        if (ack && ack.success) {
          queue.shift();
          this._processQueue(socket);
        } else {
          this._scheduleRetry(socket, item);
        }
      });
    } catch (err) {
      this._scheduleRetry(socket, item);
    }
  }

  _scheduleRetry(socket, item) {
    item.attempts += 1;
    if (item.attempts > this.maxAttempts) {
      console.error('Message delivery failed after max retries', item.msgData);
      const queue = this._getQueue(socket.id);
      queue.shift();
      return;
    }
    const delay = this.baseDelay * Math.pow(2, item.attempts - 1);
    clearTimeout(item.timer);
    item.timer = setTimeout(() => this._processQueue(socket), delay);
  }

  clearSocketQueue(socketId) {
    if (this.queues.has(socketId)) {
      const queue = this.queues.get(socketId);
      queue.forEach(item => clearTimeout(item.timer));
      this.queues.delete(socketId);
    }
  }
}

export const messageRetryService = new MessageRetryService();
