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

        </div>
      )}

    </div>
  );
};

export default Services;