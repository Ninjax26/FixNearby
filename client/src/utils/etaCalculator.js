/**
 * estimateArrivalTime
 *
 * Computes an estimated arrival time range for a worker based on
 * the user's geolocation coordinates and the worker's location string.
 *
 * Since workers currently store city-level locations (e.g. "New York, USA")
 * rather than lat/lng, we use a city → coordinate lookup for known demo
 * workers and fall back to a deterministic hash for unknown locations.
 *
 * When real worker coordinates are available from the backend, replace
 * CITY_COORDS with actual worker lat/lng data.
 *
 * Referenced by client/src/utils/mathUtils.js.
 *
 * @param {{ latitude: number, longitude: number } | null} userCoords
 * @param {string} workerLocation  – e.g. "New York, USA"
 * @returns {{ label: string, minMinutes: number, maxMinutes: number }}
 */

/* ── Approximate coordinates for demo worker cities ─────────────── */
const CITY_COORDS = {
  "new york":   { lat: 40.7128, lng: -74.0060 },
  "california": { lat: 36.7783, lng: -119.4179 },
  "texas":      { lat: 31.9686, lng: -99.9018 },
  "florida":    { lat: 27.9944, lng: -81.7603 },
  "seattle":    { lat: 47.6062, lng: -122.3321 },
  "chicago":    { lat: 41.8781, lng: -87.6298 },
  "boston":      { lat: 42.3601, lng: -71.0589 },
  "denver":     { lat: 39.7392, lng: -104.9903 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "san francisco": { lat: 37.7749, lng: -122.4194 },
  "local area": { lat: 0, lng: 0 }, // placeholder for backend workers
};

/**
 * Haversine distance between two points in km.
 */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Deterministic hash for unknown location strings → [0, 1).
 * Used as a fallback to produce a stable but varied ETA.
 */
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h % 1000) / 1000;
}

/**
 * Resolve a location string to approximate coordinates.
 */
function resolveWorkerCoords(workerLocation) {
  const loc = (workerLocation || "").toLowerCase().trim();
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (loc.includes(key)) return coords;
  }
  return null; // no match → will use fallback
}

/**
 * Main ETA calculation.
 *
 * @returns {{ label: string, minMinutes: number, maxMinutes: number }}
 */
export function estimateArrivalTime(userCoords, workerLocation) {
  const workerCoords = resolveWorkerCoords(workerLocation);

  let distanceKm = null;

  if (userCoords && workerCoords && workerCoords.lat !== 0) {
    distanceKm = haversineKm(
      userCoords.latitude,
      userCoords.longitude,
      workerCoords.lat,
      workerCoords.lng
    );
  }

  // If we have a real distance, map km → minutes (avg urban speed ~30 km/h)
  if (distanceKm !== null) {
    const rawMinutes = Math.round((distanceKm / 30) * 60);

    if (rawMinutes <= 15) {
      return { label: "10–20 min", minMinutes: 10, maxMinutes: 20 };
    }
    if (rawMinutes <= 30) {
      return { label: "15–30 min", minMinutes: 15, maxMinutes: 30 };
    }
    if (rawMinutes <= 60) {
      return { label: "30–60 min", minMinutes: 30, maxMinutes: 60 };
    }
    return { label: "60+ min", minMinutes: 60, maxMinutes: 90 };
  }

  // Fallback: deterministic "random" ETA from the worker's location string
  const h = hashString(workerLocation || "unknown");
  if (h < 0.35) {
    return { label: "10–20 min", minMinutes: 10, maxMinutes: 20 };
  }
  if (h < 0.65) {
    return { label: "15–30 min", minMinutes: 15, maxMinutes: 30 };
  }
  if (h < 0.85) {
    return { label: "30–60 min", minMinutes: 30, maxMinutes: 60 };
  }
  return { label: "60+ min", minMinutes: 60, maxMinutes: 90 };
}
