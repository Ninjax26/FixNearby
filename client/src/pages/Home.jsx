import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useLocation } from '../context/LocationContext';
import { getDistanceKm, formatDistance } from '../utils/distance';

// Mock workers (same data as Services.jsx – in production this would come from an API)
const ALL_WORKERS = [
  { id: 1,  name: "John Doe",      profession: "Electrician",    rating: 4.8, price: "$40/hr", mockOffset: { lat: 0.012,  lon: 0.008  } },
  { id: 2,  name: "Jane Smith",    profession: "Plumber",        rating: 4.9, price: "$50/hr", mockOffset: { lat: -0.005, lon: 0.020  } },
  { id: 3,  name: "Mike Johnson",  profession: "Carpenter",      rating: 4.5, price: "$35/hr", mockOffset: { lat: 0.030,  lon: -0.015 } },
  { id: 4,  name: "Ravi Kumar",    profession: "Painter",        rating: 4.6, price: "$30/hr", mockOffset: { lat: -0.022, lon: -0.010 } },
  { id: 5,  name: "Amit Sharma",   profession: "AC Technician",  rating: 4.7, price: "$45/hr", mockOffset: { lat: 0.008,  lon: -0.025 } },
  { id: 6,  name: "Suresh Patel",  profession: "Cleaner",        rating: 4.3, price: "$25/hr", mockOffset: { lat: 0.050,  lon: 0.030  } },
  { id: 7,  name: "David Lee",     profession: "Mechanic",       rating: 4.8, price: "$55/hr", mockOffset: { lat: -0.040, lon: 0.015  } },
  { id: 8,  name: "Priya Singh",   profession: "Gardener",       rating: 4.4, price: "$20/hr", mockOffset: { lat: 0.003,  lon: 0.004  } },
  { id: 9,  name: "Imran Khan",    profession: "Appliance Repair", rating: 4.6, price: "$35/hr", mockOffset: { lat: -0.018, lon: -0.030 } },
  { id: 10, name: "Neha Gupta",    profession: "Pest Control",   rating: 4.5, price: "$40/hr", mockOffset: { lat: 0.025,  lon: -0.005 } },
];

const iconMap = {
  Electrician: "⚡", Plumber: "🚰", Carpenter: "🪵", Painter: "🎨",
  "AC Technician": "❄️", Cleaner: "🧹", Mechanic: "🔧", Gardener: "🌱",
  "Appliance Repair": "🔌", "Pest Control": "🐜",
  Cleaning: "🧹", Painting: "🎨", "AC Repair": "❄️", Moving: "📦"
};

const Home = () => {
  const { coords, loading: geoLoading, error: geoError } = useLocation();

  // Compute distances and pick the 3 closest workers
  const nearbyWorkers = useMemo(() => {
    if (!coords) return [];
    return ALL_WORKERS
      .map((w) => {
        const workerLat = coords.latitude  + w.mockOffset.lat;
        const workerLon = coords.longitude + w.mockOffset.lon;
        return { ...w, distanceKm: getDistanceKm(coords.latitude, coords.longitude, workerLat, workerLon) };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
  }, [coords]);

  return (
    <div className="bg-white">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
            <span className="block">Find Reliable Workers</span>
            <span className="block text-blue-600">In Your Neighborhood</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500 sm:text-lg md:text-xl">
            FixNearby connects you with trusted electricians, plumbers, carpenters, and more. Fast, secure, and hassle-free.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition"
            >
              Browse Services
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md transition"
            >
              Join as a Worker
            </Link>
          </div>

          <div className="mt-10 flex justify-center items-center gap-8 text-gray-400 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">✓</span> 10,000+ Users
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">✓</span> Verified Professionals
            </div>
          </div>
        </div>
      </div>

      {/* ── Near You Section ── */}
      {(geoLoading || coords || geoError) && (
        <div className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 border-y border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                <span className={`w-2 h-2 rounded-full bg-green-500 ${coords ? 'animate-pulse' : ''}`} />
                {coords ? 'Live Location' : geoLoading ? 'Detecting Location…' : 'Location Unavailable'}
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900">Closest to You</h2>
              <p className="mt-3 text-lg text-gray-500">
                {coords
                  ? 'Top professionals sorted by proximity to your current location.'
                  : geoLoading
                  ? 'Fetching your location to show nearby workers…'
                  : 'Enable location access to see workers near you.'}
              </p>
            </div>

            {geoLoading && (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                <p className="text-gray-400 font-medium">Requesting location permission…</p>
              </div>
            )}

            {geoError && !geoLoading && (
              <div className="text-center py-10 bg-amber-50 rounded-2xl border border-amber-100 max-w-lg mx-auto">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-amber-800 font-semibold mb-2">Location access required</p>
                <p className="text-amber-600 text-sm mb-6">{geoError}</p>
                <Link to="/services" className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">
                  Browse All Services →
                </Link>
              </div>
            )}

            {coords && nearbyWorkers.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {nearbyWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                      <div className="p-7 flex-1">
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            {iconMap[worker.profession] || '👷'}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                            📍 {formatDistance(worker.distanceKm)}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors">{worker.name}</h3>
                        <p className="text-blue-600 font-semibold text-sm mb-4">{worker.profession}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="font-bold text-gray-900">{worker.rating}</span>
                          </div>
                          <div className="w-px h-4 bg-gray-300" />
                          <div className="font-bold text-gray-900">{worker.price}</div>
                        </div>
                      </div>
                      <div className="px-7 pb-7">
                        <Link
                          to={`/worker/${worker.id}`}
                          className="block w-full text-center bg-gray-900 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-blue-200"
                        >
                          View &amp; Book
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-10">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-blue-200 hover:border-blue-500 text-blue-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    See All Services →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* How it Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">Get your tasks done in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Search", desc: "Find nearby professionals based on skills, ratings, and location.", color: "blue", icon: "🔍" },
              { step: "2", title: "Book", desc: "Choose a time slot and confirm your booking instantly.", color: "green", icon: "📅" },
              { step: "3", title: "Relax", desc: "Sit back while the expert completes your task efficiently.", color: "yellow", icon: "🏠" }
            ].map((item, i) => (
              <div key={i} className="relative p-10 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white text-2xl font-bold bg-${item.color}-500 group-hover:rotate-6 transition-transform`}>
                  {item.icon}
                </div>
                <div className="absolute top-6 right-6 text-4xl font-black text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity">
                  0{item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Electrician', 'Plumber', 'Carpenter', 'Cleaning', 
              'Painting', 'AC Repair', 'Pest Control', 'Moving'
            ].map((category, idx) => (
              <Link
                key={idx}
                to={`/services?category=${category}`}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:border-blue-500 hover:text-blue-600 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {iconMap[category] || '🛠️'}
                </div>
                <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-blue-600 text-center text-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Need Help Today?</h2>
          <p className="mb-10 text-xl text-blue-100">
            Book trusted professionals instantly and get your job done without hassle.
          </p>
          <Link
            to="/services"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            Get Started Now
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Home;