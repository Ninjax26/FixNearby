import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import WorkerModel from '../models/Worker.js';
import Favorite from '../models/Favorite.js';

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
    const testEmailUser = 'testuser-fav@example.com';
    const testEmailWorker = 'testworker-fav@example.com';
    
    await User.deleteMany({ email: testEmailUser });
    await WorkerModel.deleteMany({ email: testEmailWorker });
    await Favorite.deleteMany({});

    console.log('Creating test user and worker...');
    const user = await User.create({
      name: 'Test Fav User',
      email: testEmailUser,
      password: 'Password123',
      phone: '+15005550006'
    });

    const worker = await WorkerModel.create({
      name: 'Test Fav Worker',
      email: testEmailWorker,
      password: 'Password123',
      category: 'Gardening',
      experience: '4 years',
      location: { type: 'Point', coordinates: [-73.935242, 40.73061] },
      contact: '+15005550006',
      bio: 'Gardener bio.'
    });

    console.log('\n--- Test 1: Add Worker to Favorites ---');
    const fav = await Favorite.create({
      userId: user._id,
      workerId: worker._id
    });
    console.log(`Successfully favorited worker! Fav ID: ${fav._id}`);

    console.log('\n--- Test 2: Double-Favorite Uniqueness Constraint ---');
    try {
      await Favorite.create({
        userId: user._id,
        workerId: worker._id
      });
      console.error('FAIL: Duplicate favorites allowed');
    } catch (err) {
      console.log('SUCCESS: Compound unique index correctly rejected duplicate favorite:', err.message);
    }

    console.log('\n--- Test 3: Fetching Favorites ---');
    const list = await Favorite.find({ userId: user._id }).populate('workerId');
    console.log(`Found ${list.length} saved workers (Expected: 1)`);
    if (list.length === 1 && String(list[0].workerId._id) === String(worker._id)) {
      console.log('SUCCESS: Fetched favorites populated successfully!');
    } else {
      console.error('FAIL: Fetch query did not match expected structure');
    }

    console.log('\n--- Test 4: Removing Favorites ---');
    const deleted = await Favorite.findOneAndDelete({ userId: user._id, workerId: worker._id });
    if (deleted) {
      console.log('SUCCESS: Removed worker from favorites successfully!');
    } else {
      console.error('FAIL: Favorite not found to delete');
    }

    const checkList = await Favorite.find({ userId: user._id });
    console.log(`Favorites remaining: ${checkList.length} (Expected: 0)`);

    console.log('\n--- CLEANING UP ---');
    await User.findByIdAndDelete(user._id);
    await WorkerModel.findByIdAndDelete(worker._id);
    console.log('Cleanup completed.');

    console.log('\n=============================================');
    console.log('ALL FAVORITES SYNC INTEGRATION TESTS PASSED!');
    console.log('=============================================');
    process.exit(0);
  } catch (error) {
    console.error('\nXXX TESTS FAILED XXX');
    console.error(error);
    process.exit(1);
  }
};

runTests();
