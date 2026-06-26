import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { io as Client } from 'socket.io-client';
import express from 'express';
import { createServer } from 'http';
import { initSocket } from '../socket.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import errorHandler from '../middleware/errorHandler.js';

dotenv.config();

const PORT = 5557;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';
process.env.JWT_SECRET = JWT_SECRET;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING CONNECTION LIFECYCLE & ROOM MAPPING TESTS ---');

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up existing test accounts
  console.log('Cleaning up old test data...');
  const testEmails = ['test_user_lifecycle@example.com', 'test_worker_lifecycle@example.com'];
  await User.deleteMany({ email: { $in: testEmails } });
  await Worker.deleteMany({ email: { $in: testEmails } });

  // Create test User and Worker
  console.log('Creating test user and worker...');
  const testUser = await User.create({
    name: 'Test Lifecycle User',
    email: 'test_user_lifecycle@example.com',
    password: 'Password123'
  });

  const testWorker = await Worker.create({
    name: 'Test Lifecycle Worker',
    email: 'test_worker_lifecycle@example.com',
    password: 'Password123',
    category: 'Plumbing',
    experience: '5 years',
    location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
    contact: '1234567890',
    bio: 'Plumber bio info'
  });

  // Generate tokens
  const userToken = jwt.sign({ id: testUser._id }, JWT_SECRET, { expiresIn: '1d' });
  const workerToken = jwt.sign({ id: testWorker._id }, JWT_SECRET, { expiresIn: '1d' });

  // Initialize Express and HTTP Server with socket.io
  const app = express();
  app.use(express.json());
  app.use(errorHandler);

  const server = createServer(app);
  const io = initSocket(server);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  let userSocketClient1;
  let userSocketClient2;
  let workerSocketClient;

  try {
    // 1. Verify User Presence broadcast on Connect
    console.log('\n--- Running Test: User Presence Broadcast on Connection ---');
    let userPresenceReceived = false;
    let presencePayload = null;

    // Connect worker first so it can listen for user's presence broadcast
    workerSocketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: workerToken }
    });

    await new Promise((resolve, reject) => {
      workerSocketClient.on('connect', resolve);
      workerSocketClient.on('connect_error', reject);
    });

    workerSocketClient.on('user-presence', (data) => {
      if (data.userId === testUser._id.toString()) {
        userPresenceReceived = true;
        presencePayload = data;
      }
    });

    // Now connect user
    userSocketClient1 = Client(`http://localhost:${PORT}`, {
      auth: { token: userToken }
    });

    await new Promise((resolve, reject) => {
      userSocketClient1.on('connect', resolve);
      userSocketClient1.on('connect_error', reject);
    });

    await sleep(300);

    // Verify DB Statuses
    const dbUserConnected = await User.findById(testUser._id);
    const dbWorkerConnected = await Worker.findById(testWorker._id);

    console.log(`- User status in DB: "${dbUserConnected.status}" (Expected: "online")`);
    console.log(`- Worker availabilityStatus in DB: "${dbWorkerConnected.availabilityStatus}" (Expected: "available")`);

    if (dbUserConnected.status !== 'online') {
      throw new Error('User status in DB is not online after connection.');
    }
    if (dbWorkerConnected.availabilityStatus !== 'available') {
      throw new Error('Worker availabilityStatus in DB is not available after connection.');
    }
    if (!userPresenceReceived || presencePayload.status !== 'online') {
      throw new Error('User presence broadcast not received correctly.');
    }
    console.log('SUCCESS: Presence state and connection broadcast verified.');

    // 2. Verify Private Room Mapping
    console.log('\n--- Running Test: Private Room Mapping (socket.join(userId)) ---');
    let roomMsgReceived = false;

    userSocketClient1.on('custom_room_test', (data) => {
      if (data.msg === 'hello to room') {
        roomMsgReceived = true;
      }
    });

    // Send a message directly to the user's private room using the server instance
    io.to(testUser._id.toString()).emit('custom_room_test', { msg: 'hello to room' });
    await sleep(200);

    if (!roomMsgReceived) {
      throw new Error('Failed to deliver message via user private room.');
    }
    console.log('SUCCESS: Private room mapping verified.');

    // 3. Verify Multiple Connections (Sessions) tracking & lifecycle
    console.log('\n--- Running Test: Multiple Sessions Lifecycle ---');
    
    // Connect a second client for the same User ID
    userSocketClient2 = Client(`http://localhost:${PORT}`, {
      auth: { token: userToken }
    });

    await new Promise((resolve, reject) => {
      userSocketClient2.on('connect', resolve);
      userSocketClient2.on('connect_error', reject);
    });
    console.log('Second socket connected for User.');

    await sleep(200);

    // Disconnect the first user socket
    console.log('Disconnecting User Socket 1...');
    userSocketClient1.disconnect();
    await sleep(300);

    // Verify User status is STILL online in the database (since socket 2 is still open)
    const dbUserAfterOneDisconnect = await User.findById(testUser._id);
    console.log(`- User status in DB after socket 1 disconnect: "${dbUserAfterOneDisconnect.status}" (Expected: "online")`);
    if (dbUserAfterOneDisconnect.status !== 'online') {
      throw new Error('User status was set to offline prematurely while another session was active.');
    }

    // Now disconnect the second user socket
    console.log('Disconnecting User Socket 2...');
    userSocketClient2.disconnect();
    await sleep(300);

    // Verify User status is now offline in the database
    const dbUserOffline = await User.findById(testUser._id);
    console.log(`- User status in DB after all socket disconnects: "${dbUserOffline.status}" (Expected: "offline")`);
    if (dbUserOffline.status !== 'offline') {
      throw new Error('User status was not set to offline after all sessions were closed.');
    }
    console.log('SUCCESS: Multi-session tracking and final disconnect lifecycle verified.');

    console.log('\n=============================================');
    console.log('ALL CONNECTION LIFECYCLE TESTS PASSED!');
    console.log('=============================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
    process.exit(1);
  } finally {
    // Cleanup sockets
    if (userSocketClient1 && userSocketClient1.connected) userSocketClient1.disconnect();
    if (userSocketClient2 && userSocketClient2.connected) userSocketClient2.disconnect();
    if (workerSocketClient && workerSocketClient.connected) workerSocketClient.disconnect();

    await sleep(200);

    // Clean up DB records
    console.log('Cleaning up database records...');
    await User.deleteMany({ email: { $in: testEmails } });
    await Worker.deleteMany({ email: { $in: testEmails } });

    // Close mongoose connection and http server
    await mongoose.connection.close();
    server.close(() => {
      console.log('Test server closed.');
      process.exit(0);
    });
  }
}

runTests();
