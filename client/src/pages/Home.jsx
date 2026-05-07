import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useLocation } from '../context/LocationContext';
import { getDistanceKm, formatDistance } from '../utils/distance';

const Icon = ({ children, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

const IconSearch = ({ className = '' }) => (
  <Icon className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
);

const IconCalendar = ({ className = '' }) => (
  <Icon className={className}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M8 3.5v4" />
    <path d="M16 3.5v4" />
    <path d="M4 9h16" />
  </Icon>
);

const IconCheckCircle = ({ className = '' }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.2 2.2L16 9.5" />
  </Icon>
);

const IconBolt = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M13 2L4 14h7l-1 8 10-14h-7z" />
  </Icon>
);

const IconPipe = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M8 6h6a3 3 0 013 3v2" />
    <path d="M17 11h-6a3 3 0 00-3 3v4" />
    <path d="M7 18h2" />
    <path d="M15 6h2" />
  </Icon>
);

const IconSaw = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M5 15l7-7 7 7" />
    <path d="M6.5 13.5l-2 2" />
    <path d="M17.5 13.5l2 2" />
    <path d="M8 17h8" />
  </Icon>
);

const IconBrush = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M14 3l7 7-7 7-7-7z" />
    <path d="M7 14l-3 7" />
    <path d="M5 18h4" />
  </Icon>
);

const IconBroom = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M10 3l8 8" />
    <path d="M9 8l7 7" />
    <path d="M3 21l6-6" />
    <path d="M5 19l3 3" />
  </Icon>
);

const IconSnowflake = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M12 2v20" />
    <path d="M4.5 6.5l15 11" />
    <path d="M19.5 6.5l-15 11" />
    <path d="M7 4.5l2 2" />
    <path d="M15 4.5l-2 2" />
    <path d="M7 19.5l2-2" />
    <path d="M15 19.5l-2-2" />
  </Icon>
);

const IconBug = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M9 9h6" />
    <path d="M10 6l2-2 2 2" />
    <rect x="8" y="9" width="8" height="10" rx="4" />
    <path d="M6 13h2" />
    <path d="M16 13h2" />
    <path d="M7 19l-2 2" />
    <path d="M17 19l2 2" />
  </Icon>
);

// Mock workers
const ALL_WORKERS = [
  { id: 1, name: "John Doe", profession: "Electrician", rating: 4.8, price: "$40/hr", mockOffset: { lat: 0.012, lon: 0.008 } },
  { id: 2, name: "Jane Smith", profession: "Plumber", rating: 4.9, price: "$50/hr", mockOffset: { lat: -0.005, lon: 0.020 } },
  { id: 3, name: "Mike Johnson", profession: "Carpenter", rating: 4.5, price: "$35/hr", mockOffset: { lat: 0.030, lon: -0.015 } },
  { id: 4, name: "Ravi Kumar", profession: "Painter", rating: 4.6, price: "$30/hr", mockOffset: { lat: -0.022, lon: -0.010 } },
  { id: 5, name: "Amit Sharma", profession: "AC Technician", rating: 4.7, price: "$45/hr", mockOffset: { lat: 0.008, lon: -0.025 } },
  { id: 6, name: "Suresh Patel", profession: "Cleaner", rating: 4.3, price: "$25/hr", mockOffset: { lat: 0.050, lon: 0.030 } },
  { id: 7, name: "David Lee", profession: "Mechanic", rating: 4.8, price: "$55/hr", mockOffset: { lat: -0.040, lon: 0.015 } },
  { id: 8, name: "Priya Singh", profession: "Gardener", rating: 4.4, price: "$20/hr", mockOffset: { lat: 0.003, lon: 0.004 } },
  { id: 9, name: "Imran Khan", profession: "Appliance Repair", rating: 4.6, price: "$35/hr", mockOffset: { lat: -0.018, lon: -0.030 } },
  { id: 10, name: "Neha Gupta", profession: "Pest Control", rating: 4.5, price: "$40/hr", mockOffset: { lat: 0.025, lon: -0.005 } },
];

const workerIconMap = {
  Electrician: IconBolt,
  Plumber: IconPipe,
  Carpenter: IconSaw,
  Painter: IconBrush,
  Cleaner: IconBroom,
  "AC Technician": IconSnowflake,
  Mechanic: IconSaw,
  Gardener: IconBroom,
  "Appliance Repair": IconBolt,
  "Pest Control": IconBug,
};

// ---------------- HELPERS ----------------

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

  // ---------------- STATES ----------------

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

  // ---------------- CATEGORIES ----------------

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

  // ---------------- LOCATION ----------------

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  }, []);

  // ---------------- MOCK DATA ----------------

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setWorkers([
        {
          id: 1,
          name: "John Doe",
          profession: "Electrician",
          rating: 4.8,
          price: 40,
          experience: 6,
          completedJobs: 124,
          available: true,
          responseTime: "10 mins",
          verified: true,
        },

        {
          id: 2,
          name: "Jane Smith",
          profession: "Plumber",
          rating: 4.9,
          price: 50,
          experience: 8,
          completedJobs: 201,
          available: false,
          responseTime: "20 mins",
          verified: true,
        },

        {
          id: 3,
          name: "Mike Johnson",
          profession: "Carpenter",
          rating: 4.5,
          price: 35,
          experience: 5,
          completedJobs: 98,
          available: true,
          responseTime: "15 mins",
          verified: false,
        },

        {
          id: 4,
          name: "Ravi Kumar",
          profession: "Painter",
          rating: 4.6,
          price: 30,
          experience: 4,
          completedJobs: 76,
          available: true,
          responseTime: "12 mins",
          verified: true,
        },

        {
          id: 5,
          name: "Amit Sharma",
          profession: "AC Technician",
          rating: 4.7,
          price: 45,
          experience: 7,
          completedJobs: 180,
          available: false,
          responseTime: "25 mins",
          verified: true,
        },

        {
          id: 6,
          name: "Rahul Das",
          profession: "Cleaner",
          rating: 4.4,
          price: 25,
          experience: 3,
          completedJobs: 63,
          available: true,
          responseTime: "8 mins",
          verified: false,
        },

        {
          id: 7,
          name: "Suresh Patel",
          profession: "Mechanic",
          rating: 4.8,
          price: 55,
          experience: 9,
          completedJobs: 245,
          available: true,
          responseTime: "18 mins",
          verified: true,
        },

        {
          id: 8,
          name: "Arjun Singh",
          profession: "Gardener",
          rating: 4.3,
          price: 20,
          experience: 2,
          completedJobs: 40,
          available: true,
          responseTime: "5 mins",
          verified: false,
        },
      ]);

      setLoading(false);
    }, 700);
  }, []);

  // ---------------- URL SYNC ----------------

  useEffect(() => {
    const params = {};

    if (searchQuery) {
      params.search = searchQuery;
    }

    if (categoryFilter !== "All") {
      params.category = categoryFilter;
    }

    if (sortBy !== "distance") {
      params.sort = sortBy;
    }

    setSearchParams(params);
  }, [
    searchQuery,
    categoryFilter,
    sortBy,
    setSearchParams,
  ]);

  // ---------------- PROCESS WORKERS ----------------

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

      return {
        ...w,
        distanceKm: distance,
      };
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
      result = result.filter(
        (w) => w.profession === categoryFilter
      );
    }

    // SORT
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    } else {
      result.sort(
        (a, b) => (a.distanceKm || 999) - (b.distanceKm || 999)
      );
    }

    return result;
  }, [
    workers,
    searchQuery,
    categoryFilter,
    sortBy,
    coords,
  ]);

  // ---------------- UI ----------------

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* HEADER */}

      <div className="text-center mb-12">

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
          Find Trusted Skilled Professionals
        </h1>

        <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
          Compare ratings, pricing, experience and availability
          to hire the best workers near you.
        </p>

      </div>

      {/* SEARCH + FILTER */}

      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mb-10">

        <div className="flex flex-col lg:flex-row gap-4">

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search electricians, plumbers, painters..."
            className="flex-1 px-5 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-5 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="distance">Nearest</option>
            <option value="rating">Top Rated</option>
            <option value="price">Lowest Price</option>
          </select>

        </div>

        {/* CATEGORY BUTTONS */}

        <div className="flex flex-wrap gap-3 mt-6">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {iconMap[cat] && (
                <span className="mr-1">
                  {iconMap[cat]}
                </span>
              )}

              {cat}
            </button>
          ))}

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="relative pb-56 sm:pb-64 lg:pb-72">
            <div className="relative rounded-[36px] shadow-[0_18px_40px_rgba(15,23,42,0.18)] overflow-hidden">
              <div className="relative h-[320px] sm:h-[380px] lg:h-[420px]">
                <img
                  src="/hero-section.png"
                  alt="Home service professional"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            <div className="absolute left-1/2 top-[220px] sm:top-[260px] lg:top-[290px] -translate-x-1/2 w-full px-5 sm:px-8">
              <div className="mx-auto w-full max-w-[560px] rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-[0_14px_32px_rgba(15,23,42,0.18)] px-7 py-7 sm:px-10 sm:py-9 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-5">
                  ⭐ Trusted by 10,000+ homeowners
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Reliable Home Services,
                  <span className="block text-[#0056D2]">Right When You Need Them</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600">
                  Find verified professionals near you — fast booking, transparent pricing, and trusted service.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Link to="/services" className="inline-flex items-center justify-center rounded-lg bg-[#0056D2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0047AF] transition">
                    Find a Pro
                  </Link>
                  <Link to="/worker-register" className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2 text-sm font-semibold text-slate-800 border border-slate-300 hover:bg-slate-50 transition">
                    Become a Pro
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Why Choose <span className="text-[#0056D2]">FixNearby</span></h2>
            <p className="mt-5 text-lg text-slate-600">We focus on safety, reliability, and quality service.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "10K+", label: "Happy Customers", icon: "😊" },
              { number: "500+", label: "Verified Pros", icon: "🛠️" },
              { number: "24/7", label: "Support", icon: "📞" },
              { number: "4.9★", label: "Rating", icon: "⭐" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-4xl font-extrabold text-slate-900">{item.number}</div>
                <p className="mt-2 text-slate-500 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RESULTS COUNT */}

      {!loading && (
        <div className="flex items-center justify-between mb-6">

          <p className="text-slate-600 text-sm sm:text-base">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {processedWorkers.length}
            </span>{" "}
            professionals
          </p>

        </div>
      )}

      {/* CONTENT */}

      {loading ? (
        <LoadingSpinner />
      ) : processedWorkers.length === 0 ? (
        <div className="text-center py-20">

          <div className="text-6xl mb-4">
            🔍
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            No workers found
          </h3>

          <p className="text-slate-500 mt-2">
            Try searching another category or keyword
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-7">

          {processedWorkers.map((w) => (
            <div
              key={w.id}
              className="group bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative"
            >

              {/* TOP SECTION */}

              <div className="flex items-start justify-between">

                <div>

                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                    {iconMap[w.profession]}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 flex-wrap">

                    {w.name}

                    {w.verified && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}

                  </h3>

                  <p className="text-blue-600 font-medium mt-1">
                    {w.profession}
                  </p>

                </div>

                <div
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    w.available
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {w.available ? "Available" : "Busy"}
                </div>

      {/* Nearby Pros */}
      {(geoLoading || coords || geoError) && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-6 flex-col md:flex-row md:items-center mb-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-100">
                  <span className={`w-2 h-2 rounded-full bg-emerald-500 ${coords ? 'animate-pulse' : ''}`} />
                  {coords ? 'Live location' : geoLoading ? 'Detecting location…' : 'Location unavailable'}
                </div>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">Closest to you</h2>
              </div>
              <Link to="/services" className="font-semibold text-[#0056D2] hover:underline underline-offset-4">Browse all pros →</Link>
            </div>

            {geoLoading && <div className="text-center py-12 text-slate-500 font-medium">Requesting location permission…</div>}
            {geoError && !geoLoading && (
              <div className="text-center py-10 bg-amber-50 rounded-2xl border border-amber-100 max-w-xl mx-auto">
                <p className="text-amber-900 font-semibold">{geoError}</p>
              </div>
            )}

            {coords && nearbyWorkers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nearbyWorkers.map((worker) => {
                  const WorkerIcon = workerIconMap[worker.profession] || IconBolt;
                  return (
                    <div key={worker.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 transition-all overflow-hidden flex flex-col p-7">
                      <div className="flex items-start justify-between mb-5">
                        <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm">
                          <WorkerIcon className="h-8 w-8 text-slate-900" />
                        </div>
                        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                          📍 {formatDistance(worker.distanceKm)}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-0.5">{worker.name}</h3>
                      <p className="text-[#0056D2] font-semibold text-sm mb-4">{worker.profession}</p>
                      <div className="flex items-center gap-3 text-sm text-slate-600 mb-6">
                        <span>★ {worker.rating}</span>
                        <div className="w-px h-4 bg-slate-300" />
                        <span>{worker.price}</span>
                      </div>
                      <Link to={`/worker/${worker.id}`} className="block w-full text-center bg-slate-900 hover:bg-[#0056D2] text-white font-bold py-3.5 rounded-xl transition">
                        View & Book
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* STATS GRID */}

              <div className="grid grid-cols-2 gap-4 mt-6">

                <div className="bg-slate-50 rounded-2xl p-4">

                  <p className="text-xs text-slate-500 mb-1">
                    Rating
                  </p>

                  <p className="font-bold text-slate-900">
                    ⭐ {w.rating}
                  </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-4">

                  <p className="text-xs text-slate-500 mb-1">
                    Price
                  </p>

                  <p className="font-bold text-slate-900">
                    ${w.price}/hr
                  </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-4">

                  <p className="text-xs text-slate-500 mb-1">
                    Experience
                  </p>

                  <p className="font-bold text-slate-900">
                    {w.experience} Years
                  </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-4">

                  <p className="text-xs text-slate-500 mb-1">
                    Jobs Done
                  </p>

                  <p className="font-bold text-slate-900">
                    {w.completedJobs}+
                  </p>

                </div>

              </div>

              {/* EXTRA INFO */}

              <div className="mt-5 space-y-3 text-sm">

                <div className="flex items-center justify-between text-slate-600">

                  <span>
                    ⚡ Response Time
                  </span>

                  <span className="font-medium text-slate-900">
                    {w.responseTime}
                  </span>

                </div>

                {w.distanceKm && (
                  <div className="flex items-center justify-between text-slate-600">

                    <span>
                      📍 Distance
                    </span>

                    <span className="font-medium text-emerald-600">
                      {formatDistance(w.distanceKm)}
                    </span>

                  </div>
                )}

              </div>

              {/* BUTTONS */}

              <div className="grid grid-cols-2 gap-3 mt-7">

                <button className="border border-slate-300 rounded-2xl py-3 font-medium hover:border-blue-500 hover:text-blue-600 transition">
                  Message
                </button>

                <Link
                  to={`/worker/${w.id}`}
                  className="bg-slate-900 text-white text-center py-3 rounded-2xl font-medium hover:bg-blue-600 transition"
                >
                  Book Now
                </Link>

              </div>

            </div>
          ))}

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-extrabold text-slate-900 mb-4">How it works</h2>
          <p className="text-lg text-slate-600 mb-16">Three simple steps to get it done.</p>
          <div className="grid md:grid-cols-3 gap-14 relative">
            {[
              { step: '1', title: 'Search & Select', desc: 'Browse profiles and read reviews.', IconComp: IconSearch },
              { step: '2', title: 'Book Directly', desc: 'Schedule appointments instantly.', IconComp: IconCalendar },
              { step: '3', title: 'Relax & Enjoy', desc: 'Let the expert handle the job.', IconComp: IconCheckCircle },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="mx-auto w-[92px] h-[92px] rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
                  <s.IconComp className="h-11 w-11 text-slate-900" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{s.step}. {s.title}</h3>
                <p className="mt-2 text-slate-600 max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Painter', 'AC Technician'].map((category) => {
              const CategoryIcon = categoryIconMap[category] || IconBolt;
              return (
                <Link key={category} to={`/services?category=${category}`} className="group rounded-2xl border-2 border-slate-100 bg-white p-8 hover:border-[#0056D2] transition shadow-sm hover:shadow-md">
                  <CategoryIcon className="h-12 w-12 text-slate-900 group-hover:text-[#0056D2] transition mx-auto mb-4" />
                  <div className="font-semibold text-slate-900">{category}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0056D2] text-center text-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-4">Need help today?</h2>
          <p className="text-white/80 mb-8 text-lg">Book trusted professionals in minutes and get your home back on track.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/services" className="bg-white text-[#0056D2] px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition shadow-sm">Find a Pro</Link>
            <Link to="/worker-register" className="border border-white/40 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition">Become a Pro</Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default Services;
export default Home;

