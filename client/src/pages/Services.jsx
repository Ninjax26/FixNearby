import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const mockWorkers = [/* unchanged - keep your full list here */];

const categories = [
  "All",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "AC Technician",
  "Cleaner",
  "Mechanic",
  "Gardener",
  "Appliance Repair",
  "Pest Control",
];

const iconMap = {
  Electrician: "⚡",
  Plumber: "🚰",
  Carpenter: "🪵",
  Painter: "🎨",
  "AC Technician": "❄️",
  Cleaner: "🧹",
  Mechanic: "🔧",
  Gardener: "🌱",
  "Appliance Repair": "🔌",
  "Pest Control": "🐜",
};

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const formatDistance = (d) =>
  d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "All"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "distance");

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  const [recentWorkers, setRecentWorkers] = useState([]);

  /* GEOLOCATION */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => setCoords(null)
    );
  }, []);

  /* LOAD DATA */
  useEffect(() => {
    setTimeout(() => {
      setWorkers(mockWorkers);
      setRecentWorkers(
        JSON.parse(localStorage.getItem("recentWorkers")) || []
      );
      setLoading(false);
    }, 500);
  }, []);

  /* SYNC URL */
  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (categoryFilter !== "All") params.category = categoryFilter;
    if (sortBy !== "distance") params.sort = sortBy;

    setSearchParams(params);
  }, [searchQuery, categoryFilter, sortBy, setSearchParams]);

  /* FILTER + SORT */
  const filteredWorkers = useMemo(() => {
    let result = workers.map((w) => {
      if (!coords) return { ...w, distanceKm: null };

      const lat = coords.latitude + w.mockOffset.lat;
      const lon = coords.longitude + w.mockOffset.lon;

      return {
        ...w,
        distanceKm: getDistanceKm(coords.latitude, coords.longitude, lat, lon),
      };
    });

    result = result.filter((w) => {
      const s = searchQuery.toLowerCase();
      const matchSearch =
        !s ||
        w.name.toLowerCase().includes(s) ||
        w.profession.toLowerCase().includes(s);

      const matchCategory =
        categoryFilter === "All" || w.profession === categoryFilter;

      return matchSearch && matchCategory;
    });

    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price") result.sort((a, b) => a.price - b.price);
    else result.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

    return result;
  }, [workers, searchQuery, categoryFilter, sortBy, coords]);

  const handleRecentlyViewed = (worker) => {
    let stored = JSON.parse(localStorage.getItem("recentWorkers")) || [];
    stored = stored.filter((i) => i.id !== worker.id);
    stored.unshift(worker);
    stored = stored.slice(0, 5);
    localStorage.setItem("recentWorkers", JSON.stringify(stored));
    setRecentWorkers(stored);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">

      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Find Reliable Services Near You
        </h1>
        <p className="mt-2 text-gray-500">
          {coords
            ? "Showing nearby professionals"
            : "Enable location for better results"}
        </p>
      </div>

      {/* SEARCH + SORT */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          className="w-full rounded-xl border px-4 py-3"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="rounded-xl border px-4 py-3"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="distance">Nearest</option>
          <option value="rating">Top Rated</option>
          <option value="price">Lowest Price</option>
        </select>
      </div>

  
     {/* CATEGORY CHIPS */}
<div className="mb-10">
  <div className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
    {categories.map((cat) => {
      const active = categoryFilter === cat;

      return (
        <button
          key={cat}
          onClick={() => setCategoryFilter(cat)}
          className={`group relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300
            ${
              active
                ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            }`}
        >
          <span className="flex items-center gap-2">
            {cat !== "All" && (
              <span className="text-base">
                {iconMap[cat] || "🛠️"}
              </span>
            )}

            {cat}
          </span>

          {active && (
            <span className="absolute inset-0 rounded-full ring-2 ring-blue-200"></span>
          )}
        </button>
      );
    })}
  </div>
</div>

      {/* LOADING */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkers.map((w) => (
            <div
              key={w.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="text-3xl mb-2">
                {iconMap[w.profession] || "👷"}
              </div>

              <h3 className="text-xl font-bold">{w.name}</h3>
              <p className="text-blue-600">{w.profession}</p>

              <div className="mt-2 text-sm text-gray-600">
                ⭐ {w.rating} • ${w.price}/hr
              </div>

              {w.distanceKm !== null && (
                <div className="text-sm text-gray-500">
                  {formatDistance(w.distanceKm)}
                </div>
              )}

              <Link
                to={`/worker/${w.id}`}
                onClick={() => handleRecentlyViewed(w)}
                className="mt-4 block rounded-lg bg-black py-2 text-center text-white"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;