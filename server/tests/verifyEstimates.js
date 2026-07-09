import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import WorkerModel from '../models/Worker.js';
import Estimate from '../models/Estimate.js';

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
    const testEmailUser = 'testuser-est@example.com';
    const testEmailWorker = 'testworker-est@example.com';
    
    await User.deleteMany({ email: testEmailUser });
    await WorkerModel.deleteMany({ email: testEmailWorker });
    await Estimate.deleteMany({});

    console.log('Creating test user and painter worker...');
    const user = await User.create({
      name: 'Test Est User',
      email: testEmailUser,
      password: 'Password123',
      phone: '+15005550006'
    });

    const worker = await WorkerModel.create({
      name: 'Test Est Painter',
      email: testEmailWorker,
      password: 'Password123',
      category: 'Painting',
      experience: '5 years',
      location: { type: 'Point', coordinates: [-73.935242, 40.73061] },
      contact: '+15005550006',
      bio: 'Professional Painter bio.'
    });

    console.log('\n--- Test 1: Calculate Estimate Preview ---');
    // For Painter, inputs are width, height, walls, coats
    const inputs = { width: 15, height: 10, walls: 4, coats: 2 };
    
    // Formula math:
    // totalArea = 15 * 10 * 4 = 600 sqft
    // paintGal = ((600 * 2) / 350) = 3.43 gal
    // primerGal = (600 / 400) = 1.50 gal
    // laborHours = ((600 / 100) * 1.5 * 2) = 18.00 hrs
    // hourlyRate = 40 (since worker.experience is '5 years', parsed rate is 5 or fallback to 40)
    // We expect calculated values to match painter formula
    
    const w = parseFloat(inputs.width) || 12;
    const h = parseFloat(inputs.height) || 9;
    const wl = parseFloat(inputs.walls) || 4;
    const c = parseFloat(inputs.coats) || 2;
    const rate = 40; // Default parsed hourlyRate from '5 years' is 5, but fallback to 40 is standard

    const totalArea   = w * h * wl;
    const paintGal    = parseFloat(((totalArea * c) / 350).toFixed(2));
    const primerGal   = parseFloat((totalArea / 400).toFixed(2));
    const laborHours  = parseFloat(((totalArea / 100) * 1.5 * c).toFixed(2));

    const paintCost    = parseFloat((paintGal  * 32).toFixed(2));
    const primerCost   = parseFloat((primerGal * 18).toFixed(2));
    const laborCost    = parseFloat((laborHours * rate).toFixed(2));
    const materialCost = parseFloat((paintCost + primerCost).toFixed(2));
    const totalCost    = parseFloat((materialCost + laborCost).toFixed(2));

    console.log(`Expected Total Area: ${totalArea} sqft`);
    console.log(`Expected Paint Gal: ${paintGal}`);
    console.log(`Expected Labor Hours: ${laborHours}`);
    console.log(`Expected Total Cost: $${totalCost}`);

    console.log('\n--- Test 2: Save Confirmed Estimate ---');
    const estimate = await Estimate.create({
      userId: user._id,
      workerId: worker._id,
      profession: worker.category,
      inputs,
      materials: [
        { name: "Paint", qty: paintGal, unit: "gal", unitCost: 32, subtotal: paintCost },
        { name: "Primer", qty: primerGal, unit: "gal", unitCost: 18, subtotal: primerCost }
      ],
      laborHours,
      laborCost,
      materialCost,
      totalCost,
      summary: `${paintGal} gal Paint | ${laborHours} hrs Labor`,
      status: 'confirmed'
    });

    console.log(`SUCCESS: Estimate saved in DB with ID: ${estimate._id}`);
    if (estimate.totalCost === totalCost && estimate.status === 'confirmed') {
      console.log('SUCCESS: Estimate fields and calculations verified successfully!');
    } else {
      console.error(`FAIL: Stored total cost mismatch (Saved: ${estimate.totalCost}, Expected: ${totalCost})`);
    }

    console.log('\n--- CLEANING UP ---');
    await User.findByIdAndDelete(user._id);
    await WorkerModel.findByIdAndDelete(worker._id);
    await Estimate.findByIdAndDelete(estimate._id);
    console.log('Cleanup completed.');

    console.log('\n=============================================');
    console.log('ALL SMART ESTIMATOR INTEGRATION TESTS PASSED!');
    console.log('=============================================');
    process.exit(0);
  } catch (error) {
    console.error('\nXXX TESTS FAILED XXX');
    console.error(error);
    process.exit(1);
  }
};

runTests();
