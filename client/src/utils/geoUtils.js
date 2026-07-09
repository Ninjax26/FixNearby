/**
 * Client-side helper functions for geospatial verification.
 */

/**
 * Validates if coordinates are in correct bounds.
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @returns {boolean}
 */
export const isValidCoordinates = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
};

/**
 * Checks if the coordinates are within a specified distance (in km) from a center.
 * Default centers could be the operating bounds.
 */
export const isWithinOperationalBounds = (lat, lng, centerLat = 0, centerLng = 0, maxKm = 10000) => {
  if (!isValidCoordinates(lat, lng)) return false;
  
  const R = 6371; // Earth's radius in km
  const dLat = ((lat - centerLat) * Math.PI) / 180;
  const dLng = ((lng - centerLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((centerLat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance <= maxKm;
};
