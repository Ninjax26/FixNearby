import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import Worker from '../models/Worker.js';
import Issue from '../models/Issue.js';
import workerRoutes from '../routes/workerRoutes.js';
import issueRoutes from '../routes/issueRoutes.js';
import errorHandler from '../middleware/errorHandler.js';

dotenv.config();

const PORT = 5565;

async function runTests() {
  console.log('--- STARTING DB QUERY PROJECTION & INDEXING INTEGRATION TESTS ---');

  // Connect to Database
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/FixNearby');
  console.log('Connected to MongoDB.');

  // Clean up existing test data
  console.log('Cleaning up old test data...');
  const testEmails = ['test_worker_proj@example.com'];
  await Worker.deleteMany({ email: { $in: testEmails } });
  await Issue.deleteMany({ category: 'Other', title: 'Water Pipe Leakage' });

  // Create test Worker
  console.log('Creating test worker with sensitive data...');
  const testWorker = await Worker.create({
    name: 'Test Proj Worker',
    email: 'test_worker_proj@example.com',
    password: 'SuperSecretPassword123',
    category: 'Plumbing',
    experience: '5 years',
    location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
    contact: '1234567890',
    bio: 'Sensitive Bio Information',
    availabilityStatus: 'available'
  });

  // Create test Issue
  console.log('Creating test issue...');
  const testIssue = await Issue.create({
    title: 'Water Pipe Leakage',
    description: 'Pipe leaking in the kitchen',
    category: 'Other',
    location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
    latitude: 37.7749,
    longitude: -122.4194,
    status: 'open',
    upvotes: 0,
    reportedAt: new Date()
  });

  // Initialize Express and HTTP Server
  const app = express();
  app.use(express.json());
  
  // Register routes
  app.use('/api/workers', workerRoutes);
  app.use('/api/issues', issueRoutes);
  app.use(errorHandler);

  const server = createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  try {
    // 1. Verify Worker Query Projections
    console.log('\nTest 1: Fetching workers and verifying projection...');
    const workersRes = await fetch(`http://localhost:${PORT}/api/workers`);
    const workersBody = await workersRes.json();
    
    if (workersRes.status !== 200 || !workersBody.success) {
      throw new Error(`Workers fetch failed with status: ${workersRes.status}`);
    }

    const matchedWorker = workersBody.workers.find(w => w.email === 'test_worker_proj@example.com');
    if (!matchedWorker) {
      throw new Error('Test worker not found in list response.');
    }

    console.log(`- Retrieved worker: ${JSON.stringify(matchedWorker)}`);
    
    // Check that excluded/sensitive fields are not present
    if (matchedWorker.password) {
      throw new Error('Sensitive "password" field was not projected out!');
    }
    if (matchedWorker.bio) {
      throw new Error('Sensitive "bio" field was not projected out!');
    }

    // Check that allowed projected fields are present
    const expectedWorkerFields = ['name', 'email', 'category', 'experience', 'location', 'contact', 'availabilityStatus'];
    for (const field of expectedWorkerFields) {
      if (matchedWorker[field] === undefined) {
        throw new Error(`Expected projected field "${field}" is missing from worker payload.`);
      }
    }
    console.log('SUCCESS: Worker query projection verified successfully.');

    // 2. Verify Issue Query Projections
    console.log('\nTest 2: Fetching nearby issues and verifying projection...');
    const issuesRes = await fetch(`http://localhost:${PORT}/api/issues/nearby?latitude=37.7749&longitude=-122.4194&category=Other&maxDistance=5000&zoom=15`);
    const issuesBody = await issuesRes.json();

    if (issuesRes.status !== 200) {
      throw new Error(`Issues fetch failed with status: ${issuesRes.status}`);
    }

    // Depending on return type: list or cluster
    const issueList = issuesBody.type === 'list' ? issuesBody.data : [];
    const matchedIssue = issueList.find(i => i.category === 'Other');
    if (!matchedIssue) {
      console.log('Issue response body:', JSON.stringify(issuesBody));
      throw new Error('Test issue not found in list response.');
    }

    console.log(`- Retrieved issue: ${JSON.stringify(matchedIssue)}`);

    // Verify unselected/extra fields or just match against exact projected keys
    const allowedIssueKeys = new Set(['_id', 'title', 'description', 'category', 'location', 'latitude', 'longitude', 'status', 'upvotes', 'reportedAt']);
    for (const key of Object.keys(matchedIssue)) {
      if (!allowedIssueKeys.has(key)) {
        throw new Error(`Field "${key}" was returned but is not in the allowed projection list!`);
      }
    }
    console.log('SUCCESS: Issue query projection verified successfully.');

    // 3. Verify Database Indexes
    console.log('\nTest 3: Verifying Worker database index setup...');
    const indexes = await mongoose.connection.db.collection('workers').indexes();
    console.log('Found worker indexes:', JSON.stringify(indexes));
    
    const hasCompoundIndex = indexes.some(idx => 
      idx.key && idx.key.category === 1 && idx.key.availabilityStatus === 1
    );

    if (!hasCompoundIndex) {
      throw new Error('Expected compound index on { category: 1, availabilityStatus: 1 } was not found.');
    }
    console.log('SUCCESS: Worker compound index verified.');

    console.log('\n=============================================');
    console.log('ALL QUERY PROJECTION & INDEXING TESTS PASSED!');
    console.log('=============================================');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error);
    process.exit(1);
  } finally {
    // Cleanup DB records
    console.log('Cleaning up database records...');
    await Worker.deleteMany({ email: { $in: testEmails } });
    await Issue.deleteMany({ category: 'Other', title: 'Water Pipe Leakage' });

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
