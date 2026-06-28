import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import WorkerModel from '../models/Worker.js';
import Booking from '../models/Booking.js';
import { getWorkerAvailability } from '../controllers/workerController.js';

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
    const testEmailUser = 'testuser-availability@example.com';
    const testEmailWorker = 'testworker-availability@example.com';
    
    await User.deleteMany({ email: testEmailUser });
    await WorkerModel.deleteMany({ email: testEmailWorker });
    await Booking.deleteMany({ service: 'Availability Test Service' });

    console.log('Creating test user and worker...');
    const user = await User.create({
      name: 'Test Availability User',
      email: testEmailUser,
      password: 'Password123',
      phone: '+15005550007'
    });

    const worker = await WorkerModel.create({
      name: 'Test Availability Worker',
      email: testEmailWorker,
      password: 'Password123',
      category: 'Plumbing',
      experience: '5 years',
      location: {
        type: 'Point',
        coordinates: [-122.4194, 37.7749]
      },
      contact: '+15005550007',
      bio: 'Availability test bio.'
    });

    console.log('\n--- Running Test Case 1: Initial Availability Check ---');
    
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

    const res1 = mockResponse();
    const req1 = {
      params: { id: worker._id.toString() },
      query: { dateRange: 7 }
    };

    await getWorkerAvailability(req1, res1);

    if (res1.statusCode !== 200 || !res1.body.success) {
      throw new Error(`Failed to fetch initial availability. Status: ${res1.statusCode}`);
    }

    const initialSlots = res1.body.availableSlots;
    console.log(`SUCCESS: Initial slots fetched correctly. Total available slots: ${initialSlots.length}`);
    if (initialSlots.length === 0) {
      throw new Error('Expected at least some available slots in the next 7 days.');
    }

    // Pick the first available slot to book
    const targetSlot = initialSlots[0];
    console.log(`Booking slot: ${targetSlot.label} (Start: ${targetSlot.start})`);

    console.log('\n--- Running Test Case 2: Booking a Slot and Checking Excluded Availability ---');
    
    // Create an Accepted booking during the target slot time range (2 hours)
    const booking = await Booking.create({
      userId: user._id,
      workerId: worker._id,
      service: 'Availability Test Service',
      scheduledTime: new Date(targetSlot.start),
      durationHours: 2,
      status: 'Accepted',
      address: '123 Test St',
      price: 100
    });

    console.log('Booking successfully created in database with status Accepted.');

    // Fetch availability again
    const res2 = mockResponse();
    await getWorkerAvailability(req1, res2);

    if (res2.statusCode !== 200 || !res2.body.success) {
      throw new Error(`Failed to fetch availability after booking. Status: ${res2.statusCode}`);
    }

    const updatedSlots = res2.body.availableSlots;
    console.log(`SUCCESS: Post-booking slots fetched. Total: ${updatedSlots.length}`);

    // Check if the booked slot is no longer in the list
    const isBookedSlotStillAvailable = updatedSlots.some(
      slot => new Date(slot.start).getTime() === new Date(targetSlot.start).getTime()
    );

    if (isBookedSlotStillAvailable) {
      throw new Error('FAIL: The booked slot is still showing as available!');
    } else {
      console.log('SUCCESS: Booked slot was correctly excluded from the availability list.');
    }

    console.log('\n--- Running Test Case 3: Mock Worker Fallback Check ---');
    const resMock = mockResponse();
    const reqMock = {
      params: { id: '5' }, // Numeric fallback ID for mock workers
      query: { dateRange: 3 }
    };

    await getWorkerAvailability(reqMock, resMock);
    if (resMock.statusCode === 200 && resMock.body.availableSlots?.length > 0) {
      console.log('SUCCESS: Fallback mock slot generation succeeded for non-ObjectId worker ID.');
    } else {
      throw new Error(`Mock fallback failed. Status: ${resMock.statusCode}`);
    }

    console.log('\n--- CLEANING UP ---');
    await User.deleteMany({ email: testEmailUser });
    await WorkerModel.deleteMany({ email: testEmailWorker });
    await Booking.deleteMany({ service: 'Availability Test Service' });
    console.log('Cleanup completed successfully.');

    console.log('\n=============================================');
    console.log('ALL REAL-TIME AVAILABILITY TESTS PASSED!');
    console.log('=============================================');

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\nXXX REAL-TIME AVAILABILITY TEST RUN ENCOUNTERED ERROR XXX');
    console.error(error);
    mongoose.disconnect();
    process.exit(1);
  }
};

runTests();
