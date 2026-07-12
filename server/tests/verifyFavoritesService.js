import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Favorite from '../models/Favorite.js';
import { FavoriteService } from '../services/favoriteService.js';
import dotenv from 'dotenv';

dotenv.config();

async function runTests() {
  console.log("--- STARTING FAVORITES SERVICE TESTS ---");
  await connectDB();

  const userId = new mongoose.Types.ObjectId();
  const workerId = new mongoose.Types.ObjectId();

  try {
    const fav = await FavoriteService.addFavorite(userId, workerId);
    console.log("Favorite entry created:", fav._id);
    if (!fav) throw new Error("Failed to add favorite");

    const list = await FavoriteService.getFavoritesByUser(userId);
    if (list.length !== 1) throw new Error("Favorites list retrieval failed");
    console.log("SUCCESS: Favorite list count verified:", list.length);

    await FavoriteService.removeFavorite(userId, workerId);
    const afterDelete = await Favorite.findOne({ userId, workerId });
    if (afterDelete) throw new Error("Favorite removal failed");
    console.log("SUCCESS: Favorite removed successfully.");
  } finally {
    await Favorite.deleteMany({ userId });
    await mongoose.connection.close();
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error("FAVORITE TESTS FAILED:", err);
  process.exit(1);
});
