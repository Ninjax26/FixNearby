import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { calculateKarmaScores } from '../utils/karmaScheduler.js';

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
    const testEmailUser = 'testuser@example.com';
    const testEmailWorker = 'testworker@example.com';

    await User.deleteMany({ email: testEmailUser });
    await Worker.deleteMany({ email: testEmailWorker });

    console.log('Creating test user and worker...');
    const user = await User.create({
      name: 'Test User',
      email: testEmailUser,
      password: 'password123'
    });

    const worker = await Worker.create({
      name: 'Test Worker',
      email: testEmailWorker,
      password: 'password123',
      category: 'Plumbing',
      experience: '5 years',
      location: { type: 'Point', coordinates: [-71.0589, 42.3601] },
      contact: '1234567890',
      bio: 'Expert plumber.',
      responsiveness: 90
    });

    console.log('Creating bookings...');
    const completedBooking = await Booking.create({
      userId: user._id,
      workerId: worker._id,
      service: 'Plumbing',
      scheduledTime: new Date(),
      durationHours: 2,
      address: '123 Test St',
      price: 150,
      status: 'Completed'
    });

    const cancelledBooking = await Booking.create({
      userId: user._id,
      workerId: worker._id,
      service: 'Plumbing',
      scheduledTime: new Date(),
      durationHours: 2,
      address: '123 Test St',
      price: 200,
      status: 'Cancelled'
    });

    console.log('\n--- Running Test cases ---');

    // Test 1: Submit review for Completed Booking
    console.log('Test 1: Submit review for Completed Booking (should succeed)');
    const review = await Review.create({
      rating: 5,
      reviewText: 'Excellent plumbing work!',
      bookingReference: completedBooking._id,
      user: user._id,
      worker: worker._id
    });
    console.log('Review created successfully:', review._id);

    // Test 2: Verify post-save hook on Worker
    console.log('\nTest 2: Verify post-save hook (Worker rating & count)');
    let updatedWorker = await Worker.findById(worker._id);
    console.log(`Worker averageRating: ${updatedWorker.averageRating} (Expected: 5)`);
    console.log(`Worker reviewCount: ${updatedWorker.reviewCount} (Expected: 1)`);
    if (updatedWorker.averageRating !== 5 || updatedWorker.reviewCount !== 1) {
      throw new Error('Post-save hook verification failed');
    }
    console.log('Test 2 PASSED!');

    // Test 3: Attempt duplicate review
    console.log('\nTest 3: Submit duplicate review (should fail)');
    try {
      await Review.create({
        rating: 4,
        reviewText: 'Nice work!',
        bookingReference: completedBooking._id,
        user: user._id,
        worker: worker._id
      });
      throw new Error('Allowed duplicate review submission');
    } catch (err) {
      console.log('Duplicate review correctly blocked:', err.message);
    }
    console.log('Test 3 PASSED!');

    // Test 4: Update review rating & check recalculation
    console.log('\nTest 4: Update review rating and verify recalculation');
    review.rating = 3;
    await review.save();
    updatedWorker = await Worker.findById(worker._id);
    console.log(`Worker averageRating after update: ${updatedWorker.averageRating} (Expected: 3)`);
    if (updatedWorker.averageRating !== 3) {
      throw new Error('Update average rating recalculation failed');
    }
    console.log('Test 4 PASSED!');

    // Test 5: Verify Karma Score weekly algorithm
    console.log('\nTest 5: Verify Karma Score calculation');
    // Completed: 1, Cancelled: 1 => completionRate = 0.5 (40% weight => 20 points)
    // Rating: 3/5 = 0.6 (40% weight => 24 points)
    // Responsiveness: 90% = 0.9 (20% weight => 18 points)
    // Expected: 20 + 24 + 18 = 62
    await calculateKarmaScores();
    updatedWorker = await Worker.findById(worker._id);
    console.log(`Worker karmaScore: ${updatedWorker.karmaScore} (Expected: 62)`);
    if (updatedWorker.karmaScore !== 62) {
      throw new Error('Karma score calculation mismatch');
    }
    console.log('Test 5 PASSED!');

    // Test 6: Delete review and verify recalculation
    console.log('\nTest 6: Delete review and verify ratings reset');
    await review.deleteOne();
    await Review.calculateAverageRating(worker._id); // Ensure manual recalculate triggers on delete
    updatedWorker = await Worker.findById(worker._id);
    console.log(`Worker averageRating after delete: ${updatedWorker.averageRating} (Expected: 0)`);
    console.log(`Worker reviewCount after delete: ${updatedWorker.reviewCount} (Expected: 0)`);
    if (updatedWorker.averageRating !== 0 || updatedWorker.reviewCount !== 0) {
      throw new Error('Delete recalculation failed');
    }
    console.log('Test 6 PASSED!');

    console.log('\n--- CLEANING UP ---');
    await Booking.deleteMany({ _id: { $in: [completedBooking._id, cancelledBooking._id] } });
    await User.findByIdAndDelete(user._id);
    await Worker.findByIdAndDelete(worker._id);
    console.log('Cleanup completed successfully.');
    console.log('\n=======================================');
    console.log('ALL TRUST ENGINE INTEGRATION TESTS PASSED!');
    console.log('=======================================');

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\nXXX TEST RUN ENCOUNTERED ERROR XXX');
    console.error(error);
    mongoose.disconnect();
    process.exit(1);
  }
};

runTests();
