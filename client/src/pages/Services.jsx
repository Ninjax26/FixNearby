import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔗 URL Synced State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "distance");

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceRange, setPriceRange] = useState([20, 80]);
  const [workers, setWorkers] = useState([]);

  // 🌍 Location
  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

  const categories = [
    "All","Electrician","Plumber","Carpenter","Painter",
    "AC Technician","Cleaner","Mechanic","Gardener",
    "Appliance Repair","Pest Control"
  ];

  const iconMap = {
    Electrician: "⚡", Plumber: "🚰", Carpenter: "🪵", Painter: "🎨",
    "AC Technician": "❄️", Cleaner: "🧹", Mechanic: "🔧",
    Gardener: "🌱", "Appliance Repair": "🔌", "Pest Control": "🐜",
  };

  // 🌍 LOCATION
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationStatus("success");
      },
      () => setLocationStatus("denied")
    );
  }, []);

  // 🔗 Sync URL
  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (categoryFilter !== "All") params.category = categoryFilter;
    if (sortBy !== "distance") params.sort = sortBy;

    setSearchParams(params);
  }, [searchQuery, categoryFilter, sortBy]);

  // 📦 Mock Data
  useEffect(() => {
    setTimeout(() => {
      setWorkers([
        { id: 1, name: "John Doe", profession: "Electrician", rating: 4.8, price: 40, mockOffset: { lat: 0.012, lon: 0.008 } },
        { id: 2, name: "Jane Smith", profession: "Plumber", rating: 4.9, price: 50, mockOffset: { lat: -0.005, lon: 0.02 } },
        { id: 3, name: "Mike Johnson", profession: "Carpenter", rating: 4.5, price: 35, mockOffset: { lat: 0.03, lon: -0.015 } },
        { id: 4, name: "Ravi Kumar", profession: "Painter", rating: 4.6, price: 30, mockOffset: { lat: -0.022, lon: -0.01 } },
        { id: 5, name: "Amit Sharma", profession: "AC Technician", rating: 4.7, price: 45, mockOffset: { lat: 0.008, lon: -0.025 } },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 📍 Distance
  const workersWithDistance = useMemo(() => {
    return workers.map((w) => {
      if (!coords) return { ...w, distanceKm: null };

      const workerLat = coords.latitude + w.mockOffset.lat;
      const workerLon = coords.longitude + w.mockOffset.lon;

      return {
        ...w,
        distanceKm: getDistanceKm(
          coords.latitude,
          coords.longitude,
          workerLat,
          workerLon
        ),
      };
    });
  }, [workers, coords]);

  // 🔍 Filter + Sort
  const filteredWorkers = useMemo(() => {
    let result = workersWithDistance.filter((w) => {
      const q = searchQuery.toLowerCase();
  // Mock worker data
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      try {
        const data = [
          { id: 1, name: "John Doe", profession: "Electrician", rating: 4.8, price: "$40/hr", verified: true },
          { id: 2, name: "Jane Smith", profession: "Plumber", rating: 4.9, price: "$50/hr", verified: true },
          { id: 3, name: "Mike Johnson", profession: "Carpenter", rating: 4.5, price: "$35/hr", verified: true },
          { id: 4, name: "Ravi Kumar", profession: "Painter", rating: 4.6, price: "$30/hr", verified: true },
          { id: 5, name: "Amit Sharma", profession: "AC Technician", rating: 4.7, price: "$45/hr", verified: true },
          { id: 6, name: "Suresh Patel", profession: "Cleaner", rating: 4.3, price: "$25/hr", verified: true },
          { id: 7, name: "David Lee", profession: "Mechanic", rating: 4.8, price: "$55/hr", verified: true },
          { id: 8, name: "Priya Singh", profession: "Gardener", rating: 4.4, price: "$20/hr", verified: true },
          { id: 9, name: "Imran Khan", profession: "Appliance Repair", rating: 4.6, price: "$35/hr", verified: true },
          { id: 10, name: "Neha Gupta", profession: "Pest Control", rating: 4.5, price: "$40/hr", verified: true },
        ];

        setWorkers(data);
        setLoading(false);

      } catch (err) {
        setError("Failed to load workers");
        setLoading(false);
      }
    }, 800);
  }, []);

  // Filter workers
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {

      const query = searchQuery.toLowerCase();

      return (
        (w.name.toLowerCase().includes(q) ||
          w.profession.toLowerCase().includes(q)) &&
        (categoryFilter === "All" || w.profession === categoryFilter)
      );
    });

    if (sortBy === "distance") {
      result.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [workersWithDistance, searchQuery, categoryFilter, sortBy]);
      const matchesCategory =
        categoryFilter === "All" ||
        worker.profession === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [workers, searchQuery, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Find Services Near You</h1>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold">
          Find Reliable Services Near You
        </h1>

        <p className="text-gray-500 mt-2">
          {locationStatus === "success"
            ? "Showing nearby professionals"
            : "Enable location for better results"}
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-6 mb-10">

        {/* Search */}
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-2xl mx-auto block p-3 border rounded-xl"
        />

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white border hover:border-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting */}
        <div className="flex justify-center gap-4">
          {["distance", "rating", "price"].map((type) => (
            <button
              key={type}
              onClick={() => setSortBy(type)}
              className={`px-4 py-2 rounded-lg border ${
                sortBy === type ? "bg-black text-white" : ""
              }`}
            >
              {type === "distance" && "📍 Nearest"}
              {type === "rating" && "⭐ Top Rated"}
              {type === "price" && "💰 Lowest Price"}
      <div className="mb-10 space-y-6">

        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">

          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or service..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600 shadow-sm'
              }`}
            >
              {cat !== "All" && iconMap[cat] && (
                <span className="mr-2">{iconMap[cat]}</span>
              )}

              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (

        <LoadingSpinner />

      ) : error ? (

        <div className="text-center py-20 text-red-600 font-medium">
          {error}
        </div>

      ) : filteredWorkers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">😕</div>
          <p>No workers found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="group bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
            >
              <div className="flex justify-between mb-4">
                <span className="text-3xl">
                  {iconMap[worker.profession]}
                </span>

                {worker.distanceKm && (
                  <span className="text-xs bg-green-100 px-2 py-1 rounded">
                    📍 {formatDistance(worker.distanceKm)}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold">{worker.name}</h3>
              <p className="text-blue-600">{worker.profession}</p>

              <div className="flex justify-between mt-3 text-sm">
                <span>⭐ {worker.rating}</span>
                <span className="font-semibold">${worker.price}/hr</span>
              </div>

              <Link
                to={`/worker/${worker.id}`}
                className="block mt-4 text-center bg-black text-white py-2 rounded-lg hover:bg-blue-600"
              >
                View & Book
              </Link>
            </div>
          ))}

        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">

          <div className="text-6xl mb-4">🔦</div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No workers found
          </h3>

          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Try broadening your filters.
          </p>

          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
            }}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition"
          >
            Reset All Filters
          </button>

        </div>

      ) : (

        <>
          <p className="text-sm text-gray-500 mb-6 font-medium">
            Showing {filteredWorkers.length} professionals found
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredWorkers.map((worker) => (

              <div
                key={worker.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 hover:border-blue-100 transition-all duration-300 overflow-hidden flex flex-col"
              >

                <div className="p-8 flex-1">

                  <div className="flex items-start justify-between mb-6">

                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {iconMap[worker.profession] || '👷'}
                    </div>

                    {worker.verified && (
                      <span className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {worker.name}
                  </h3>

                  <p className="text-blue-600 font-bold mb-4">
                    {worker.profession}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">

                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>

                      <span className="font-bold text-gray-900">
                        {worker.rating}
                      </span>
                    </div>

                    <div className="w-px h-4 bg-gray-300"></div>

                    <div className="font-bold text-gray-900">
                      {worker.price}
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0">

                  <Link
                    to={`/worker/${worker.id}`}
                    className="block w-full text-center bg-gray-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-blue-200"
                  >
                    View Details & Book
                  </Link>

                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Services;