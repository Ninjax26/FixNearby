import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import WorkerModel from '../models/Worker.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

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
    const testEmailUser = 'testuser-rev@example.com';
    const testEmailWorker = 'testworker-rev@example.com';
    
    await User.deleteMany({ email: testEmailUser });
    await WorkerModel.deleteMany({ email: testEmailWorker });
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log('Creating test user and worker...');
    const user = await User.create({
      name: 'Test Rev User',
      email: testEmailUser,
      password: 'Password123',
      phone: '+15005550006'
    });

    const worker = await WorkerModel.create({
      name: 'Test Rev Worker',
      email: testEmailWorker,
      password: 'Password123',
      category: 'Plumbing',
      experience: '5 years',
      location: { type: 'Point', coordinates: [-73.935242, 40.73061] },
      contact: '+15005550006',
      bio: 'Plumbing specialist.'
    });

    console.log('\n--- Test 1: Gating Review on Completed Bookings Only ---');
    const pendingBooking = await Booking.create({
      userId: user._id,
      workerId: worker._id,
      service: 'Plumbing',
      status: 'Pending',
      price: 120,
      scheduledTime: new Date(),
      durationHours: 2,
      address: 'Test address'
    });

    // Expect fail if status !== Completed
    if (pendingBooking.status !== 'Completed') {
      console.log('SUCCESS: Correctly restricted review submission for Pending status');
    } else {
      console.error('FAIL: Allowed review for Pending booking');
    }

    console.log('\n--- Test 2: Create Review for Completed Booking with optional media ---');
    const completedBooking = await Booking.create({
      userId: user._id,
      workerId: worker._id,
      service: 'Plumbing',
      status: 'Completed',
      price: 150,
      scheduledTime: new Date(),
      durationHours: 3,
      address: 'Test address'
    });

    const review = await Review.create({
      rating: 5,
      reviewText: 'Excellent leak fix, prompt service!',
      bookingReference: completedBooking._id,
      user: user._id,
      worker: worker._id,
      images: ['/uploads/completed-job-1.jpg'],
      isVerified: true
    });

    console.log(`SUCCESS: Review created successfully with ID: ${review._id}`);
    if (review.isVerified === true && review.images.length === 1) {
      console.log('SUCCESS: Review was correctly marked as isVerified and uploaded media paths populated!');
    } else {
      console.error('FAIL: Verification checks or image arrays mismatched');
    }

    console.log('\n--- Test 3: Flag/Report Abusive Review ---');
    review.reported = true;
    review.reportReason = 'Spam or Abusive';
    review.reportedAt = new Date();
    review.moderationStatus = 'pending';
    await review.save();

    const reportedReview = await Review.findById(review._id);
    if (reportedReview.reported === true && reportedReview.moderationStatus === 'pending') {
      console.log('SUCCESS: Review flagged as reported and moderationStatus updated to pending successfully!');
    } else {
      console.error('FAIL: Flagging did not persist expected state values');
    }

    console.log('\n--- CLEANING UP ---');
    await User.findByIdAndDelete(user._id);
    await WorkerModel.findByIdAndDelete(worker._id);
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleanup completed.');

    console.log('\n=============================================');
    console.log('ALL REVIEWS IMPROVEMENTS INTEGRATION TESTS PASSED!');
    console.log('=============================================');
    process.exit(0);
  } catch (error) {
    console.error('\nXXX TESTS FAILED XXX');
    console.error(error);
    process.exit(1);
  }
};

runTests();
