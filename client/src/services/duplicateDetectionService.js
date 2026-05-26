import { getDistanceKm } from '../utils/distance';
import { getNearbyIssues } from './issueService';
import { getNearbyFromCache } from './issuesCache';

/**
 * Check if a new issue is a duplicate of existing nearby issues
 * @param {Object} issueData - The new issue data
 * @param {number} issueData.latitude - Issue latitude
 * @param {number} issueData.longitude - Issue longitude
 * @param {string} issueData.category - Issue category (e.g., "Traffic Light", "Pothole")
 * @param {number} [radiusMeters=50] - Search radius in meters
 * @returns {Promise<Object>} - { isDuplicate, duplicateIssue, distance }
 */
export async function checkForDuplicates(issueData, radiusMeters = 50) {
  // Validate input parameters
  if (
    typeof issueData.latitude !== 'number' ||
    issueData.latitude < -90 ||
    issueData.latitude > 90
  ) {
    console.error('Invalid latitude:', issueData.latitude);
    return { isDuplicate: false, duplicateIssue: null, distance: null };
  }

  if (
    typeof issueData.longitude !== 'number' ||
    issueData.longitude < -180 ||
    issueData.longitude > 180
  ) {
    console.error('Invalid longitude:', issueData.longitude);
    return { isDuplicate: false, duplicateIssue: null, distance: null };
  }

  if (!issueData.category || issueData.category.length === 0) {
    console.error('Invalid category:', issueData.category);
    return { isDuplicate: false, duplicateIssue: null, distance: null };
  }

  if (radiusMeters <= 0) {
    console.error('Invalid radius:', radiusMeters);
    return { isDuplicate: false, duplicateIssue: null, distance: null };
  }

  // Convert radius from meters to kilometers for API query
  const radiusKm = radiusMeters / 1000;

  try {
    // First consult in-memory cache (zero-dependency, local check)
    const cachedNearby = getNearbyFromCache({
      latitude: issueData.latitude,
      longitude: issueData.longitude,
      category: issueData.category,
      radiusMeters
    });

    if (cachedNearby && cachedNearby.length > 0) {
      const duplicateCandidate = findClosestMatch(
        issueData,
        cachedNearby,
        radiusMeters
      );

      if (duplicateCandidate !== null) {
        return {
          isDuplicate: true,
          duplicateIssue: duplicateCandidate.issue,
          distance: duplicateCandidate.distance
        };
      }
      // If cache had nearby results but none within threshold, fall through to API as a fallback
    }

    // Fetch nearby issues from API if cache miss or no close match
    const nearbyIssues = await getNearbyIssues({
      latitude: issueData.latitude,
      longitude: issueData.longitude,
      category: issueData.category,
      radiusKm: radiusKm
    });

    // Filter issues by precise Haversine distance
    const duplicateCandidate = findClosestMatch(
      issueData,
      nearbyIssues,
      radiusMeters
    );

    // Return result
    if (duplicateCandidate !== null) {
      return {
        isDuplicate: true,
        duplicateIssue: duplicateCandidate.issue,
        distance: duplicateCandidate.distance
      };
    } else {
      return {
        isDuplicate: false,
        duplicateIssue: null,
        distance: null
      };
    }
  } catch (error) {
    // Log error and return no duplicate found (fail-safe behavior)
    console.error('Error fetching nearby issues:', error);
    return { isDuplicate: false, duplicateIssue: null, distance: null };
  }
}

/**
 * Find the closest matching issue from a list of nearby issues
 * @param {Object} newIssue - The new issue with lat/lng
 * @param {number} newIssue.latitude - New issue latitude
 * @param {number} newIssue.longitude - New issue longitude
 * @param {Array<Object>} nearbyIssues - Array of nearby issues
 * @param {number} maxDistanceMeters - Maximum distance threshold
 * @returns {Object|null} - { issue, distance } or null
 */
export function findClosestMatch(newIssue, nearbyIssues, maxDistanceMeters) {
  if (!Array.isArray(nearbyIssues) || nearbyIssues.length === 0) {
    return null;
  }

  let closestMatch = null;
  let minDistance = Infinity;

  for (const issue of nearbyIssues) {
    // Calculate Haversine distance in kilometers
    const distanceKm = getDistanceKm(
      newIssue.latitude,
      newIssue.longitude,
      issue.latitude,
      issue.longitude
    );

    // Convert to meters
    const distanceMeters = distanceKm * 1000;

    // Check if this issue is closer and within threshold
    if (distanceMeters < minDistance && distanceMeters <= maxDistanceMeters) {
      closestMatch = issue;
      minDistance = distanceMeters;
    }
  }

  if (closestMatch !== null) {
    return {
      issue: closestMatch,
      distance: minDistance
    };
  } else {
    return null;
  }
}

/**
 * Return nearby candidate issues (from cache first, then API) without picking a single match
 * @param {Object} issueData
 * @param {number} issueData.latitude
 * @param {number} issueData.longitude
 * @param {string} issueData.category
 * @param {number} [radiusMeters=50]
 * @returns {Promise<Array<Object>>}
 */
export async function getNearbyCandidates(issueData, radiusMeters = 50) {
  const radiusKm = radiusMeters / 1000;

  // Try cache first
  const cached = getNearbyFromCache({
    latitude: issueData.latitude,
    longitude: issueData.longitude,
    category: issueData.category,
    radiusMeters
  });

  if (cached && cached.length > 0) return cached;

  // Fallback to API
  try {
    const nearby = await getNearbyIssues({
      latitude: issueData.latitude,
      longitude: issueData.longitude,
      category: issueData.category,
      radiusKm
    });
    return Array.isArray(nearby) ? nearby : [];
  } catch (err) {
    console.error('Error in getNearbyCandidates:', err);
    return [];
  }
}
