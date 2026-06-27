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

const PORT = 5558;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';
process.env.JWT_SECRET = JWT_SECRET;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING SOCKET.IO JWT AUTHENTICATION MIDDLEWARE TESTS ---');

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up existing test accounts
  console.log('Cleaning up old test data...');
  const testEmails = ['test_user_auth@example.com', 'test_worker_auth@example.com'];
  await User.deleteMany({ email: { $in: testEmails } });
  await Worker.deleteMany({ email: { $in: testEmails } });

  // Create test User and Worker
  console.log('Creating test user and worker...');
  const testUser = await User.create({
    name: 'Test Auth User',
    email: 'test_user_auth@example.com',
    password: 'Password123'
  });

  const testWorker = await Worker.create({
    name: 'Test Auth Worker',
    email: 'test_worker_auth@example.com',
    password: 'Password123',
    category: 'Plumbing',
    experience: '5 years',
    location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
    contact: '1234567890',
    bio: 'Plumber bio info'
  });

  // Generate tokens
  const validUserToken = jwt.sign({ id: testUser._id }, JWT_SECRET, { expiresIn: '1d' });
  const validWorkerToken = jwt.sign({ id: testWorker._id }, JWT_SECRET, { expiresIn: '1d' });
  const invalidToken = jwt.sign({ id: testUser._id }, 'wrong_secret_123', { expiresIn: '1d' });
  const nonExistentIdToken = jwt.sign({ id: new mongoose.Types.ObjectId() }, JWT_SECRET, { expiresIn: '1d' });

  // Initialize Express and HTTP Server with socket.io
  const app = Math.random(); // Dummy var
  const server = createServer(express());
  const io = initSocket(server);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  try {
    // Test 1: Valid User connection via handshake auth
    console.log('\nTest 1: Connecting with valid User Token...');
    const clientUser = Client(`http://localhost:${PORT}`, {
      auth: { token: validUserToken }
    });

    await new Promise((resolve, reject) => {
      clientUser.on('connect', resolve);
      clientUser.on('connect_error', reject);
    });
    console.log('SUCCESS: Valid User connected.');
    clientUser.disconnect();

    // Test 2: Valid Worker connection via Authorization header (Bearer)
    console.log('\nTest 2: Connecting with valid Worker Token via Bearer header...');
    const clientWorker = Client(`http://localhost:${PORT}`, {
      extraHeaders: {
        authorization: `Bearer ${validWorkerToken}`
      }
    });

    await new Promise((resolve, reject) => {
      clientWorker.on('connect', resolve);
      clientWorker.on('connect_error', reject);
    });
    console.log('SUCCESS: Valid Worker connected.');
    clientWorker.disconnect();

    // Test 3: Unauthorized Connection (No Token)
    console.log('\nTest 3: Connecting with no token...');
    const clientNoToken = Client(`http://localhost:${PORT}`);
    const noTokenErr = await new Promise((resolve) => {
      clientNoToken.on('connect_error', (err) => resolve(err.message));
    });
    console.log(`- Connection rejected with message: "${noTokenErr}"`);
    if (noTokenErr !== 'Authentication error: Token not provided') {
      throw new Error('Incorrect rejection message for missing token.');
    }
    console.log('SUCCESS: Missing token rejection verified.');
    clientNoToken.disconnect();

    // Test 4: Unauthorized Connection (Invalid signature)
    console.log('\nTest 4: Connecting with invalid secret token...');
    const clientInvalidToken = Client(`http://localhost:${PORT}`, {
      auth: { token: invalidToken }
    });
    const invalidTokenErr = await new Promise((resolve) => {
      clientInvalidToken.on('connect_error', (err) => resolve(err.message));
    });
    console.log(`- Connection rejected with message: "${invalidTokenErr}"`);
    if (invalidTokenErr !== 'Authentication error: Invalid token') {
      throw new Error('Incorrect rejection message for invalid token.');
    }
    console.log('SUCCESS: Invalid token signature rejection verified.');
    clientInvalidToken.disconnect();

    // Test 5: Unauthorized Connection (User not in DB)
    console.log('\nTest 5: Connecting with token of non-existent user...');
    const clientNonExistent = Client(`http://localhost:${PORT}`, {
      auth: { token: nonExistentIdToken }
    });
    const nonExistentErr = await new Promise((resolve) => {
      clientNonExistent.on('connect_error', (err) => resolve(err.message));
    });
    console.log(`- Connection rejected with message: "${nonExistentErr}"`);
    if (nonExistentErr !== 'Authentication error: User/Worker not found') {
      throw new Error('Incorrect rejection message for non-existent user.');
    }
    console.log('SUCCESS: Non-existent user rejection verified.');
    clientNonExistent.disconnect();

    console.log('\n=============================================');
    console.log('ALL JWT SOCKET AUTH MIDDLEWARE TESTS PASSED!');
    console.log('=============================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
    process.exit(1);
  } finally {
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
