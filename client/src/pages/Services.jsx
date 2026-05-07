import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

// Helpers
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
        {
          id: 1,
          name: "John Doe",
          profession: "Electrician",
          rating: 4.8,
          price: 40,
        },
        {
          id: 2,
          name: "Jane Smith",
          profession: "Plumber",
          rating: 4.9,
          price: 50,
        },
        {
          id: 3,
          name: "Mike Johnson",
          profession: "Carpenter",
          rating: 4.5,
          price: 35,
        },
        {
          id: 4,
          name: "Ravi Kumar",
          profession: "Painter",
          rating: 4.6,
          price: 30,
        },
        {
          id: 5,
          name: "Amit Sharma",
          profession: "AC Technician",
          rating: 4.7,
          price: 45,
        },
        {
          id: 6,
          name: "Rahul Das",
          profession: "Cleaner",
          rating: 4.4,
          price: 25,
        },
        {
          id: 7,
          name: "Suresh Patel",
          profession: "Mechanic",
          rating: 4.8,
          price: 55,
        },
        {
          id: 8,
          name: "Arjun Singh",
          profession: "Gardener",
          rating: 4.3,
          price: 20,
        },
      ]);

      setLoading(false);
    }, 600);
  }, []);

  /* ---------------- URL SYNC ---------------- */
  useEffect(() => {
    const params = {};

    if (searchQuery) params.search = searchQuery;

    if (categoryFilter !== "All") {
      params.category = categoryFilter;
    }

    if (sortBy !== "distance") {
      params.sort = sortBy;
    }

    setSearchParams(params);
  }, [searchQuery, categoryFilter, sortBy, setSearchParams]);

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

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Find Skilled Professionals
        </h1>

        <p className="text-slate-600 mt-3 text-sm sm:text-base">
          Search, compare and book trusted workers near you
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search electricians, plumbers..."
          className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="distance">Nearest</option>
          <option value="rating">Top Rated</option>
          <option value="price">Lowest Price</option>
        </select>

      </div>

      {/* CATEGORIES */}
      <div className="flex flex-wrap gap-3 mb-10">

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
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

      {/* CONTENT */}
      {loading ? (
        <LoadingSpinner />
      ) : processedWorkers.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-lg">
          No workers found
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 w-full">

          {processedWorkers.map((w) => (
            <div
              key={w.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >

              {/* ICON */}
              <div className="text-4xl mb-4">
                {iconMap[w.profession]}
              </div>

              {/* NAME */}
              <h3 className="text-xl font-bold text-slate-900">
                {w.name}
              </h3>

              {/* PROFESSION */}
              <p className="text-blue-600 font-medium mt-1">
                {w.profession}
              </p>

              {/* INFO */}
              <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
                <span>⭐ {w.rating}</span>

                <span className="font-semibold text-slate-900">
                  ${w.price}/hr
                </span>
              </div>

              {/* DISTANCE */}
              {w.distanceKm && (
                <p className="text-xs text-emerald-600 mt-3">
                  📍 {formatDistance(w.distanceKm)} away
                </p>
              )}

              {/* BUTTON */}
              <div className="mt-auto pt-5">
                <Link
                  to={`/worker/${w.id}`}
                  className="block w-full text-center bg-slate-900 text-white py-3 rounded-xl hover:bg-blue-600 transition duration-300 font-medium"
                >
                  View & Book
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