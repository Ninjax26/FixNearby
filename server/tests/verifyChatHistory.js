import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Message from '../models/Message.js';
import { getChatHistory } from '../controllers/chatController.js';

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING PAGINATED CHAT HISTORY TESTS ---');

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up existing test accounts/messages
  console.log('Cleaning up old test data...');
  const testEmails = ['test_user_history@example.com', 'test_worker_history@example.com'];
  await User.deleteMany({ email: { $in: testEmails } });
  await Worker.deleteMany({ email: { $in: testEmails } });
  await Message.deleteMany({});

  // Create test User and Worker
  console.log('Creating test user and worker...');
  const testUser = await User.create({
    name: 'Test History User',
    email: 'test_user_history@example.com',
    password: 'Password123'
  });

  const testWorker = await Worker.create({
    name: 'Test History Worker',
    email: 'test_worker_history@example.com',
    password: 'Password123',
    category: 'Electrical',
    experience: '3 years',
    location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
    contact: '1234567891',
    bio: 'Electrician test bio'
  });

  console.log('Seeding 5 messages for pagination testing...');
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
    await sleep(20); // offset for order/timestamps
  }

  // Define response helper mock
  let responseData = null;
  const mockResponse = () => {
    const res = {};
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      responseData = data;
      return res;
    };
    return res;
  };

  try {
    // Test Case 1: Retrieve Page 1 (limit = 3)
    console.log('\n--- Test Case 1: Fetch Page 1 (limit = 3) ---');
    const req1 = {
      user: testUser,
      params: { partnerId: testWorker._id.toString() },
      query: { limit: '3' }
    };
    const res1 = mockResponse();
    responseData = null;

    await getChatHistory(req1, res1);

    if (res1.statusCode !== 200 || !responseData.success) {
      throw new Error(`Failed to retrieve page 1: status=${res1.statusCode}`);
    }

    console.log(`Retrieved messages: ${responseData.messages.map(m => m.text).join(', ')}`);
    console.log(`Next Cursor: ${responseData.nextCursor}, hasMore: ${responseData.hasMore}`);

    if (responseData.messages.length !== 3) {
      throw new Error(`Expected 3 messages, got ${responseData.messages.length}`);
    }
    if (responseData.messages[0].text !== 'Msg 5' || responseData.messages[1].text !== 'Msg 4' || responseData.messages[2].text !== 'Msg 3') {
      throw new Error('Messages are not in descending chronological/ID order');
    }
    if (!responseData.hasMore) {
      throw new Error('Expected hasMore to be true');
    }
    if (!responseData.nextCursor || responseData.nextCursor.toString() !== createdMessages[2]._id.toString()) {
      throw new Error('Incorrect nextCursor returned');
    }
    console.log('SUCCESS: Page 1 retrieval verified.');

    // Test Case 2: Retrieve Page 2 using cursor
    console.log('\n--- Test Case 2: Fetch Page 2 (limit = 3, with cursor) ---');
    const req2 = {
      user: testUser,
      params: { partnerId: testWorker._id.toString() },
      query: { limit: '3', cursor: responseData.nextCursor.toString() }
    };
    const res2 = mockResponse();
    responseData = null;

    await getChatHistory(req2, res2);

    if (res2.statusCode !== 200 || !responseData.success) {
      throw new Error(`Failed to retrieve page 2: status=${res2.statusCode}`);
    }

    console.log(`Retrieved messages: ${responseData.messages.map(m => m.text).join(', ')}`);
    console.log(`Next Cursor: ${responseData.nextCursor}, hasMore: ${responseData.hasMore}`);

    if (responseData.messages.length !== 2) {
      throw new Error(`Expected 2 messages, got ${responseData.messages.length}`);
    }
    if (responseData.messages[0].text !== 'Msg 2' || responseData.messages[1].text !== 'Msg 1') {
      throw new Error('Messages in page 2 are not in correct order');
    }
    if (responseData.hasMore) {
      throw new Error('Expected hasMore to be false');
    }
    console.log('SUCCESS: Page 2 retrieval verified.');

    console.log('\n=============================================');
    console.log('ALL PAGINATED CHAT HISTORY TESTS PASSED!');
    console.log('=============================================');

  } catch (error) {
    console.error('\n❌ TESTS FAILED:', error);
    process.exit(1);
  } finally {
    console.log('\nCleaning up database records...');
    await User.deleteMany({ email: { $in: testEmails } });
    await Worker.deleteMany({ email: { $in: testEmails } });
    await Message.deleteMany({});
    await mongoose.connection.close();
    console.log('Mongoose connection closed.');
    process.exit(0);
  }
}

runTests();
