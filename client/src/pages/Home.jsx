import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useLocation } from '../context/LocationContext';
import { getDistanceKm, formatDistance } from '../utils/distance';

const ALL_WORKERS = [
  { id: 1,  name: "John Doe",      profession: "Electrician",      rating: 4.8, price: "$40/hr", mockOffset: { lat: 0.012,  lon: 0.008  } },
  { id: 2,  name: "Jane Smith",    profession: "Plumber",          rating: 4.9, price: "$50/hr", mockOffset: { lat: -0.005, lon: 0.020  } },
  { id: 3,  name: "Mike Johnson",  profession: "Carpenter",        rating: 4.5, price: "$35/hr", mockOffset: { lat: 0.030,  lon: -0.015 } },
  { id: 4,  name: "Ravi Kumar",    profession: "Painter",          rating: 4.6, price: "$30/hr", mockOffset: { lat: -0.022, lon: -0.010 } },
  { id: 5,  name: "Amit Sharma",   profession: "AC Technician",    rating: 4.7, price: "$45/hr", mockOffset: { lat: 0.008,  lon: -0.025 } },
  { id: 6,  name: "Suresh Patel",  profession: "Cleaner",          rating: 4.3, price: "$25/hr", mockOffset: { lat: 0.050,  lon: 0.030  } },
  { id: 7,  name: "David Lee",     profession: "Mechanic",         rating: 4.8, price: "$55/hr", mockOffset: { lat: -0.040, lon: 0.015  } },
  { id: 8,  name: "Priya Singh",   profession: "Gardener",         rating: 4.4, price: "$20/hr", mockOffset: { lat: 0.003,  lon: 0.004  } },
  { id: 9,  name: "Imran Khan",    profession: "Appliance Repair", rating: 4.6, price: "$35/hr", mockOffset: { lat: -0.018, lon: -0.030 } },
  { id: 10, name: "Neha Gupta",    profession: "Pest Control",     rating: 4.5, price: "$40/hr", mockOffset: { lat: 0.025,  lon: -0.005 } },
];

const categoryIconMap = {
  Electrician: IconBolt,
  Plumber: IconPipe,
  Carpenter: IconSaw,
  Cleaning: IconBroom,
  Painting: IconBrush,
  "AC Repair": IconSnowflake,
  "Pest Control": IconBug,
  Moving: IconBox,
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

const categoryIconMap = {
  Electrician: "⚡", Plumber: "🚰", Carpenter: "🪵", Cleaning: "🧹",
  Painting: "🎨", "AC Repair": "❄️", "Pest Control": "🐜", Moving: "📦",
};

const Home = () => {
  const { coords, loading: geoLoading, error: geoError } = useLocation();

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

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition"
              >
                Browse Services
              </Link>
              <Link
                to="/worker-register"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  {CategoryIcon ? (
                    <CategoryIcon className="h-12 w-12 sm:h-14 sm:w-14 text-slate-900 group-hover:text-[#0056D2] transition-colors" />
                  ) : (
                    <IconBolt className="h-12 w-12 sm:h-14 sm:w-14 text-slate-900 group-hover:text-[#0056D2] transition-colors" />
                  )}
                  <div className="font-semibold text-slate-900 text-base sm:text-lg">{category}</div>
                </div>
              </Link>
            </div>

            <div className="mt-6 flex justify-center gap-8 text-sm text-gray-500">
              <div>✅ 10,000+ Users</div>
              <div>✅ Verified Professionals</div>
            </div>

          </div>
        </div>
      </section>

      {/* Near You Section */}
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
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">Get your tasks done in three simple steps.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200"></div>

            {[
              { step: "1", title: "Search", desc: "Find nearby professionals based on skills, ratings, and location.", color: "blue" },
              { step: "2", title: "Book",   desc: "Choose a time slot and confirm your booking instantly.",           color: "green" },
              { step: "3", title: "Relax",  desc: "Sit back while the expert completes your task efficiently.",       color: "yellow" },
            ].map((item) => (
              <div key={item.step} className="relative p-8 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-xl transition group">
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 bg-${item.color}-500 text-white text-sm px-3 py-1 rounded-full shadow`}>
                  {item.step}
                </div>
                <div className={`w-14 h-14 bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-bold group-hover:scale-110 transition`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Electrician', 'Plumber', 'Carpenter', 'Cleaning', 'Painting', 'AC Repair', 'Pest Control', 'Moving'].map((category, idx) => (
              <Link
                key={idx}
                to="/services"
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition"
              >
                <div className="text-3xl mb-3">{categoryIconMap[category] || '🔧'}</div>
                <span className="font-medium text-lg">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-blue-600 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Need Help Today?</h2>
        <p className="mb-6 text-blue-100">
          Book trusted professionals instantly and get your job done without hassle.
        </p>
        <Link
          to="/services"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </div>

    </div>
  );
};

export default Home;
