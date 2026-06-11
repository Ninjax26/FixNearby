import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Worker from '../models/Worker.js';
import Issue from '../models/Issue.js';

dotenv.config();

const mockWorkers = [
  {
    name: "John Electrician",
    email: "john@example.com",
    password: "Password123",
    category: "Electrical",
    experience: "5 Years",
    location: "Downtown",
    contact: "555-0199",
    bio: "Certified residential electrician specialising in safety diagnostics."
  },
  {
    name: "Jane Plumber",
    email: "jane@example.com",
    password: "Password123",
    category: "Plumbing",
    experience: "8 Years",
    location: "Uptown",
    contact: "555-0244",
    bio: "Emergency leak repair and pipe installations."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected for seeding...');

    await Worker.deleteMany({});
    console.log('Old workers cleared.');

    for (const w of mockWorkers) {
      await Worker.create(w);
    }
    console.log('Mock workers seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  seedDB();
}
