import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { io as Client } from 'socket.io-client';
import express from 'express';
import { createServer } from 'http';
import { initSocket } from '../socket.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Message from '../models/Message.js';
import errorHandler from '../middleware/errorHandler.js';

dotenv.config();

const PORT = 5556;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';
process.env.JWT_SECRET = JWT_SECRET;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING REAL-TIME MESSAGE EVENT ROUTING TESTS ---');

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up existing test accounts/messages
  console.log('Cleaning up old test data...');
  const testEmails = ['test_user_routing@example.com', 'test_worker_routing@example.com'];
  await User.deleteMany({ email: { $in: testEmails } });
  await Worker.deleteMany({ email: { $in: testEmails } });
  await Message.deleteMany({});

  // Create test User and Worker
  console.log('Creating test user and worker...');
  const testUser = await User.create({
    name: 'Test Routing User',
    email: 'test_user_routing@example.com',
    password: 'Password123'
  });

  const testWorker = await Worker.create({
    name: 'Test Routing Worker',
    email: 'test_worker_routing@example.com',
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
  initSocket(server);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  let userSocketClient;
  let workerSocketClient;

  try {
    // 1. Connect user client
    console.log('Connecting User Socket...');
    userSocketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: userToken }
    });

    await new Promise((resolve, reject) => {
      userSocketClient.on('connect', resolve);
      userSocketClient.on('connect_error', reject);
    });
    console.log('User socket connected successfully.');

    // 2. Connect worker client
    console.log('Connecting Worker Socket...');
    workerSocketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: workerToken }
    });

    await new Promise((resolve, reject) => {
      workerSocketClient.on('connect', resolve);
      workerSocketClient.on('connect_error', reject);
    });
    console.log('Worker socket connected successfully.');

    await sleep(200);

    // 3. Test sendMessage routing and delivery confirmation callback
    console.log('\n--- Running Test: sendMessage and receiveMessage Routing ---');
    
    let workerReceived = false;
    let userReceived = false;
    let receivedPayload = null;

    // Set up listeners for receiveMessage event
    workerSocketClient.once('receiveMessage', (data) => {
      console.log(`- Worker received message event: "${data.text}"`);
      workerReceived = true;
      receivedPayload = data;
    });

    userSocketClient.once('receiveMessage', (data) => {
      console.log(`- User (sender) received message event (multi-device sync): "${data.text}"`);
      userReceived = true;
    });

    // Emit sendMessage from user with callback
    console.log('Emitting sendMessage from User...');
    const ack = await new Promise((resolve) => {
      userSocketClient.emit('sendMessage', {
        receiverId: testWorker._id.toString(),
        receiverModel: 'Worker',
        text: 'Hello, this is a real-time message!'
      }, resolve);
    });

    console.log(`- Delivery confirmation callback status: ${JSON.stringify(ack)}`);

    // Wait for events to fire
    await sleep(500);

    // Assertions
    if (!ack.success) {
      throw new Error('Callback reported failure.');
    }
    if (!workerReceived) {
      throw new Error('Worker did not receive the message.');
    }
    if (!userReceived) {
      throw new Error('Sender did not receive the message for multi-device sync.');
    }
    if (receivedPayload.text !== 'Hello, this is a real-time message!') {
      throw new Error('Received text does not match emitted text.');
    }

    // Verify database persistence
    const dbMsg = await Message.findOne({ senderId: testUser._id, receiverId: testWorker._id });
    if (!dbMsg || dbMsg.text !== 'Hello, this is a real-time message!') {
      throw new Error('Message not persisted in database correctly.');
    }
    console.log('SUCCESS: Real-time message routing, database persistence, and delivery confirmation verified.');

    console.log('\n=============================================');
    console.log('ALL MESSAGE EVENT ROUTING TESTS PASSED!');
    console.log('=============================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
    process.exit(1);
  } finally {
    // Cleanup sockets
    if (userSocketClient) userSocketClient.disconnect();
    if (workerSocketClient) workerSocketClient.disconnect();

    await sleep(200);

    // Clean up DB records
    console.log('Cleaning up database records...');
    await User.deleteMany({ email: { $in: testEmails } });
    await Worker.deleteMany({ email: { $in: testEmails } });
    await Message.deleteMany({});

    // Close mongoose connection and http server
    await mongoose.connection.close();
    server.close(() => {
      console.log('Test server closed.');
      process.exit(0);
    });
  }
}

runTests();
