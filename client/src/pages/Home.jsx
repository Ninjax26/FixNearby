import { Link } from 'react-router-dom'; // Home page component
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

const IconBox = ({ className = '' }) => (
  <Icon className={className}>
    <path d="M21 8l-9 5-9-5" />
    <path d="M3 8l9-5 9 5" />
    <path d="M12 13v8" />
    <path d="M3 8v13h18V8" />
  </Icon>
);

// Mock workers (same data as Services.jsx – in production this would come from an API)
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

const iconMap = {
  Electrician: "⚡",
  Plumber: "🚰",
  Carpenter: "🪵",
  Painting: "🎨",
  Cleaning: "🧹",
  "AC Repair": "❄️",
  "Pest Control": "🐜",
  Moving: "📦",
  Cleaner: "🧹",
  "AC Technician": "❄️",
  Mechanic: "🔧",
  Gardener: "🌱",
  "Appliance Repair": "🔌",
  Painter: "🎨",
};

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

const categoryIconMap = workerIconMap;

const Home = () => {
  const { coords, loading: geoLoading, error: geoError } = useLocation();

  // Compute distances and pick the 3 closest workers
  const nearbyWorkers = useMemo(() => {
    if (!coords) return [];
    return ALL_WORKERS
      .map((w) => {
        const workerLat = coords.latitude + w.mockOffset.lat;
        const workerLon = coords.longitude + w.mockOffset.lon;
        return {
          ...w,
          distanceKm: getDistanceKm(coords.latitude, coords.longitude, workerLat, workerLon),
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
  }, [coords]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Wrapper reserves space for the card (so it won't get clipped) */}
          <div className="relative pb-24 sm:pb-28">
            {/* Image panel stays rounded + clipped */}
            <div className="relative rounded-[36px] shadow-[0_18px_40px_rgba(15,23,42,0.18)] overflow-hidden">
              <div className="relative h-[320px] sm:h-[380px] lg:h-[420px]">
                <img
                  src="/hero-section.png"
                  alt="Home service professional helping customers"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/0" />
              </div>
            </div>

            {/* Card sits lower and can overflow below the image (no clipping) */}
            <div className="absolute left-1/2 top-[220px] sm:top-[260px] lg:top-[290px] -translate-x-1/2 w-full px-5 sm:px-8">
              <div className="mx-auto w-full max-w-[560px] rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-[0_14px_32px_rgba(15,23,42,0.18)] px-7 py-7 sm:px-10 sm:py-9">
                <div className="text-center">
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                    Your Home. <span className="text-[#0056D2]">Better</span>
                  </h1>
                  <p className="mt-3 text-slate-600">
                    Connect with trusted local professionals for all your home service needs. From repairs to renovations, we’ve got you covered.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center rounded-lg bg-[#0056D2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0047AF] transition"
                  >
                    Find a Pro
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2 text-sm font-semibold text-slate-800 border border-slate-300 hover:bg-slate-50 transition"
                  >
                    Become a Pro
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl sm:text-6xl font-extrabold text-slate-900">How it works</h2>
            <p className="mt-3 text-lg sm:text-xl text-slate-600">Search, book, and relax — three steps to get it done.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-14 text-center relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-[46px] left-0 w-full h-px bg-slate-200" />

            {[
              { step: '1', title: 'Search & Select', desc: 'Browse profiles, read reviews, and choose the best fit.', IconComp: IconSearch },
              { step: '2', title: 'Book Directly', desc: 'Schedule appointments instantly based on real-time availability.', IconComp: IconCalendar },
              { step: '3', title: 'Relax & Enjoy', desc: 'Let the expert handle the job with peace of mind.', IconComp: IconCheckCircle },
            ].map((s) => (
              <div key={s.step} className="relative">
                {/* arrow to next */}
                {s.step !== '3' ? (
                  <div className="hidden md:block absolute top-[36px] right-[-22px] text-slate-300 text-xl">
                    →
                  </div>
                ) : null}

                <div className="mx-auto w-[92px] h-[92px] rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <s.IconComp className="h-11 w-11 text-slate-900" />
                </div>
                <div className="mt-6 text-base sm:text-lg font-extrabold text-slate-900">{s.step}. {s.title}</div>
                <div className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular categories */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Popular Categories</h2>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-7 sm:gap-8 max-w-5xl mx-auto">
            {['Electrician', 'Plumber', 'Carpenter', 'Cleaning', 'Painting', 'AC Repair'].map((category) => {
              const CategoryIcon = categoryIconMap[category] || IconBolt;
              return (
                <Link
                  key={category}
                  to="/services"
                  className="group rounded-2xl border-2 border-slate-800/70 bg-white px-7 py-8 sm:px-10 sm:py-10 hover:border-[#0056D2] transition min-h-[128px] sm:min-h-[150px] flex items-center justify-center"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <CategoryIcon className="h-12 w-12 sm:h-14 sm:w-14 text-slate-900 group-hover:text-[#0056D2] transition-colors" />
                    <div className="font-semibold text-slate-900 text-base sm:text-lg">{category}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link to="/services" className="font-semibold text-[#0056D2] hover:underline underline-offset-4">
              View all services →
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby (location-driven) */}
      {(geoLoading || coords || geoError) && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-6 flex-col md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-100">
                  <span className={`w-2 h-2 rounded-full bg-emerald-500 ${coords ? 'animate-pulse' : ''}`} />
                  {coords ? 'Live location' : geoLoading ? 'Detecting location…' : 'Location unavailable'}
                </div>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">Closest to you</h2>
                <p className="mt-2 text-slate-600">
                  {coords
                    ? 'Top professionals sorted by proximity to your current location.'
                    : geoLoading
                      ? 'Fetching your location to show nearby workers…'
                      : 'Enable location access to see workers near you.'}
                </p>
              </div>
              <Link to="/services" className="font-semibold text-[#0056D2] hover:underline underline-offset-4">
                Browse all pros →
              </Link>
            </div>

            {geoLoading && (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="w-12 h-12 rounded-full border-4 border-[#0056D2]/20 border-t-[#0056D2] animate-spin" />
                <p className="text-slate-500 font-medium">Requesting location permission…</p>
              </div>
            )}

            {geoError && !geoLoading && (
              <div className="mt-10 text-center py-10 bg-amber-50 rounded-2xl border border-amber-100 max-w-xl mx-auto">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-amber-900 font-semibold mb-2">Location access required</p>
                <p className="text-amber-700 text-sm mb-6">{geoError}</p>
                <Link to="/services" className="inline-block px-6 py-2.5 bg-[#0056D2] hover:bg-[#0047AF] text-white font-bold rounded-xl transition">
                  Browse services →
                </Link>
              </div>
            )}

            {coords && nearbyWorkers.length > 0 && (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {nearbyWorkers.map((worker) => {
                  const WorkerIcon = workerIconMap[worker.profession] || IconBolt;
                  return (
                    <div
                      key={worker.id}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 hover:border-[#0056D2]/40 transition-all duration-200 overflow-hidden flex flex-col"
                    >
                      <div className="p-7 flex-1">
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm">
                            <WorkerIcon className="h-8 w-8 text-slate-900" />
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                            📍 {formatDistance(worker.distanceKm)}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-0.5 group-hover:text-[#0056D2] transition-colors">{worker.name}</h3>
                        <p className="text-[#0056D2] font-semibold text-sm mb-4">{worker.profession}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="font-bold text-slate-900">{worker.rating}</span>
                          </div>
                          <div className="w-px h-4 bg-slate-300" />
                          <div className="font-bold text-slate-900">{worker.price}</div>
                        </div>
                      </div>
                      <div className="px-7 pb-7">
                        <Link
                          to={`/worker/${worker.id}`}
                          className="block w-full text-center bg-slate-900 hover:bg-[#0056D2] text-white font-bold py-3.5 rounded-xl transition shadow-sm"
                        >
                          View &amp; Book
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-[#0056D2] text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Need help today?</h2>
          <p className="mt-3 text-white/80">
            Book trusted professionals in minutes and get your home back on track — without the hassle.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/services"
              className="bg-white text-[#0056D2] px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition shadow-sm"
            >
              Find a Pro
            </Link>
            <Link
              to="/register"
              className="bg-transparent border border-white/40 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Become a Pro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
