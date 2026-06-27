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

const PORT = 5559;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';
process.env.JWT_SECRET = JWT_SECRET;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING TYPING INDICATORS & PRESENCE TRACKING TESTS ---');

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up existing test accounts
  console.log('Cleaning up old test data...');
  const testEmails = ['test_user_presence@example.com', 'test_worker_presence@example.com'];
  await User.deleteMany({ email: { $in: testEmails } });
  await Worker.deleteMany({ email: { $in: testEmails } });

  // Create test User and Worker
  console.log('Creating test user and worker...');
  const testUser = await User.create({
    name: 'Test Presence User',
    email: 'test_user_presence@example.com',
    password: 'Password123'
  });

  const testWorker = await Worker.create({
    name: 'Test Presence Worker',
    email: 'test_worker_presence@example.com',
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
  const server = createServer(express());
  initSocket(server);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  let userSocketClient;
  let workerSocketClient;

  try {
    // 1. Verify connection auto-presence status updates and broad presence event
    console.log('\nTest 1: Connecting clients and checking automatic DB presence status...');
    
    // Connect user
    userSocketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: userToken }
    });

    await new Promise((resolve, reject) => {
      userSocketClient.on('connect', resolve);
      userSocketClient.on('connect_error', reject);
    });

    // Connect worker
    workerSocketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: workerToken }
    });

    await new Promise((resolve, reject) => {
      workerSocketClient.on('connect', resolve);
      workerSocketClient.on('connect_error', reject);
    });

    await sleep(300);

    const userConnected = await User.findById(testUser._id);
    const workerConnected = await Worker.findById(testWorker._id);

    console.log(`- User status in DB: "${userConnected.status}" (Expected: "online")`);
    console.log(`- Worker availabilityStatus in DB: "${workerConnected.availabilityStatus}" (Expected: "available")`);

    if (userConnected.status !== 'online') {
      throw new Error('User was not marked online on connection.');
    }
    if (workerConnected.availabilityStatus !== 'available') {
      throw new Error('Worker was not marked available on connection.');
    }
    console.log('SUCCESS: Automatic status updates on connect verified.');

    // 2. Verify typing indicators delivery
    console.log('\nTest 2: Verifying real-time typing indicators...');
    let typingReceived = false;
    let stopTypingReceived = false;

    workerSocketClient.on('typing', (data) => {
      if (data.senderId === testUser._id.toString()) {
        typingReceived = true;
      }
    });

    workerSocketClient.on('stop_typing', (data) => {
      if (data.senderId === testUser._id.toString()) {
        stopTypingReceived = true;
      }
    });

    userSocketClient.emit('typing', { receiverId: testWorker._id.toString() });
    await sleep(200);

    userSocketClient.emit('stop_typing', { receiverId: testWorker._id.toString() });
    await sleep(200);

    if (!typingReceived) {
      throw new Error('Typing event was not received by target client.');
    }
    if (!stopTypingReceived) {
      throw new Error('Stop typing event was not received by target client.');
    }
    console.log('SUCCESS: Typing indicators successfully transmitted.');

    // 3. Verify manual status update & presence event broadcast
    console.log('\nTest 3: Verifying manual status updates (update_status)...');
    let presenceBroadcastReceived = false;
    let presencePayload = null;

    userSocketClient.on('user-presence', (data) => {
      if (data.userId === testWorker._id.toString() && data.status === 'busy') {
        presenceBroadcastReceived = true;
        presencePayload = data;
      }
    });

    workerSocketClient.emit('update_status', { status: 'busy' });
    await sleep(300);

    const workerAfterManualUpdate = await Worker.findById(testWorker._id);
    console.log(`- Worker status in DB: "${workerAfterManualUpdate.availabilityStatus}" (Expected: "busy")`);
    console.log(`- Presence broadcast received by other client: ${presenceBroadcastReceived}`);

    if (workerAfterManualUpdate.availabilityStatus !== 'busy') {
      throw new Error('Worker availabilityStatus was not updated in DB.');
    }
    if (!presenceBroadcastReceived) {
      throw new Error('Presence status transition was not broadcast to other clients.');
    }
    console.log('SUCCESS: Manual status updates and broadcasts verified.');

    // 4. Verify disconnection presence tracking (handling multiple tabs/sockets)
    console.log('\nTest 4: Disconnecting clients and checking final DB presence status...');
    
    let offlineBroadcastReceived = false;
    workerSocketClient.on('user-presence', (data) => {
      if (data.userId === testUser._id.toString() && data.status === 'offline') {
        offlineBroadcastReceived = true;
      }
    });

    // Disconnect user client
    userSocketClient.disconnect();
    await sleep(300);

    const userAfterDisconnect = await User.findById(testUser._id);
    console.log(`- User status in DB: "${userAfterDisconnect.status}" (Expected: "offline")`);
    console.log(`- Offline presence broadcast received: ${offlineBroadcastReceived}`);

    if (userAfterDisconnect.status !== 'offline') {
      throw new Error('User status in DB was not set to offline.');
    }
    if (!offlineBroadcastReceived) {
      throw new Error('Offline presence broadcast was not received by other clients.');
    }
    console.log('SUCCESS: Disconnect presence cleanup verified.');

    console.log('\n=============================================');
    console.log('ALL TYPING AND PRESENCE STATUS TESTS PASSED!');
    console.log('=============================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
    process.exit(1);
  } finally {
    // Cleanup sockets
    if (userSocketClient && userSocketClient.connected) userSocketClient.disconnect();
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
