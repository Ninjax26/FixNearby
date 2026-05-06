import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { getDistanceKm, formatDistance } from "../utils/distance";

const Services = () => {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [workers, setWorkers] = useState([]);
  const [error, setError] = useState(null);

  // 🌍 Location state (FIXED)
  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

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

  // 🌍 LOCATION HANDLER
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("loading");

    const timer = setTimeout(() => {
      setLocationStatus("timeout");
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationStatus("success");
      },
      (err) => {
        clearTimeout(timer);
        setLocationStatus(err.code === 1 ? "denied" : "error");
      }
    );
  };

  const renderLocationBanner = () => {
    switch (locationStatus) {
      case "loading":
        return <p className="text-blue-600">📍 Detecting your location...</p>;
      case "success":
        return <p className="text-green-600">📍 Location detected</p>;
      case "denied":
        return <p className="text-red-500">❌ Location access denied</p>;
      case "timeout":
        return <p className="text-yellow-500">⏳ Location request timed out</p>;
      default:
        return null;
    }
  };

  // Mock data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = [
        { id: 1, name: "John Doe", profession: "Electrician", rating: 4.8, price: "$40/hr", verified: true, mockOffset: { lat: 0.012, lon: 0.008 } },
        { id: 2, name: "Jane Smith", profession: "Plumber", rating: 4.9, price: "$50/hr", verified: true, mockOffset: { lat: -0.005, lon: 0.02 } },
        { id: 3, name: "Mike Johnson", profession: "Carpenter", rating: 4.5, price: "$35/hr", verified: true, mockOffset: { lat: 0.03, lon: -0.015 } },
        { id: 4, name: "Ravi Kumar", profession: "Painter", rating: 4.6, price: "$30/hr", verified: true, mockOffset: { lat: -0.022, lon: -0.01 } },
        { id: 5, name: "Amit Sharma", profession: "AC Technician", rating: 4.7, price: "$45/hr", verified: true, mockOffset: { lat: 0.008, lon: -0.025 } },
      ];
      setWorkers(data);
      setLoading(false);
    }, 800);
  }, []);

  // 📍 Distance calculation
  const workersWithDistance = useMemo(() => {
    return workers.map((w) => {
      if (!coords) return { ...w, distanceKm: null };

      const workerLat = coords.latitude + w.mockOffset.lat;
      const workerLon = coords.longitude + w.mockOffset.lon;

      const distanceKm = getDistanceKm(
        coords.latitude,
        coords.longitude,
        workerLat,
        workerLon
      );

      return { ...w, distanceKm };
    });
  }, [workers, coords]);

  // 🔍 Filtering (FIXED)
  const filteredWorkers = useMemo(() => {
    return workersWithDistance.filter((worker) => {
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        worker.name.toLowerCase().includes(query) ||
        worker.profession.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" || worker.profession === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [workersWithDistance, searchQuery, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold">Find Reliable Services Near You</h1>
        <p className="text-gray-500 mt-2">
          Discover top-rated professionals in your neighborhood
        </p>
        <div className="mt-4 text-sm">{renderLocationBanner()}</div>
      </div>

      {/* Filters */}
      <div className="mb-10 space-y-6">
        
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full p-3 border rounded-xl"
          />
        </div>

        {/* Category */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center transition-all
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl scale-105 ring-2 ring-blue-300"
                      : "bg-white text-gray-600 border hover:border-blue-400 hover:text-blue-600"
                  }`}
              >
                {cat}
                {isActive && <span className="ml-2 text-xs">●</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredWorkers.length === 0 ? (
        <p className="text-center">No results found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <div key={worker.id} className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-bold">{worker.name}</h3>
              <p>{worker.profession}</p>
              <p>⭐ {worker.rating}</p>
              <p>{worker.price}</p>

              {worker.distanceKm && (
                <p className="text-sm text-gray-500">
                  📍 {formatDistance(worker.distanceKm)}
                </p>
              )}

              <Link to={`/worker/${worker.id}`} className="text-blue-600">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;