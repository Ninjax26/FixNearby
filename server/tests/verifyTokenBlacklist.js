import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import express from 'express';
import { createServer } from 'http';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Blacklist from '../models/Blacklist.js';
import authRoutes from '../routes/authRoutes.js';
import errorHandler from '../middleware/errorHandler.js';

dotenv.config();

const PORT = 5562;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';
process.env.JWT_SECRET = JWT_SECRET;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('--- STARTING JWT LOGOUT & BLACKLIST INTEGRATION TESTS ---');

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up existing test accounts/blacklisted tokens
  console.log('Cleaning up old test data...');
  const testEmails = ['test_user_blacklist@example.com'];
  await User.deleteMany({ email: { $in: testEmails } });
  await Blacklist.deleteMany({});

  // Create test User
  console.log('Creating test user...');
  const testUser = await User.create({
    name: 'Test Blacklist User',
    email: 'test_user_blacklist@example.com',
    password: 'Password123'
  });

  // Generate valid token
  const token = jwt.sign({ id: testUser._id }, JWT_SECRET, { expiresIn: '1d' });

  // Initialize Express and HTTP Server
  const app = express();
  app.use(express.json());
  
  // Register routes
  app.use('/api/auth', authRoutes);
  app.use(errorHandler);

  const server = createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  try {
    // 1. Verify access to protected profile works with new token
    console.log('\nTest 1: Requesting protected profile with valid token (should succeed)...');
    const profileRes = await fetch(`http://localhost:${PORT}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const profileBody = await profileRes.json();
    console.log(`- Status: ${profileRes.status}, Name: ${profileBody.name}`);
    if (profileRes.status !== 200 || profileBody.email !== 'test_user_blacklist@example.com') {
      throw new Error('Initial profile retrieval failed.');
    }
    console.log('SUCCESS: Initial access authorized.');

    // 2. Perform Logout (should blacklist token)
    console.log('\nTest 2: Requesting logout endpoint with active token...');
    const logoutRes = await fetch(`http://localhost:${PORT}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const logoutBody = await logoutRes.json();
    console.log(`- Status: ${logoutRes.status}, Body: ${JSON.stringify(logoutBody)}`);
    if (logoutRes.status !== 200 || !logoutBody.success) {
      throw new Error('Logout request failed.');
    }

    // Verify token exists in database blacklist
    const blacklistDoc = await Blacklist.findOne({ token });
    if (!blacklistDoc) {
      throw new Error('Token was not added to the database blacklist.');
    }
    console.log('SUCCESS: Token blacklisted successfully.');

    // 3. Verify access to protected profile now fails (token invalidated)
    console.log('\nTest 3: Requesting protected profile again with now-blacklisted token (should fail)...');
    const profileAfterLogoutRes = await fetch(`http://localhost:${PORT}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const profileAfterLogoutBody = await profileAfterLogoutRes.json();
    console.log(`- Status: ${profileAfterLogoutRes.status}, Body: ${JSON.stringify(profileAfterLogoutBody)}`);
    if (profileAfterLogoutRes.status !== 401 || profileAfterLogoutBody.message !== 'Token has been invalidated') {
      throw new Error('Access should have been rejected with "Token has been invalidated".');
    }
    console.log('SUCCESS: Blacklisted token access rejected.');

    console.log('\n=============================================');
    console.log('ALL JWT BLACKLIST TESTS PASSED!');
    console.log('=============================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
    process.exit(1);
  } finally {
    // Cleanup DB records
    console.log('Cleaning up database records...');
    await User.deleteMany({ email: { $in: testEmails } });
    await Blacklist.deleteMany({});

    // Close mongoose connection and http server
    await mongoose.connection.close();
    server.close(() => {
      console.log('Test server closed.');
      setTimeout(() => {
        process.exit(0);
      }, 100);
    });
  }
}

runTests();
