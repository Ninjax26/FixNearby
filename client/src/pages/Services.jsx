import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, Share2 } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import useSearch from "../hooks/useSearch";
import { fetchWorkers } from "../services/workerService";
import { getSearchSuggestions } from "../services/searchService";

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
    mockOffset: { lat: 0.012, lon: 0.008 },
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
    mockOffset: { lat: -0.005, lon: 0.02 },
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
    mockOffset: { lat: 0.03, lon: -0.015 },
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
    mockOffset: { lat: -0.022, lon: -0.01 },
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
    mockOffset: { lat: 0.008, lon: -0.025 },
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
    mockOffset: { lat: 0.05, lon: 0.03 },
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
    mockOffset: { lat: -0.04, lon: 0.015 },
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
    mockOffset: { lat: 0.003, lon: 0.004 },
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
    mockOffset: { lat: -0.018, lon: -0.03 },
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
    mockOffset: { lat: 0.025, lon: -0.005 },
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
  const radiusKm = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return radiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const formatDistance = (distance) => {
  if (distance < 1) return `${Math.round(distance * 1000)} m`;
  return `${distance.toFixed(1)} km`;
};

const Services = () => {
  // Use the custom search hook
  const {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
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
    category: 'All',
    minPrice: 0,
    maxPrice: 100,
    minRating: 0,
    maxDistance: 50,
    availability: 'all',
    sortBy: 'distance',
  });

  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [recentWorkers, setRecentWorkers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

  // GEOLOCATION
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("success");
      },
      () => {
        setLocationStatus("denied");
      },
    );
  }, []);

  // LOAD WORKERS
  useEffect(() => {
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

  // SYNC URL PARAMS - Removed, now handled by useSearch hook

  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        try {
          const results = await getSearchSuggestions(searchQuery);
          setSuggestions(results.map(r => r.value));
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };
    
    fetchSuggestions();
  }, [searchQuery]);

  // FILTER + SORT
  const filteredWorkers = useMemo(() => {
    let result = workers.map((worker) => {
      if (!coords) return { ...worker, distanceKm: null };
      const workerLat = coords.latitude + worker.mockOffset.lat;
      const workerLon = coords.longitude + worker.mockOffset.lon;
      return {
        ...worker,
        distanceKm: getDistanceKm(
          coords.latitude,
          coords.longitude,
          workerLat,
          workerLon,
        ),
      };
    });

    // Search filter
    result = result.filter((worker) => {
      const search = debouncedQuery.trim().toLowerCase();
      const matchesSearch =
        !search ||
        worker.name.toLowerCase().includes(search) ||
        worker.profession.toLowerCase().includes(search);
      return matchesSearch;
    });

    // Category filter
    if (filters.category !== "All") {
      result = result.filter(worker => worker.profession === filters.category);
    }

    // Price filter
    if (filters.minPrice || filters.maxPrice) {
      result = result.filter(
        worker => worker.price >= filters.minPrice && worker.price <= filters.maxPrice
      );
    }

    // Rating filter
    if (filters.minRating) {
      result = result.filter(worker => worker.rating >= filters.minRating);
    }

    // Distance filter
    if (filters.maxDistance && coords) {
      result = result.filter(
        worker => worker.distanceKm === null || worker.distanceKm <= filters.maxDistance
      );
    }

    // Availability filter
    if (filters.availability !== 'all') {
      // This is a simplified filter - in production, match against actual availability data
      result = result.filter(worker => {
        if (filters.availability === 'available') {
          return worker.availability?.toLowerCase().includes('available');
        }
        return true;
      });
    }

    // Sorting
    if (filters.sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    } else {
      result.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    }

    return result;
  }, [coords, debouncedQuery, filters, workers]);

  const handleRecentlyViewed = (worker) => {
    let stored = JSON.parse(localStorage.getItem("recentWorkers")) || [];
    stored = stored.filter((item) => item.id !== worker.id);
    stored.unshift(worker);
    stored = stored.slice(0, 5);
    localStorage.setItem("recentWorkers", JSON.stringify(stored));
    setRecentWorkers(stored);
  };

  const handleSearch = (query) => {
    addToHistory(query, filters);
  };

  const handleSaveFavorite = (name) => {
    const success = saveFavoriteSearch(name, searchQuery, filters);
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

  const handleResetFilters = () => {
    resetFilters();
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Find Reliable Services Near You
        </h1>
        <p className="mt-2 text-gray-500">
          {locationStatus === "success"
            ? "Showing nearby professionals"
            : locationStatus === "loading"
              ? "Detecting your location..."
              : "Enable location for better distance results"}
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6">
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

      {/* FILTER TOGGLE BUTTON (Mobile) */}
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters
          {hasActiveFilters && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
              Active
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Reset All
          </button>
        )}
      </div>

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div className="flex gap-8">
        {/* FILTER SIDEBAR */}
        <FilterSidebar
          filters={filters}
          onFilterChange={updateFilter}
          onReset={handleResetFilters}
          categories={categories}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          className="hidden lg:block"
        />

        {/* MAIN CONTENT */}
        <div className="flex-1">
          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-900">Active Filters:</span>
                  <div className="flex flex-wrap gap-2">
                    {filters.category !== 'All' && (
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                        {filters.category}
                      </span>
                    )}
                    {(filters.minPrice > 0 || filters.maxPrice < 100) && (
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                        ${filters.minPrice}-${filters.maxPrice}
                      </span>
                    )}
                    {filters.minRating > 0 && (
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                        {filters.minRating}+ ⭐
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Clear
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

          {/* WORKER CARDS */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredWorkers.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
              <h3 className="text-2xl font-bold text-gray-900">No services found</h3>
              <p className="mx-auto mt-2 max-w-md text-gray-500">
                Try a broader search or reset the selected filters.
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

                    <div className="p-8 pt-0">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;