/**
 * Middleware to validate GeoJSON coordinates.
 * Coordinates must be in [longitude, latitude] format.
 * Longitude must be between -180 and 180.
 * Latitude must be between -90 and 90.
 */
export const validateGeoCoordinates = (req, res, next) => {
  let location = req.body.location;

  if (!location) {
    return next();
  }

  // Parse if it's a string
  if (typeof location === 'string' && location.startsWith('{')) {
    try {
      location = JSON.parse(location);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Invalid location format JSON"
      });
    }
  }

  if (location && location.type === 'Point' && Array.isArray(location.coordinates)) {
    const [lng, lat] = location.coordinates;
    if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
      return res.status(400).json({
        success: false,
        message: "Coordinates must be numbers"
      });
    }
    if (lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180 degrees"
      });
    }
    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90 degrees"
      });
    }
  }

  next();
};
