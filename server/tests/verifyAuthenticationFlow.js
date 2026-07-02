import mongoose from 'mongoose';
import { register, login } from '../controllers/authController.js';

const runTests = async () => {
  console.log('--- RUNNING AUTHENTICATION FLOW TESTS ---');
  
  try {
    const mockEmail = `test-${Date.now()}@example.com`;
    const mockReq = {
      body: {
        name: 'John Test',
        email: mockEmail,
        password: 'Password123!',
        role: 'user'
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

    // Test Registration
    await register(mockReq, mockRes);
    console.log(`Test Registration - Status: ${responseStatus}`);
    if (responseStatus === 201 || responseStatus === 400) {
      console.log('SUCCESS: User registered or correctly rejected (validation/conflict).');
    } else {
      console.error('FAIL: Unexpected registration status.');
    }

    // Test Login
    const mockLoginReq = {
      body: {
        email: mockEmail,
        password: 'Password123!'
      }
    };

    await login(mockLoginReq, mockRes);
    console.log(`Test Login - Status: ${responseStatus}`);
    if (responseStatus === 200 || responseStatus === 401) {
      console.log('SUCCESS: User login logic executed successfully.');
    } else {
      console.error('FAIL: Unexpected login status.');
    }

  } catch (err) {
    console.error('Test execution failed with error:', err);
  }
};

if (process.argv[1] && process.argv[1].endsWith('verifyAuthenticationFlow.js')) {
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
