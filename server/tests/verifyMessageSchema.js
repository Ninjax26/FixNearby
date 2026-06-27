import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';

dotenv.config();

async function runTests() {
  console.log('--- STARTING MONGOOSE POLYMORPHIC MESSAGE SCHEMA TESTS ---');

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up
  console.log('Cleaning up old test data...');
  const testEmails = ['test_user_msg@example.com', 'test_worker_msg@example.com'];
  await User.deleteMany({ email: { $in: testEmails } });
  await Worker.deleteMany({ email: { $in: testEmails } });
  await Message.deleteMany({});

  try {
    // Create test entities
    const user = await User.create({
      name: 'Test Msg User',
      email: 'test_user_msg@example.com',
      password: 'Password123'
    });

    const worker = await Worker.create({
      name: 'Test Msg Worker',
      email: 'test_worker_msg@example.com',
      password: 'Password123',
      category: 'Plumbing',
      experience: '5 years',
      location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
      contact: '1234567890',
      bio: 'Plumber bio info'
    });

    // 1. Verify Message Schema Polymorphism & Timestamps
    console.log('\nTest 1: Creating a Message from User to Worker...');
    const msg = await Message.create({
      senderId: user._id,
      senderModel: 'User',
      receiverId: worker._id,
      receiverModel: 'Worker',
      text: 'Polymorphic message test text.'
    });

    console.log(`- Created Message ID: ${msg._id}`);
    console.log(`- Timestamps: createdAt=${msg.createdAt}, updatedAt=${msg.updatedAt}`);

    if (!msg.createdAt || !msg.updatedAt) {
      throw new Error('Timestamps are not automatically populated.');
    }

    const fetchedMsg = await Message.findById(msg._id);
    if (fetchedMsg.senderModel !== 'User' || fetchedMsg.receiverModel !== 'Worker') {
      throw new Error('Polymorphic refPath/model mapping failed.');
    }
    console.log('SUCCESS: Message schema and polymorphism verified.');

    // 2. Verify Index setup
    console.log('\nTest 2: Verifying compound index setup on [senderId, receiverId]...');
    await Message.syncIndexes();
    const indexes = await Message.collection.indexes();
    console.log('Found collection indexes:', JSON.stringify(indexes, null, 2));

    const compoundIndexExists = indexes.some(idx => {
      const keys = Object.keys(idx.key);
      return keys.includes('senderId') && keys.includes('receiverId') && idx.key.senderId === 1 && idx.key.receiverId === 1;
    });

    if (!compoundIndexExists) {
      throw new Error('Compound index on { senderId: 1, receiverId: 1 } was not found.');
    }
    console.log('SUCCESS: Compound index on [senderId, receiverId] is present.');

    console.log('\n=============================================');
    console.log('ALL MONGOOSE MESSAGE SCHEMA TESTS PASSED!');
    console.log('=============================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
    process.exit(1);
  } finally {
    // Cleanup DB records
    console.log('Cleaning up database records...');
    await User.deleteMany({ email: { $in: testEmails } });
    await Worker.deleteMany({ email: { $in: testEmails } });
    await Message.deleteMany({});

    // Close mongoose connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

runTests();
