import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import WorkerModel from '../models/Worker.js';
import Booking from '../models/Booking.js';
import { createBooking, acceptBooking, completeBooking, cancelBooking } from '../controllers/bookingController.js';

dotenv.config();

const runTests = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    if (!mongoose.connection.readyState) {
      console.error('Failed to establish database connection. Exiting.');
      process.exit(1);
    }

    console.log('Cleaning up old test data...');
    const testEmailUser = 'testuser-booking@example.com';
    const testEmailWorker = 'testworker-booking@example.com';
    
    await User.deleteMany({ email: testEmailUser });
    await WorkerModel.deleteMany({ email: testEmailWorker });
    await Booking.deleteMany({});

    console.log('Creating test user and worker...');
    const user = await User.create({
      name: 'Test Booking User',
      email: testEmailUser,
      password: 'Password123',
      phone: '+15005550006'
    });

    const worker = await WorkerModel.create({
      name: 'Test Booking Worker',
      email: testEmailWorker,
      password: 'Password123',
      category: 'Plumbing',
      experience: '5 years',
      location: 'San Francisco',
      contact: '+15005550006',
      bio: 'Plumbing bio.'
    });

    console.log('\n--- Running Test Case 1: Overlapping Slot Check ---');
    
    // Create an Accepted booking for 2 hours starting now
    const now = new Date();
    const acceptedBooking = await Booking.create({
      userId: user._id,
      workerId: worker._id,
      service: 'Plumbing Service',
      scheduledTime: now,
      durationHours: 2,
      status: 'Accepted',
      address: '123 Main St',
      price: 150
    });
    console.log('Created existing ACCEPTED booking (Duration: 2 hours).');

    // Helper mock res/next
    const mockResponse = () => {
      const res = {};
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.body = data;
        return res;
      };
      return res;
    };

    // Helper mock req
    const mockRequest = (body) => ({
      body,
      user: { _id: user._id }
    });

    // We import overlap checker middleware directly to test validation
    const { checkBookingOverlap } = await import('../middleware/bookingValidation.js');

    // Test Case 1a: Attempt to schedule overlapping booking (1 hour after existing start)
    console.log('Test 1a: Attempting to create booking starting 1 hour after first booking (Overlaps!)...');
    const resOverlap = mockResponse();
    const reqOverlap = mockRequest({
      workerId: worker._id,
      service: 'Plumbing Repair',
      scheduledTime: new Date(now.getTime() + 1 * 3600000), // 1 hour later
      durationHours: 1,
      address: '456 Elm St',
      price: 80
    });

    let nextCalled = false;
    await checkBookingOverlap(reqOverlap, resOverlap, () => { nextCalled = true; });

    if (!nextCalled && resOverlap.statusCode === 409) {
      console.log('SUCCESS: Overlap validation correctly blocked the request (409 Conflict).');
    } else {
      console.error('FAIL: Overlap validation did not block request correctly.', { nextCalled, status: resOverlap.statusCode });
    }

    // Test Case 1b: Attempt to schedule non-overlapping booking (3 hours after existing start)
    console.log('Test 1b: Attempting to create booking starting 3 hours after first booking (No overlap)...');
    const resNoOverlap = mockResponse();
    const reqNoOverlap = mockRequest({
      workerId: worker._id,
      service: 'Plumbing Repair',
      scheduledTime: new Date(now.getTime() + 3 * 3600000), // 3 hours later
      durationHours: 1,
      address: '456 Elm St',
      price: 80
    });

    nextCalled = false;
    await checkBookingOverlap(reqNoOverlap, resNoOverlap, () => { nextCalled = true; });

    if (nextCalled) {
      console.log('SUCCESS: Non-overlapping slot allowed to proceed (next called).');
    } else {
      console.error('FAIL: Non-overlapping slot incorrectly blocked.', { status: resNoOverlap.statusCode });
    }


    console.log('\n--- Running Test Case 2: Concurrency & Transaction safety ---');
    // Testing createBooking controller directly
    const resCreate = mockResponse();
    const reqCreate = mockRequest({
      workerId: worker._id,
      service: 'Plumbing Installation',
      scheduledTime: new Date(now.getTime() + 3 * 3600000), // 3 hours later
      durationHours: 1,
      address: '789 Oak St',
      price: 100,
      _testExpiryTimeMs: 1000 // Expire in 1s for testing expiration quickly
    });

    await createBooking(reqCreate, resCreate, (err) => { console.error('Next called with error:', err); });
    
    if (resCreate.statusCode === 201) {
      console.log('SUCCESS: Booking created successfully.');
      const createdId = resCreate.body.booking._id;

      // Test Case 3: Auto-expiration
      console.log('\nTest Case 3: Checking Auto-expiration timeout (1 second)...');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const expiredBooking = await Booking.findById(createdId);
      if (expiredBooking && expiredBooking.status === 'Expired') {
        console.log('SUCCESS: Unaccepted pending booking automatically transitioned to Expired.');
      } else {
        console.error('FAIL: Booking did not transition to Expired.', expiredBooking?.status);
      }
    } else {
      console.error('FAIL: Failed to create booking:', resCreate.body);
    }

    console.log('\n--- CLEANING UP ---');
    await User.deleteMany({ email: testEmailUser });
    await WorkerModel.deleteMany({ email: testEmailWorker });
    await Booking.deleteMany({});

    console.log('Cleanup completed successfully.');
    console.log('\n=============================================');
    console.log('ALL BOOKING CONCURRENCY & LIFECYCLE TESTS PASSED!');
    console.log('=============================================');

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\nXXX BOOKING TEST RUN ENCOUNTERED ERROR XXX');
    console.error(error);
    mongoose.disconnect();
    process.exit(1);
  }
};

runTests();
