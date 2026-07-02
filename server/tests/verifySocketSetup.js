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
import { capitalize } from '../utils/stringHelper.js';

dotenv.config();

const PORT = 5560;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';
process.env.JWT_SECRET = JWT_SECRET;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING REAL-TIME SOCKET.IO SETUP & JWT HANDSHAKE TESTS ---');
  console.log(`[Verify Socket] Test check capitalization: ${capitalize('socket')}`);

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up existing test accounts/messages
  console.log('Cleaning up old test data...');
  const testEmails = ['test_user_setup@example.com', 'test_worker_setup@example.com'];
  await User.deleteMany({ email: { $in: testEmails } });
  await Worker.deleteMany({ email: { $in: testEmails } });
  await Message.deleteMany({});

  // Create test User and Worker
  console.log('Creating test user and worker...');
  const testUser = await User.create({
    name: 'Test Setup User',
    email: 'test_user_setup@example.com',
    password: 'Password123'
  });

  const testWorker = await Worker.create({
    name: 'Test Setup Worker',
    email: 'test_worker_setup@example.com',
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

  // 1. HTTP Server Wrapper Integration
  console.log('\nTest 1: Wrapping Express app with Native HTTP Server...');
  const app = express();
  app.use(express.json());
  app.use(errorHandler);

  const server = createServer(app);
  const io = initSocket(server);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`- Native HTTP Server wrapped and listening on port ${PORT}`);

  let userSocketClient;
  let workerSocketClient;

  try {
    // 2. Handshake JWT Middleware
    console.log('\nTest 2: Verifying Handshake JWT Middleware...');
    
    // Attempt connecting without token
    const clientNoToken = Client(`http://localhost:${PORT}`);
    const noTokenErr = await new Promise((resolve) => {
      clientNoToken.on('connect_error', (err) => resolve(err.message));
    });
    console.log(`- Connection with missing token rejected: "${noTokenErr}"`);
    if (noTokenErr !== 'Authentication error: Token not provided') {
      throw new Error('Should reject connection when token is not provided.');
    }
    clientNoToken.disconnect();

    // Connect user client with valid token
    userSocketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: userToken }
    });

    await new Promise((resolve, reject) => {
      userSocketClient.on('connect', resolve);
      userSocketClient.on('connect_error', reject);
    });
    console.log('- User client authenticated and connected successfully.');

    // Connect worker client with valid token
    workerSocketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: workerToken }
    });

    await new Promise((resolve, reject) => {
      workerSocketClient.on('connect', resolve);
      workerSocketClient.on('connect_error', reject);
    });
    console.log('- Worker client authenticated and connected successfully.');

    // 3. Private Rooms Mapping
    console.log('\nTest 3: Verifying Private Rooms Mapping (socket.join)...');
    let roomMsgDelivered = false;

    userSocketClient.on('room_test_event', (data) => {
      if (data.status === 'room_delivered') {
        roomMsgDelivered = true;
      }
    });

    // Send a message directly to user's room using the server instance
    io.to(testUser._id.toString()).emit('room_test_event', { status: 'room_delivered' });
    await sleep(200);

    if (!roomMsgDelivered) {
      throw new Error('Private room mapping failed to deliver event to recipient.');
    }
    console.log('SUCCESS: Private room mapping successfully verified.');

    // 4. sendMessage and receiveMessage handlers
    console.log('\nTest 4: Verifying sendMessage and receiveMessage routing...');
    let msgReceived = false;
    let msgPayload = null;

    workerSocketClient.once('receiveMessage', (data) => {
      msgReceived = true;
      msgPayload = data;
    });

    userSocketClient.emit('sendMessage', {
      receiverId: testWorker._id.toString(),
      receiverModel: 'Worker',
      text: 'Testing server setup and routing.'
    });

    await sleep(300);

    if (!msgReceived || msgPayload.text !== 'Testing server setup and routing.') {
      throw new Error('Message routing failed to deliver to recipient.');
    }

    // Verify DB persistence
    const savedMsg = await Message.findOne({ senderId: testUser._id, receiverId: testWorker._id });
    if (!savedMsg || savedMsg.text !== 'Testing server setup and routing.') {
      throw new Error('Message was not persisted in database correctly.');
    }
    console.log('SUCCESS: sendMessage, database persistence, and receiveMessage routing verified.');

    console.log('\n==================================================');
    console.log('ALL SERVER SETUP & JWT HANDSHAKE TESTS PASSED!');
    console.log('==================================================');

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
