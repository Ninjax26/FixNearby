import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import { createBooking, getBookings } from '../controllers/bookingController.js';

const runTests = async () => {
  console.log('--- RUNNING BOOKINGS FLOW TESTS ---');
  
  try {
    const mockReq = {
      body: {
        workerId: new mongoose.Types.ObjectId(),
        service: 'Electrician',
        scheduledTime: new Date(Date.now() + 24 * 3600000).toISOString(),
        durationHours: 2,
        address: '123 Main St, New York',
        price: 90
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

    await createBooking(mockReq, mockRes, (err) => {
      console.error('Express next() called with error:', err);
    });

    console.log(`Test Create Booking - Status: ${responseStatus}`);
    if (responseStatus === 201 || responseStatus === 409) {
      console.log('SUCCESS: Booking created successfully or overlapping rejected.');
    } else {
      console.error('FAIL: Unexpected response status.');
    }

  } catch (err) {
    console.error('Test execution failed with error:', err);
  }
};

if (process.argv[1] && process.argv[1].endsWith('verifyBookingsFlow.js')) {
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
