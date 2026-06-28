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
    location: {
      type: "Point",
      coordinates: [-122.4194, 37.7749] // San Francisco (Downtown)
    },
    averageRating: 4.8,
    contact: "555-0199",
    bio: "Certified residential electrician specialising in safety diagnostics.",
    certifications: [
      "Licensed Residential Electrician",
      "OSHA 10 Safety Certified",
      "Green Energy Installation Specialist"
    ],
    portfolio: [
      {
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop",
        description: "Full panel upgrade & rewiring for a 3-bedroom residence.",
        completionDate: "April 2026",
        customerRating: 5,
        review: "Super professional, cleaned up after finishing."
      },
      {
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
        description: "Industrial generator setup and safety diagnostics.",
        completionDate: "February 2026",
        customerRating: 4.8,
        review: "Excellent response time and clear communication."
      }
    ],
    faqs: [
      {
        question: "Do you offer emergency services?",
        answer: "Yes, I offer 24/7 emergency electrical services."
      },
      {
        question: "Are you insured?",
        answer: "Yes, I am fully licensed and insured up to $2M liability."
      }
    ]
  },
  {
    name: "Jane Plumber",
    email: "jane@example.com",
    password: "Password123",
    category: "Plumbing",
    experience: "8 Years",
    location: {
      type: "Point",
      coordinates: [-122.4224, 37.7799] // Near San Francisco (Uptown)
    },
    averageRating: 4.9,
    contact: "555-0244",
    bio: "Emergency leak repair and pipe installations.",
    certifications: [
      "Master Plumber License #19245",
      "EPA WaterSense Certified Partner",
      "Backflow Prevention Certified"
    ],
    portfolio: [
      {
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=250&fit=crop",
        description: "Complete copper pipe replacement in a heritage home.",
        completionDate: "May 2026",
        customerRating: 5,
        review: "Fixed a leak that three other plumbers failed to locate!"
      }
    ],
    faqs: [
      {
        question: "Do you charge for quotes?",
        answer: "Diagnostic visits are free if we perform the repair."
      },
      {
        question: "Do you offer a warranty on repairs?",
        answer: "Yes, all plumbing labor comes with a 1-year guarantee."
      }
    ]
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
