import { EventEmitter } from 'events';

class NotificationHub extends EventEmitter {
  constructor() {
    super();
    // Keep track of active connections
    this.activeWorkers = new Set();
  }

  sendToUser(userId, eventName, payload) {
    this.emit(`user:${userId}`, { eventName, payload });
  }

  sendToWorker(workerId, eventName, payload) {
    this.emit(`worker:${workerId}`, { eventName, payload });
  }

  broadcast(eventName, payload) {
    this.emit('broadcast', { eventName, payload });
  }
}

const notificationHub = new NotificationHub();
export default notificationHub;
