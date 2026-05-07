import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

// Helpers (replace with your utils if already exist)
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

const formatDistance = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "All"
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "distance"
  );

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

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

  /* ---------------- LOCATION ---------------- */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  }, []);

  /* ---------------- DATA ---------------- */
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setWorkers([
        { id: 1, name: "John Doe", profession: "Electrician", rating: 4.8, price: 40 },
        { id: 2, name: "Jane Smith", profession: "Plumber", rating: 4.9, price: 50 },
        { id: 3, name: "Mike Johnson", profession: "Carpenter", rating: 4.5, price: 35 },
        { id: 4, name: "Ravi Kumar", profession: "Painter", rating: 4.6, price: 30 },
        { id: 5, name: "Amit Sharma", profession: "AC Technician", rating: 4.7, price: 45 },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  /* ---------------- URL SYNC ---------------- */
  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (categoryFilter !== "All") params.category = categoryFilter;
    if (sortBy !== "distance") params.sort = sortBy;

    setSearchParams(params);
  }, [searchQuery, categoryFilter, sortBy]);

  /* ---------------- PROCESS WORKERS ---------------- */
  const processedWorkers = useMemo(() => {
    let result = workers.map((w) => {
      let distance = null;

      if (coords) {
        distance = getDistanceKm(
          coords.latitude,
          coords.longitude,
          coords.latitude + Math.random() * 0.05,
          coords.longitude + Math.random() * 0.05
        );
      }

      return { ...w, distanceKm: distance };
    });

    // SEARCH
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.profession.toLowerCase().includes(q)
      );
    }

    // CATEGORY
    if (categoryFilter !== "All") {
      result = result.filter((w) => w.profession === categoryFilter);
    }

    // SORT
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    } else {
      result.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    }

    return result;
  }, [workers, searchQuery, categoryFilter, sortBy, coords]);

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900">
          Find Skilled Professionals
        </h1>
        <p className="text-slate-600 mt-2">
          Search, compare and book trusted workers near you
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search electricians, plumbers..."
          className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border rounded-xl"
        >
          <option value="distance">Nearest</option>
          <option value="rating">Top Rated</option>
          <option value="price">Lowest Price</option>
        </select>

      </div>

      {/* CATEGORIES */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm border ${
              categoryFilter === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            {iconMap[cat] && <span className="mr-1">{iconMap[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <LoadingSpinner />
      ) : processedWorkers.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          No workers found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {processedWorkers.map((w) => (
            <div
              key={w.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition"
            >

              <div className="text-3xl mb-3">
                {iconMap[w.profession]}
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {w.name}
              </h3>

              <p className="text-blue-600 font-medium">
                {w.profession}
              </p>

              <div className="flex justify-between mt-3 text-sm text-slate-600">
                <span>⭐ {w.rating}</span>
                <span className="font-semibold">${w.price}/hr</span>
              </div>

              {w.distanceKm && (
                <p className="text-xs text-emerald-600 mt-2">
                  📍 {formatDistance(w.distanceKm)}
                </p>
              )}

              <Link
                to={`/worker/${w.id}`}
                className="block mt-4 text-center bg-slate-900 text-white py-2 rounded-xl hover:bg-blue-600"
              >
                View & Book
              </Link>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Services;
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
  const [error, setError] = useState(null);
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

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (dist) => {
    if (dist < 1) return `${(dist * 1000).toFixed(0)}m`;
    return `${dist.toFixed(1)}km`;
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
    setLoading(true);
    setTimeout(() => {
      setWorkers([
        { id: 1, name: "John Doe", profession: "Electrician", rating: 4.8, price: 40, mockOffset: { lat: 0.012, lon: 0.008 }, verified: true },
        { id: 2, name: "Jane Smith", profession: "Plumber", rating: 4.9, price: 50, mockOffset: { lat: -0.005, lon: 0.02 }, verified: true },
        { id: 3, name: "Mike Johnson", profession: "Carpenter", rating: 4.5, price: 35, mockOffset: { lat: 0.03, lon: -0.015 }, verified: true },
        { id: 4, name: "Ravi Kumar", profession: "Painter", rating: 4.6, price: 30, mockOffset: { lat: -0.022, lon: -0.01 }, verified: true },
        { id: 5, name: "Amit Sharma", profession: "AC Technician", rating: 4.7, price: 45, mockOffset: { lat: 0.008, lon: -0.025 }, verified: true },
        { id: 6, name: "Suresh Patel", profession: "Cleaner", rating: 4.3, price: 25, mockOffset: { lat: 0.050, lon: 0.030 }, verified: true },
        { id: 7, name: "David Lee", profession: "Mechanic", rating: 4.8, price: 55, mockOffset: { lat: -0.040, lon: 0.015 }, verified: true },
        { id: 8, name: "Priya Singh", profession: "Gardener", rating: 4.4, price: 20, mockOffset: { lat: 0.003, lon: 0.004 }, verified: true },
        { id: 9, name: "Imran Khan", profession: "Appliance Repair", rating: 4.6, price: 35, mockOffset: { lat: -0.018, lon: -0.030 }, verified: true },
        { id: 10, name: "Neha Gupta", profession: "Pest Control", rating: 4.5, price: 40, mockOffset: { lat: 0.025, lon: -0.005 }, verified: true },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // 🔍 Filter + Sort
  const filteredWorkers = useMemo(() => {
    let result = workers.map((w) => {
      if (!coords) return { ...w, distanceKm: null };
      const workerLat = coords.latitude + w.mockOffset.lat;
      const workerLon = coords.longitude + w.mockOffset.lon;
      return {
        ...w,
        distanceKm: getDistanceKm(coords.latitude, coords.longitude, workerLat, workerLon),
      };
    });

    result = result.filter((w) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = w.name.toLowerCase().includes(q) || w.profession.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "All" || w.profession === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "distance") {
      result.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [workers, coords, searchQuery, categoryFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Find Reliable Services Near You
        </h1>
        <p className="text-gray-500 mt-2">
          {locationStatus === "success"
            ? "Showing nearby professionals"
            : locationStatus === "loading"
            ? "Detecting your location..."
            : "Enable location for better results"}
        </p>
      </div>

      {/* Filters */}
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
              {cat !== "All" && iconMap[cat] && <span className="mr-2">{iconMap[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          {[
            { id: 'distance', label: '📍 Nearest', icon: '📍' },
            { id: 'rating', label: '⭐ Top Rated', icon: '⭐' },
            { id: 'price', label: '💰 Lowest Price', icon: '💰' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSortBy(type.id)}
              className={`px-4 py-2 rounded-lg border transition ${
                sortBy === type.id ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-20 text-red-600 font-medium">{error}</div>
      ) : filteredWorkers.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">🔦</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No workers found</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Try broadening your filters.</p>
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
                  <p className="text-blue-600 font-bold mb-4">{worker.profession}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-bold text-gray-900">{worker.rating}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="font-bold text-gray-900">${worker.price}/hr</div>
                    {worker.distanceKm && (
                      <>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="font-bold text-gray-900">📍 {formatDistance(worker.distanceKm)}</div>
                      </>
                    )}
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
