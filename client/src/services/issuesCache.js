import { getDistanceKm } from '../utils/distance';

// Simple in-memory cache for issues. Consumers may populate this from initial API loads.
let issuesCache = [];

/**
 * Replace the entire cache with a new array of issues
 * @param {Array<Object>} issues
 */
export function setIssuesCache(issues) {
  if (!Array.isArray(issues)) return;
  issuesCache = issues.slice();
}

/**
 * Clear the in-memory cache
 */
export function clearIssuesCache() {
  issuesCache = [];
}

/**
 * Get nearby unresolved issues from cache matching category and within radius
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} category
 * @param {number} radiusMeters
 * @returns {Array<Object>}
 */
export function getNearbyFromCache({ latitude, longitude, category, radiusMeters = 50 }) {
  if (!issuesCache || issuesCache.length === 0) return [];

  const resolvedStatuses = new Set(['resolved', 'closed']);

  const result = [];

  for (const issue of issuesCache) {
    if (!issue || typeof issue.latitude !== 'number' || typeof issue.longitude !== 'number') continue;
    if (!issue.category || issue.category !== category) continue;
    if (issue.status && resolvedStatuses.has(issue.status.toLowerCase())) continue;

    const dKm = getDistanceKm(latitude, longitude, issue.latitude, issue.longitude);
    const dMeters = dKm * 1000;
    if (dMeters <= radiusMeters) {
      result.push(issue);
    }
  }

  return result;
}

/**
 * Return full cache (read-only copy)
 */
export function getAllCachedIssues() {
  return issuesCache.slice();
}
