import mongoose from 'mongoose';
import Issue from '../models/Issue.js';
import { createIssue, getNearbyIssues } from '../controllers/issueController.js';

// Simple unit/integration tests to verify the civic issues controllers logic
const runTests = async () => {
  console.log('--- RUNNING CIVIC ISSUES CONTROLLER TESTS ---');
  
  try {
    // 1. Mock Request/Response for createIssue
    const mockReq = {
      body: {
        title: 'Broken Traffic Light Near Mall',
        description: 'The traffic light is stuck on red for past 2 hours.',
        category: 'Traffic Light',
        latitude: '40.7128',
        longitude: '-74.0060'
      },
      user: {
        _id: new mongoose.Types.ObjectId()
      }
    };

    let responseStatus = 0;
    let responseData = null;

    const mockRes = {
      status: (code) => {
        responseStatus = code;
        return {
          json: (data) => {
            responseData = data;
          }
        };
      }
    };

    await createIssue(mockReq, mockRes);
    
    console.log(`Test Create Issue - Status: ${responseStatus}`);
    if (responseStatus === 201 || responseStatus === 409) {
      console.log('SUCCESS: Issue created or correctly flagged as duplicate.');
    } else {
      console.error('FAIL: Unexpected issue creation response status.');
    }

    // 2. Mock Request/Response for getNearbyIssues
    const mockGetReq = {
      query: {
        latitude: '40.7128',
        longitude: '-74.0060',
        radius: '5',
        zoom: '15'
      }
    };

    let getStatus = 0;
    let getData = null;

    const mockGetRes = {
      status: (code) => {
        getStatus = code;
        return {
          json: (data) => {
            getData = data;
          }
        };
      }
    };

    await getNearbyIssues(mockGetReq, mockGetRes);
    console.log(`Test Fetch Nearby Issues - Status: ${getStatus}`);
    if (getStatus === 200) {
      console.log('SUCCESS: Nearby issues fetched successfully.');
    } else {
      console.error('FAIL: Fetching nearby issues failed.');
    }

  } catch (err) {
    console.error('Test execution failed with error:', err);
  }
};

// Check if run directly
if (process.argv[1] && process.argv[1].endsWith('verifyIssues.js')) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/FixNearby')
    .then(async () => {
      await runTests();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

export default runTests;
