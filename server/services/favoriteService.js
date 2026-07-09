import Favorite from '../models/Favorite.js';

export class FavoriteService {
  static async addFavorite(userId, workerId) {
    const existing = await Favorite.findOne({ userId, workerId });
    if (existing) return existing;
    return await Favorite.create({ userId, workerId });
  }

  static async removeFavorite(userId, workerId) {
    return await Favorite.findOneAndDelete({ userId, workerId });
  }

  static async getFavoritesByUser(userId) {
    return await Favorite.find({ userId }).populate('workerId');
  }
}
