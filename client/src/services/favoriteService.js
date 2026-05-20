// client/src/services/favoriteService.js

import axios from "axios";

const BASE_URL = "/api/favorites";

// Helper: get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User not authenticated");
  return { Authorization: `Bearer ${token}` };
};

/**
 * Add a worker to favorites
 * @param {string} workerId
 */
export const addFavorite = async (workerId) => {
  const response = await axios.post(
    `${BASE_URL}/${workerId}`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Remove a worker from favorites
 * @param {string} workerId
 */
export const removeFavorite = async (workerId) => {
  const response = await axios.delete(`${BASE_URL}/${workerId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Toggle bookmark — adds if not bookmarked, removes if bookmarked
 * @param {string} workerId
 * @param {boolean} isCurrentlyBookmarked
 */
export const toggleFavorite = async (workerId, isCurrentlyBookmarked) => {
  if (isCurrentlyBookmarked) {
    return await removeFavorite(workerId);
  } else {
    return await addFavorite(workerId);
  }
};

/**
 * Fetch all saved/favorite workers for logged-in user
 */
export const getFavorites = async () => {
  const response = await axios.get(BASE_URL, {
    headers: getAuthHeaders(),
  });
  return response.data; // Array of { _id, worker: {...}, createdAt }
};

/**
 * Check if a specific worker is bookmarked
 * @param {string} workerId
 */
export const isFavorited = async (workerId) => {
  const favorites = await getFavorites();
  return favorites.some((fav) => fav.worker._id === workerId);
};