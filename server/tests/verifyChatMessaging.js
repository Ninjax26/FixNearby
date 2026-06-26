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
import chatRoutes from '../routes/chatRoutes.js';
import errorHandler from '../middleware/errorHandler.js';

dotenv.config();

const PORT = 5555;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';
process.env.JWT_SECRET = JWT_SECRET;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING REAL-TIME CHAT & MESSAGING TESTS ---');

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up existing test accounts/messages
  console.log('Cleaning up old test data...');
  const testEmails = ['test_user_chat@example.com', 'test_worker_chat@example.com'];
  try {
    await Worker.collection.dropIndexes();
  } catch (err) {
    // Ignore if collection/indexes don't exist
  }
  await User.deleteMany({ email: { $in: testEmails } });
  await Worker.deleteMany({ email: { $in: testEmails } });
  await Message.deleteMany({});

  // Create test User and Worker
  console.log('Creating test user and worker...');
  const testUser = await User.create({
    name: 'Test Chat User',
    email: 'test_user_chat@example.com',
    password: 'Password123'
  });

  const testWorker = await Worker.create({
    name: 'Test Chat Worker',
    email: 'test_worker_chat@example.com',
    password: 'Password123',
    category: 'Plumbing',
    experience: '5 years',
    location: 'New York',
    contact: '1234567890',
    bio: 'Experienced plumber ready to assist'
  });

  // Generate tokens
  const userToken = jwt.sign({ id: testUser._id }, JWT_SECRET, { expiresIn: '1d' });
  const workerToken = jwt.sign({ id: testWorker._id }, JWT_SECRET, { expiresIn: '1d' });

  // Initialize Express and HTTP Server with socket.io
  const app = express();
  app.use(express.json());
  
  // Register routes
  app.use('/api/chat', chatRoutes);
  app.use(errorHandler);

  const server = createServer(app);
  initSocket(server);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  // Test Socket Clients
  let userSocketClient;
  let workerSocketClient;

  try {
    // 1. Connect user client
    console.log('\nConnecting User Socket...');
    userSocketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: userToken }
    });

    await new Promise((resolve, reject) => {
      userSocketClient.on('connect', resolve);
      userSocketClient.on('connect_error', reject);
    });
    console.log('User socket connected successfully.');

    // 2. Connect worker client
    console.log('\nConnecting Worker Socket...');
    workerSocketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: workerToken }
    });

    await new Promise((resolve, reject) => {
      workerSocketClient.on('connect', resolve);
      workerSocketClient.on('connect_error', reject);
    });
    console.log('Worker socket connected successfully.');

    // Wait a brief moment for status changes to persist in DB
    await sleep(200);

    // Verify User-Presence Event on Connect
    const updatedUser = await User.findById(testUser._id);
    const updatedWorker = await Worker.findById(testWorker._id);
    console.log(`User database status (expected: online): ${updatedUser.status}`);
    console.log(`Worker database availabilityStatus (expected: available): ${updatedWorker.availabilityStatus}`);
    
    if (updatedUser.status !== 'online' || updatedWorker.availabilityStatus !== 'available') {
      throw new Error('Database presence status verification failed on connection.');
    }
    console.log('SUCCESS: Connection presence status verified.');

    // 3. Test typing and stop_typing events
    console.log('\nTesting Typing Events...');
    const typingPromise = new Promise((resolve) => {
      workerSocketClient.once('typing', (data) => {
        console.log(`Worker received typing event from: ${data.senderId}`);
        resolve(data.senderId === testUser._id.toString());
      });
    });

    userSocketClient.emit('typing', { receiverId: testWorker._id.toString() });
    const typingResult = await typingPromise;
    if (!typingResult) throw new Error('Typing indicator failed.');
    console.log('SUCCESS: Typing indicator verified.');

    const stopTypingPromise = new Promise((resolve) => {
      workerSocketClient.once('stop_typing', (data) => {
        console.log(`Worker received stop_typing event from: ${data.senderId}`);
        resolve(data.senderId === testUser._id.toString());
      });
    });

    userSocketClient.emit('stop_typing', { receiverId: testWorker._id.toString() });
    const stopTypingResult = await stopTypingPromise;
    if (!stopTypingResult) throw new Error('Stop typing indicator failed.');
    console.log('SUCCESS: Stop typing indicator verified.');

    // 4. Test sendMessage and receiveMessage
    console.log('\nTesting sendMessage and receiveMessage events...');
    const msgPromise = new Promise((resolve) => {
      workerSocketClient.once('receiveMessage', (data) => {
        console.log(`Worker received message: "${data.text}" from ${data.senderId}`);
        resolve(data);
      });
    });

    // Send a message from user to worker
    userSocketClient.emit('sendMessage', {
      receiverId: testWorker._id.toString(),
      receiverModel: 'Worker',
      text: 'Hello from test user!'
    });

    const receivedMsg = await msgPromise;
    if (receivedMsg.text !== 'Hello from test user!') {
      throw new Error('Message transmission failed.');
    }
    console.log('SUCCESS: Message transmission and real-time delivery verified.');

    // Verify message persistence in DB
    const dbMessagesCount = await Message.countDocuments({
      senderId: testUser._id,
      receiverId: testWorker._id
    });
    if (dbMessagesCount !== 1) {
      throw new Error('Message persistence in database failed.');
    }
    console.log('SUCCESS: Message database persistence verified.');

    // 5. Test manual presence update (online -> busy)
    console.log('\nTesting Presence Status Updates...');
    const presencePromise = new Promise((resolve) => {
      userSocketClient.once('user-presence', (data) => {
        console.log(`User presence broadcast event received: ${JSON.stringify(data)}`);
        resolve(data);
      });
    });

    workerSocketClient.emit('update_status', { status: 'busy' });
    const presenceData = await presencePromise;
    if (presenceData.userId !== testWorker._id.toString() || presenceData.status !== 'busy') {
      throw new Error('Manual presence status update failed.');
    }

    const workerInDb = await Worker.findById(testWorker._id);
    if (workerInDb.availabilityStatus !== 'busy') {
      throw new Error('Manual presence status update failed to persist in DB.');
    }
    console.log('SUCCESS: Presence status updates verified.');

    // 6. Test cursor-based pagination chat history REST endpoint
    console.log('\nTesting Cursor-Based Chat History REST endpoint...');
    // Seed more messages to test pagination
    console.log('Seeding multiple messages for pagination testing...');
    await Message.deleteMany({}); // clear previous message
    
    // Create 5 test messages
    const messageTexts = ['Msg 1', 'Msg 2', 'Msg 3', 'Msg 4', 'Msg 5'];
    const createdMessages = [];
    for (const txt of messageTexts) {
      const msg = await Message.create({
        senderId: testUser._id,
        senderModel: 'User',
        receiverId: testWorker._id,
        receiverModel: 'Worker',
        text: txt
      });
      createdMessages.push(msg);
      await sleep(50); // slight offset for order consistency
    }

    // Call REST endpoint using fetch/axios mock or programmatic controller call
    // Let's directly call the getChatHistory controller function programmatically for strict verification
    const { getChatHistory } = await import('../controllers/chatController.js');

    // Page 1: limit = 3
    let resJson;
    const reqMock1 = {
      user: testUser,
      params: { partnerId: testWorker._id.toString() },
      query: { limit: '3' }
    };
    const resMock1 = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        resJson = data;
      }
    };

    await getChatHistory(reqMock1, resMock1);
    console.log(`Page 1 messages retrieved: ${resJson.messages.map(m => m.text).join(', ')}`);
    console.log(`Has more: ${resJson.hasMore}, Next Cursor: ${resJson.nextCursor}`);

    if (resJson.messages.length !== 3 || resJson.messages[0].text !== 'Msg 5' || !resJson.hasMore) {
      throw new Error('REST API Chat History Page 1 validation failed.');
    }

    // Page 2: using cursor
    const reqMock2 = {
      user: testUser,
      params: { partnerId: testWorker._id.toString() },
      query: { limit: '3', cursor: resJson.nextCursor.toString() }
    };
    let resJson2;
    const resMock2 = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        resJson2 = data;
      }
    };

    await getChatHistory(reqMock2, resMock2);
    console.log(`Page 2 messages retrieved: ${resJson2.messages.map(m => m.text).join(', ')}`);
    console.log(`Has more: ${resJson2.hasMore}, Next Cursor: ${resJson2.nextCursor}`);

    if (resJson2.messages.length !== 2 || resJson2.messages[0].text !== 'Msg 2' || resJson2.hasMore) {
      throw new Error('REST API Chat History Page 2 validation failed.');
    }
    console.log('SUCCESS: Cursor-based pagination validated successfully.');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
    process.exit(1);
  } finally {
    // Cleanup sockets
    if (userSocketClient) userSocketClient.disconnect();
    if (workerSocketClient) workerSocketClient.disconnect();

    // Give sockets time to disconnect
    await sleep(200);

    // Verify offline status in DB on disconnect
    const userOff = await User.findById(testUser._id);
    const workerOff = await Worker.findById(testWorker._id);
    console.log(`Disconnected user status (expected: offline): ${userOff.status}`);
    console.log(`Disconnected worker status (expected: offline): ${workerOff.availabilityStatus}`);

    // Clean up DB records
    await User.deleteMany({ email: { $in: testEmails } });
    await Worker.deleteMany({ email: { $in: testEmails } });
    await Message.deleteMany({});

    // Close mongoose connection and http server
    await mongoose.connection.close();
    server.close(() => {
      console.log('Test server closed.');
      console.log('\n=============================================');
      console.log('ALL REAL-TIME MESSAGING TESTS PASSED SUCCESSFULLY!');
      console.log('=============================================');
      process.exit(0);
    });
  }
}

runTests();
