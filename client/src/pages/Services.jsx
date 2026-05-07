import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

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

  // ---------------- CATEGORY ----------------

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
          instantBooking: true,
          arrivalTime: "30 mins",
          serviceWarranty: "7 Days",
          successRate: 98,
          recommended: true,
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
          instantBooking: false,
          arrivalTime: "1 hour",
          serviceWarranty: "14 Days",
          successRate: 96,
          recommended: false,
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
          instantBooking: true,
          arrivalTime: "45 mins",
          serviceWarranty: "5 Days",
          successRate: 94,
          recommended: false,
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
          instantBooking: true,
          arrivalTime: "25 mins",
          serviceWarranty: "10 Days",
          successRate: 97,
          recommended: true,
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
          instantBooking: false,
          arrivalTime: "2 hours",
          serviceWarranty: "15 Days",
          successRate: 95,
          recommended: false,
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
          instantBooking: true,
          arrivalTime: "20 mins",
          serviceWarranty: "3 Days",
          successRate: 91,
          recommended: false,
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

  // ---------------- PROCESS ----------------

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
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}

      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-6">

              🚀 Trusted Home Services

            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">

              Find Skilled Professionals Near You

            </h1>

            <p className="text-slate-300 mt-6 text-lg leading-relaxed max-w-2xl">

              Compare ratings, pricing, experience and response
              time before booking verified professionals for
              your home services.

            </p>

            {/* SEARCH */}

            <div className="bg-white rounded-3xl p-4 mt-10 shadow-2xl">

              <div className="flex flex-col lg:flex-row gap-4">

                <input
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search electricians, plumbers..."
                  className="flex-1 px-5 py-4 text-slate-900 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="px-5 py-4 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="distance">
                    Nearest
                  </option>

                  <option value="rating">
                    Top Rated
                  </option>

                  <option value="price">
                    Lowest Price
                  </option>
                </select>

              </div>

              {/* CATEGORY */}

              <div className="flex flex-wrap gap-3 mt-5">

                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setCategoryFilter(cat)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      categoryFilter === cat
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RESULTS */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {!loading && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Available Professionals
              </h2>

              <p className="text-slate-500 mt-1">

                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {processedWorkers.length}
                </span>{" "}
                professionals near you

              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm">

                <p className="text-xs text-slate-500">
                  Avg Price
                </p>

                <h4 className="font-bold text-slate-900">
                  $38/hr
                </h4>

              </div>

              <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm">

                <p className="text-xs text-slate-500">
                  Verified
                </p>

                <h4 className="font-bold text-emerald-600">
                  80%
                </h4>

              </div>

            </div>

          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <LoadingSpinner />
        ) : processedWorkers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl py-24 text-center">

            <div className="text-7xl mb-6">
              🔍
            </div>

            <h3 className="text-3xl font-bold text-slate-900">

              No Professionals Found

            </h3>

            <p className="text-slate-500 mt-3">

              Try another keyword or category filter

            </p>

          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-8">

            {processedWorkers.map((w) => (
              <div
                key={w.id}
                className="group relative bg-white border border-slate-200 rounded-[30px] p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >

                {/* RECOMMENDED */}

                {w.recommended && (
                  <div className="absolute top-5 right-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">

                    ⭐ Recommended

                  </div>
                )}

                {/* TOP */}

                <div className="flex items-start gap-4">

                  {/* ICON */}

                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center text-4xl shadow-inner shrink-0 group-hover:scale-110 transition duration-300">

                    {iconMap[w.profession]}

                  </div>

                  {/* INFO */}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      <h3 className="text-2xl font-bold text-slate-900 leading-tight">

                        {w.name}

                      </h3>

                      {w.verified && (
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">

                          ✓ Verified

                        </span>
                      )}

                    </div>

                    <p className="text-blue-600 font-semibold mt-1 text-lg">

                      {w.profession}

                    </p>

                    {/* PRIMARY DECISION */}

                    <div className="flex flex-wrap gap-2 mt-4">

                      <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">

                        ⭐ {w.rating}

                      </div>

                      <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">

                        💰 ${w.price}/hr

                      </div>

                      <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">

                        🛠 {w.experience} yrs

                      </div>

                    </div>

                  </div>

                </div>

                {/* AVAILABILITY */}

                <div className="mt-6 flex items-center justify-between">

                  <div
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      w.available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {w.available
                      ? "Available Now"
                      : "Currently Busy"}
                  </div>

                  {w.distanceKm && (
                    <div className="text-sm font-semibold text-slate-600">

                      📍 {formatDistance(w.distanceKm)}

                    </div>
                  )}

                </div>

                {/* STATS */}

                <div className="grid grid-cols-3 gap-3 mt-6">

                  <div className="bg-slate-50 rounded-2xl p-4 text-center">

                    <p className="text-xs text-slate-500">
                      Jobs
                    </p>

                    <h4 className="font-bold text-slate-900 mt-1">

                      {w.completedJobs}+

                    </h4>

                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 text-center">

                    <p className="text-xs text-slate-500">
                      Response
                    </p>

                    <h4 className="font-bold text-slate-900 mt-1">

                      {w.responseTime}

                    </h4>

                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 text-center">

                    <p className="text-xs text-slate-500">
                      Success
                    </p>

                    <h4 className="font-bold text-emerald-600 mt-1">

                      {w.successRate}%

                    </h4>

                  </div>

                </div>

                {/* SERVICE DETAILS */}

                <div className="mt-6 border-t border-slate-100 pt-6 space-y-4">

                  <div className="flex items-center justify-between">

                    <span className="text-slate-500 text-sm">

                      🚀 Booking Type

                    </span>

                    <span
                      className={`font-semibold text-sm ${
                        w.instantBooking
                          ? "text-emerald-600"
                          : "text-orange-500"
                      }`}
                    >
                      {w.instantBooking
                        ? "Instant Confirmation"
                        : "Approval Required"}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-slate-500 text-sm">

                      ⏱ Arrival Time

                    </span>

                    <span className="font-semibold text-slate-900 text-sm">

                      {w.arrivalTime}

                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-slate-500 text-sm">

                      🛡 Warranty

                    </span>

                    <span className="font-semibold text-slate-900 text-sm">

                      {w.serviceWarranty}

                    </span>

                  </div>

                </div>

                {/* OUTCOME BOX */}

                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4">

                  <p className="text-sm leading-relaxed text-slate-700">

                    {w.instantBooking
                      ? `Book instantly and expect arrival within ${w.arrivalTime}.`
                      : `Worker approval required before booking confirmation.`}

                  </p>

                </div>

                {/* BUTTONS */}

                <div className="grid grid-cols-2 gap-4 mt-6">

                  <button className="border border-slate-300 rounded-2xl py-3.5 font-semibold hover:border-blue-500 hover:text-blue-600 transition-all">

                    Chat Now

                  </button>

                  <Link
                    to={`/worker/${w.id}`}
                    className="bg-slate-900 text-white text-center py-3.5 rounded-2xl font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
                  >
                    {w.instantBooking
                      ? "Book Instantly"
                      : "Request Booking"}
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Services;