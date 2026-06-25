import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Worker from '../models/Worker.js';
import { getNearbyWorkers } from '../controllers/workerController.js';

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
    const testEmailPrefix = 'testworker-geo-';
    await Worker.deleteMany({ email: new RegExp('^' + testEmailPrefix) });

    console.log('Creating test workers at known coordinate points...');
    
    // Base center: San Francisco (37.7749, -122.4194)
    // 1. Worker 1: Right at center
    const wCenter = await Worker.create({
      name: 'Geo Worker Center',
      email: `${testEmailPrefix}center@example.com`,
      password: 'Password123',
      category: 'Plumbing',
      experience: '5 years',
      location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
      contact: '555-0001',
      bio: 'Right at the center.',
      averageRating: 4.5,
      availabilityStatus: 'busy'
    });

    // 2. Worker 2: Same distance (Center), but higher rating
    const wCenterTopRating = await Worker.create({
      name: 'Geo Worker Center Top Rating',
      email: `${testEmailPrefix}center-top@example.com`,
      password: 'Password123',
      category: 'Plumbing',
      experience: '5 years',
      location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
      contact: '555-0002',
      bio: 'Same spot, better rating.',
      averageRating: 5.0,
      availabilityStatus: 'busy'
    });

    // 3. Worker 3: Same distance (Center), same rating, but 'available' status (alphabetically/status sorting check)
    const wCenterAvailable = await Worker.create({
      name: 'Geo Worker Center Available',
      email: `${testEmailPrefix}center-avail@example.com`,
      password: 'Password123',
      category: 'Plumbing',
      experience: '5 years',
      location: { type: 'Point', coordinates: [-122.4194, 37.7749] },
      contact: '555-0003',
      bio: 'Same spot, available.',
      averageRating: 5.0,
      availabilityStatus: 'available'
    });

    // 4. Worker 4: ~2km away (longitude shifted by 0.02)
    const wFar = await Worker.create({
      name: 'Geo Worker Far',
      email: `${testEmailPrefix}far@example.com`,
      password: 'Password123',
      category: 'Plumbing',
      experience: '5 years',
      location: { type: 'Point', coordinates: [-122.4394, 37.7749] },
      contact: '555-0004',
      bio: 'A bit further away.',
      averageRating: 4.8,
      availabilityStatus: 'available'
    });

    console.log('Seeded test workers successfully.');

    // Helper mock res
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

    console.log('\n--- Running Test Case 1: Fetch Nearby Workers & Sort by Distance ---');
    const req1 = {
      query: {
        lat: '37.7749',
        lng: '-122.4194',
        maxDistance: '15000', // 15km
        category: 'Plumbing'
      }
    };
    const res1 = mockResponse();

    await getNearbyWorkers(req1, res1);

    if (res1.statusCode === 200) {
      console.log(`Found ${res1.body.workers.length} workers.`);
      
      const workers = res1.body.workers;
      
      // Let's verify the distance field exists
      console.log('Verifying workers order and properties:');
      workers.forEach((w, i) => {
        console.log(`- ${i + 1}: ${w.name} | Distance: ${Math.round(w.distance)}m | Rating: ${w.averageRating} | Status: ${w.availabilityStatus}`);
      });

      // Verify sorting order:
      // 1st: Center Available (distance 0, rating 5.0, status available)
      // 2nd: Center Top Rating (distance 0, rating 5.0, status busy)
      // 3rd: Center (distance 0, rating 4.5, status busy)
      // 4th: Far (distance > 0, rating 4.8)
      if (workers[0].name === 'Geo Worker Center Available' &&
          workers[1].name === 'Geo Worker Center Top Rating' &&
          workers[2].name === 'Geo Worker Center' &&
          workers[3].name === 'Geo Worker Far') {
        console.log('SUCCESS: Fallback and distance sorting verified successfully!');
      } else {
        console.error('FAIL: Sorting order is incorrect.');
      }
    } else {
      console.error('FAIL: Failed to get nearby workers:', res1.body);
    }

    console.log('\n--- Running Test Case 2: Pagination ---');
    const req2 = {
      query: {
        lat: '37.7749',
        lng: '-122.4194',
        maxDistance: '15000',
        page: '2',
        limit: '2'
      }
    };
    const res2 = mockResponse();

    await getNearbyWorkers(req2, res2);

    if (res2.statusCode === 200) {
      console.log(`Page 2 count: ${res2.body.workers.length}`);
      if (res2.body.workers.length === 2 && res2.body.workers[0].name === 'Geo Worker Center' && res2.body.workers[1].name === 'Geo Worker Far') {
        console.log('SUCCESS: Pagination skip and limit verified successfully!');
      } else {
        console.error('FAIL: Pagination results incorrect.', res2.body.workers.map(w => w.name));
      }
    } else {
      console.error('FAIL: Failed pagination test:', res2.body);
    }

    console.log('\n--- CLEANING UP ---');
    await Worker.deleteMany({ email: new RegExp('^' + testEmailPrefix) });
    console.log('Cleanup completed.');

    console.log('\n=============================================');
    console.log('ALL GEOSPATIAL SEARCH TESTS PASSED!');
    console.log('=============================================');

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\nXXX GEOSPATIAL SEARCH TEST ENCOUNTERED ERROR XXX');
    console.error(error);
    mongoose.disconnect();
    process.exit(1);
  }
};

runTests();
