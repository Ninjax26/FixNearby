import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import useSearch from "../hooks/useSearch";
import { fetchWorkers } from "../services/workerService";
import { getSearchSuggestions } from "../services/searchService";

const mockWorkers = [/* unchanged - keep your full list here */];
const mockWorkers = [
  {
    id: 1,
    name: "John Doe",
    profession: "Electrician",
    rating: 4.8,
    price: 40,
    availability: "Available today",
    responseTime: "Replies in 20 min",
    outcomeText:
      "Open the full profile to compare pricing, reviews, and booking slots.",
    mockOffset: { lat: 17.3850, lon: 78.4867 },
    verified: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    profession: "Plumber",
    rating: 4.9,
    price: 50,
    availability: "Next slot this afternoon",
    responseTime: "Replies in 15 min",
    outcomeText:
      "See availability first, then confirm a plumbing booking in one flow.",
    mockOffset: { lat: 17.4435, lon: 78.3772 },
    verified: true,
  },
  {
    id: 3,
    name: "Mike Johnson",
    profession: "Carpenter",
    rating: 4.5,
    price: 35,
    availability: "Available tomorrow morning",
    responseTime: "Replies in 35 min",
    outcomeText:
      "Review past work and request a carpentry visit from the profile page.",
    mockOffset: { lat: 17.4399, lon: 78.4983 },
    verified: true,
  },
  {
    id: 4,
    name: "Ravi Kumar",
    profession: "Painter",
    rating: 4.6,
    price: 30,
    availability: "Next slot tomorrow",
    responseTime: "Replies in 25 min",
    outcomeText: "Check service details and move straight into booking when ready.",
    mockOffset: { lat: 17.4483, lon: 78.3915 },
    verified: true,
  },
  {
    id: 5,
    name: "Amit Sharma",
    profession: "AC Technician",
    rating: 4.7,
    price: 45,
    availability: "Emergency slots open",
    responseTime: "Replies in 10 min",
    outcomeText: "View service scope, urgency fit, and book an AC repair visit quickly.",
    mockOffset: { lat: 17.4126, lon: 78.4052 },
    verified: true,
  },
  {
    id: 6,
    name: "Suresh Patel",
    profession: "Cleaner",
    rating: 4.3,
    price: 25,
    availability: "Weekend availability",
    responseTime: "Replies in 30 min",
    outcomeText:
      "Open the profile to compare rates and schedule a cleaning appointment.",
    mockOffset: { lat: 17.3616, lon: 78.4747 },
    verified: true,
  },
  {
    id: 7,
    name: "David Lee",
    profession: "Mechanic",
    rating: 4.8,
    price: 55,
    availability: "Available this evening",
    responseTime: "Replies in 20 min",
    outcomeText:
      "See diagnostic pricing and book a mechanic visit with clearer expectations.",
    mockOffset: { lat: 17.4948, lon: 78.3996 },
    verified: true,
  },
  {
    id: 8,
    name: "Priya Singh",
    profession: "Gardener",
    rating: 4.4,
    price: 20,
    availability: "Morning slots open",
    responseTime: "Replies in 40 min",
    outcomeText:
      "Review service options and book a gardener for regular or one-time visits.",
    mockOffset: { lat: 17.4239, lon: 78.4738 },
    verified: true,
  },
  {
    id: 9,
    name: "Imran Khan",
    profession: "Appliance Repair",
    rating: 4.6,
    price: 35,
    availability: "Next slot tomorrow",
    responseTime: "Replies in 25 min",
    outcomeText:
      "Open the profile to check appliance support and request a repair appointment.",
    mockOffset: { lat: 17.3724, lon: 78.4378 },
    verified: true,
  },
  {
    id: 10,
    name: "Neha Gupta",
    profession: "Pest Control",
    rating: 4.5,
    price: 40,
    availability: "Inspection slots open",
    responseTime: "Replies in 15 min",
    outcomeText:
      "View treatment details and book an inspection without leaving the flow.",
    mockOffset: { lat: 17.4065, lon: 78.4772 },
    verified: true,
  },
];

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
  const [urgentFilter, setUrgentFilter] = useState(
    searchParams.get("urgent") === "true",
  );

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  const [recentWorkers, setRecentWorkers] = useState([]);

  /* GEOLOCATION */
  // Advanced search features
  const {
    searchHistory,
    addToHistory,
    clearHistory,
    removeHistoryItem,
    favoriteSearches,
    saveFavoriteSearch,
    removeFavoriteSearch,
    loadFavoriteSearch,
    getShareableUrl,
  } = useSearch({
    category: categoryFilter,
    minPrice: 0,
    maxPrice: 100,
    minRating: 0,
    maxDistance: 50,
    availability: 'all',
    sortBy: sortBy,
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    minPrice: 0,
    maxPrice: 100,
    minRating: 0,
    maxDistance: 50,
    availability: 'all',
  });

  // GEOLOCATION
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
    const loadData = async () => {
      setLoading(true);
      try {
        const backendWorkers = await fetchWorkers();
        // Merge backend workers and mock workers, preventing duplicate IDs
        if (backendWorkers && backendWorkers.length > 0) {
          const merged = new Map();
          mockWorkers.forEach(w => merged.set(w.id, w));
          backendWorkers.forEach(w => merged.set(w.id, w));
          setWorkers(Array.from(merged.values()));
        } else {
          setWorkers(mockWorkers);
        }
      } catch (err) {
        console.error("Failed to fetch workers, falling back to mock data", err);
        setWorkers(mockWorkers);
      } finally {
        const storedRecent =
          JSON.parse(localStorage.getItem("recentWorkers")) || [];
        setRecentWorkers(storedRecent);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // SYNC URL PARAMS TO STATE
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "All";
    const urlUrgent = searchParams.get("urgent") === "true";
    const urlSearch = searchParams.get("search") || "";
    const urlSort = searchParams.get("sort") || "distance";

    if (urlCategory !== categoryFilter) setCategoryFilter(urlCategory);
    if (urlUrgent !== urgentFilter) setUrgentFilter(urlUrgent);
    if (urlSearch !== searchQuery) setSearchQuery(urlSearch);
    if (urlSort !== sortBy) setSortBy(urlSort);
  }, [searchParams]);

  // SYNC STATE TO URL PARAMS
  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (categoryFilter !== "All") params.category = categoryFilter;
    if (sortBy !== "distance") params.sort = sortBy;

    setSearchParams(params);
  }, [searchQuery, categoryFilter, sortBy, setSearchParams]);
    if (urgentFilter) params.urgent = "true";
    setSearchParams(params);
  }, [categoryFilter, searchQuery, setSearchParams, sortBy, urgentFilter]);

  /* FILTER + SORT */
  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestionsData = async () => {
      if (searchQuery.length >= 2) {
        try {
          const results = await getSearchSuggestions(searchQuery);
          setSuggestions(results.map(r => r.value));
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
    
    fetchSuggestionsData();
  }, [searchQuery]);

  /* FILTER + SORT */
  const filteredWorkers = useMemo(() => {
    let result = workers.map((w) => {
      if (!coords) return { ...w, distanceKm: null };

      const lat = coords.latitude + w.mockOffset.lat;
      const lon = coords.longitude + w.mockOffset.lon;

    let result = workers.map((worker) => {
      if (!coords) return { ...worker, distanceKm: null };
      const workerLat = worker.mockOffset.lat;
      const workerLon = worker.mockOffset.lon;
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
    result = result.filter((worker) => {
      const search = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !search ||
        worker.name.toLowerCase().includes(search) ||
        worker.profession.toLowerCase().includes(search);
      const matchesCategory =
        categoryFilter === "All" || worker.profession === categoryFilter;
      
      let matchesUrgent = true;
      if (urgentFilter) {
        const avail = (worker.availability || "").toLowerCase();
        matchesUrgent =
          avail.includes("available today") ||
          avail.includes("emergency slots open") ||
          avail.includes("available this evening") ||
          avail.includes("next slot this afternoon") ||
          avail === "available";
      }

      // Advanced filters
      const matchesPrice = worker.price >= advancedFilters.minPrice && worker.price <= advancedFilters.maxPrice;
      const matchesRating = advancedFilters.minRating === 0 || worker.rating >= advancedFilters.minRating;
      const matchesDistance = !advancedFilters.maxDistance || !worker.distanceKm || worker.distanceKm <= advancedFilters.maxDistance;
      
      let matchesAvailability = true;
      if (advancedFilters.availability !== 'all') {
        const avail = (worker.availability || "").toLowerCase();
        matchesAvailability = avail.includes('available');
      }

      return matchesSearch && matchesCategory && matchesUrgent && matchesPrice && matchesRating && matchesDistance && matchesAvailability;
    });

    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price") result.sort((a, b) => a.price - b.price);
    else result.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

    return result;
  }, [workers, searchQuery, categoryFilter, sortBy, coords]);
  }, [categoryFilter, coords, searchQuery, sortBy, urgentFilter, workers, advancedFilters]);

  const handleRecentlyViewed = (worker) => {
    let stored = JSON.parse(localStorage.getItem("recentWorkers")) || [];
    stored = stored.filter((i) => i.id !== worker.id);
    stored.unshift(worker);
    stored = stored.slice(0, 5);
    localStorage.setItem("recentWorkers", JSON.stringify(stored));
    setRecentWorkers(stored);
  };

  const handleSearch = (query) => {
    addToHistory(query, { category: categoryFilter, ...advancedFilters });
  };

  const handleSaveFavorite = (name) => {
    const success = saveFavoriteSearch(name, searchQuery, { category: categoryFilter, ...advancedFilters });
    if (success) {
      alert('Search saved to favorites!');
    }
  };

  const handleShareSearch = () => {
    const url = getShareableUrl();
    navigator.clipboard.writeText(url).then(() => {
      alert('Search URL copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy URL:', err);
    });
  };

  const handleFilterChange = (key, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setSortBy("distance");
    setUrgentFilter(false);
    setAdvancedFilters({
      minPrice: 0,
      maxPrice: 100,
      minRating: 0,
      maxDistance: 50,
      availability: 'all',
    });
  };

  const hasActiveFilters = 
    advancedFilters.minPrice > 0 ||
    advancedFilters.maxPrice < 100 ||
    advancedFilters.minRating > 0 ||
    (advancedFilters.maxDistance && advancedFilters.maxDistance < 50) ||
    advancedFilters.availability !== 'all';

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
      {/* FILTERS */}
      <div className="mb-10 space-y-6">
        {/* SearchBar with Autocomplete */}
        <div className="mx-auto max-w-3xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            searchHistory={searchHistory}
            favoriteSearches={favoriteSearches}
            onRemoveHistory={removeHistoryItem}
            onClearHistory={clearHistory}
            onLoadFavorite={loadFavoriteSearch}
            onSaveFavorite={handleSaveFavorite}
            onShare={handleShareSearch}
            suggestions={suggestions}
            placeholder="Search for services, workers, or categories..."
          />
        </div>

        <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="distance">📍 Nearest</option>
            <option value="rating">⭐ Top Rated</option>
            <option value="price">💰 Lowest Price</option>
          </select>
          <button
            type="button"
            onClick={() => setUrgentFilter((prev) => !prev)}
            className={`rounded-xl border px-5 py-3 font-bold shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              urgentFilter
                ? "border-red-600 bg-red-600 text-white shadow-md hover:bg-red-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            <span className={urgentFilter ? "animate-pulse" : ""}>🚨</span>
            <span>Urgent Only</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 lg:hidden"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Advanced Filters</span>
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                Active
              </span>
            )}
          </button>
        </div>

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
      {/* CATEGORY CHIPS (FULL FIX) */}
      <div className="mb-10">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap px-1 py-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 active:scale-95
                ${
                  categoryFilter === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border text-gray-600 hover:border-blue-400 hover:text-blue-600"
                }`}
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
      {/* URGENT ACTIVE BANNER */}
      {urgentFilter && (
        <div className="mx-auto max-w-3xl mb-10 rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm animate-pulse">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl">🚨</span>
              <div>
                <h3 className="font-bold text-red-800">SOS Emergency Mode Active</h3>
                <p className="text-sm text-red-600">
                  Filtering for service providers with immediate availability today or emergency slots open.
                </p>
              </div>
            </div>
            <button
              onClick={() => setUrgentFilter(false)}
              className="w-full sm:w-auto rounded-xl bg-red-100 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-200 transition-all duration-200"
            >
              Show All
            </button>
          </div>
        </div>
      )}

      {/* RECENTLY VIEWED */}
      {recentWorkers.length > 0 && (
        <div className="mb-14">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <h2 className="text-2xl font-bold text-gray-900">
              Recently Viewed Professionals
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentWorkers.map((worker) => (
              <div
                key={worker.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">
                  {iconMap[worker.profession] || "👷"}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {worker.name}
                </h3>
                <p className="mb-3 font-medium text-blue-600">
                  {worker.profession}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>⭐ {worker.rating}</span>
                  <span>${worker.price}/hr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div className="flex gap-8">
        {/* FILTER SIDEBAR */}
        <FilterSidebar
          filters={{
            category: categoryFilter,
            ...advancedFilters,
            sortBy: sortBy,
          }}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          categories={categories}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          className="hidden lg:block"
        />

        {/* MAIN CONTENT */}
        <div className="flex-1">
          {/* WORKER CARDS */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredWorkers.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
              <h3 className="text-2xl font-bold text-gray-900">No services found</h3>
              <p className="mx-auto mt-2 max-w-md text-gray-500">
                Try a broader search or reset the selected category.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm font-medium text-gray-500">
                Showing {filteredWorkers.length} services
              </p>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-blue-100 hover:shadow-2xl"
                  >
                    <div className="flex-1 p-8">
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
                          {iconMap[worker.profession] || "👷"}
                        </div>
                        {worker.verified && (
                          <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                            Verified
                          </span>
                        )}
                      </div>

                      <h3 className="mb-1 text-2xl font-bold text-gray-900">
                        {worker.name}
                      </h3>
                      <p className="mb-4 font-bold text-blue-600">
                        {worker.profession}
                      </p>

                      <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                          {worker.availability}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                          {worker.responseTime}
                        </span>
                      </div>

                      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        <span className="font-bold text-gray-900">
                          Rating {worker.rating}
                        </span>
                        <span className="font-bold text-gray-900">
                          ${worker.price}/hr
                        </span>
                        {worker.distanceKm !== null && (
                          <span className="font-bold text-gray-900">
                            {formatDistance(worker.distanceKm)}
                          </span>
                        )}
                      </div>

                      <p className="text-sm leading-6 text-slate-600">
                        {worker.outcomeText}
                      </p>
                    </div>

                    <div className="p-8 pt-0 space-y-3">
                        <a
                          title="Get Directions"
                        href={`https://www.google.com/maps?q=${worker.mockOffset.lat},${worker.mockOffset.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full rounded-xl border border-blue-600 bg-white py-4 text-center font-bold text-blue-600 transition hover:bg-blue-50"
                        >
                          📍 Open in Google Maps
                        </a>

                        <Link
                          to={`/worker/${worker.id}`}
                          onClick={() => handleRecentlyViewed(worker)}
                          className="block w-full rounded-xl bg-slate-900 py-4 text-center font-bold text-white transition hover:bg-blue-600"
                        >
                          View Profile and Book
                        </Link>
                      </div>
                  </div>
                ))}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;