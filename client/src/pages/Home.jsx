import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

const categoryIconMap = workerIconMap;

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
          <div className="relative pb-24 sm:pb-28">
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

            <div className="absolute left-1/2 top-[220px] sm:top-[260px] lg:top-[290px] -translate-x-1/2 w-full px-5 sm:px-8">
              <div className="mx-auto w-full max-w-[560px] rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-[0_14px_32px_rgba(15,23,42,0.18)] px-7 py-7 sm:px-10 sm:py-9">
                <div className="text-center">

  {/* Trust Badge */}
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-5">
    ⭐ Trusted by 10,000+ homeowners
  </div>

  {/* Main Heading */}
  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
    Reliable Home Services,
    <span className="block text-[#0056D2]">
      Right When You Need Them
    </span>
  </h1>

  {/* Enhanced Description */}
  <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto">
    Find verified electricians, plumbers, cleaners, and skilled professionals 
    near you — with fast booking, transparent pricing, and trusted service.
  </p>

  {/* Quick Trust Points */}
  <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-700">

    <span className="bg-slate-100 px-4 py-2 rounded-full">
      ✔ Verified Experts
    </span>

    <span className="bg-slate-100 px-4 py-2 rounded-full">
      ⚡ Fast Booking
    </span>

    <span className="bg-slate-100 px-4 py-2 rounded-full">
      📍 Nearby Services
    </span>

  </div>

</div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center rounded-lg bg-[#0056D2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0047AF] transition"
                  >
                    Find a Pro
                  </Link>
                  <Link
                    to="/worker-register"
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

      {/* Trust Signals Section */}
<section className="py-20 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Heading */}
    <div className="text-center max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-sm font-semibold">
        ⭐ Trusted By Thousands
      </div>

      <h2 className="mt-5 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
        Why People Choose{" "}
        <span className="text-[#0056D2]">FixNearby</span>
      </h2>

      <p className="mt-5 text-lg text-slate-600 leading-relaxed">
        We focus on safety, reliability, and quality service so customers can
        book professionals confidently.
      </p>
    </div>

    {/* Stats */}
    <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">

      {[
        {
          number: "10K+",
          label: "Happy Customers",
          icon: "😊",
        },
        {
          number: "500+",
          label: "Verified Professionals",
          icon: "🛠️",
        },
        {
          number: "24/7",
          label: "Customer Support",
          icon: "📞",
        },
        {
          number: "4.9★",
          label: "Average Rating",
          icon: "⭐",
        },
      ].map((item, idx) => (

        <div
          key={idx}
          className="group bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >

          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
            {item.icon}
          </div>

          <div className="text-4xl font-extrabold text-slate-900">
            {item.number}
          </div>

          <p className="mt-2 text-slate-500 font-medium">
            {item.label}
          </p>

        </div>
      ))}
    </div>

    {/* Features */}
    <div className="mt-20 grid md:grid-cols-3 gap-8">

      {[
        {
          title: "Verified Professionals",
          desc: "Every worker profile is reviewed and verified for better safety and trust.",
          icon: "🛡️",
        },
        {
          title: "Secure Booking",
          desc: "Simple and secure booking process with transparent communication.",
          icon: "🔒",
        },
        {
          title: "Fast Response",
          desc: "Connect instantly with nearby professionals available in your area.",
          icon: "⚡",
        },
      ].map((feature, idx) => (

        <div
          key={idx}
          className="group bg-white rounded-3xl border border-slate-200 p-8 hover:border-[#0056D2]/40 hover:shadow-xl transition-all duration-300"
        >

          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            {feature.title}
          </h3>

          <p className="mt-4 text-slate-600 leading-relaxed">
            {feature.desc}
          </p>

        </div>
      ))}
    </div>

    {/* Mini Testimonials */}
    <div className="mt-20">

      <div className="text-center mb-12">
        <h3 className="text-3xl font-extrabold text-slate-900">
          What Customers Say
        </h3>

        <p className="mt-3 text-slate-500">
          Real feedback from happy users.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {[
          {
            name: "Amit Sharma",
            text: "Booking an electrician was incredibly fast and hassle-free. Great experience!",
          },
          {
            name: "Priya Singh",
            text: "The cleaner arrived on time and did an amazing job. Highly recommended.",
          },
          {
            name: "Rahul Verma",
            text: "Very professional platform with trustworthy workers and smooth booking.",
          },
        ].map((review, idx) => (

          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-lg transition"
          >

            <div className="flex text-yellow-400 text-lg mb-4">
              ★★★★★
            </div>

            <p className="text-slate-600 leading-relaxed">
              "{review.text}"
            </p>

            <div className="mt-6 font-bold text-slate-900">
              {review.name}
            </div>

          </div>
        ))}
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

            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
              <span className="block">Find Reliable Workers</span>
              <span className="block text-blue-600">In Your Neighborhood</span>
            </h1>

            <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500 sm:text-lg md:text-xl">
              FixNearby connects you with trusted electricians, plumbers, carpenters, and more. Fast, secure, and hassle-free.
            </p>

            {/* 🔍 Search Bar (Quick Access) */}
<div className="mt-6 max-w-2xl mx-auto">

  <div className="flex items-center bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition">

    <input
      type="text"
      placeholder="Search services like Electrician, Plumber..."
      className="flex-1 px-5 py-3 outline-none text-gray-700"
    />

    <Link
      to="/services"
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium transition"
    >
      Search
    </Link>

  </div>

  {/* ⚡ Quick Access Buttons */}
  <div className="mt-4 flex flex-wrap justify-center gap-3">
    {["Electrician", "Plumber", "Cleaner", "AC Technician"].map((item) => (
      <Link
        key={item}
        to={`/services?category=${item}`}
        className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-sm rounded-full transition"
      >
        {item}
      </Link>
    ))}
  </div>

</div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition"
              >
                Browse Services
              </Link>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-14 text-center relative">
            <div className="hidden md:block absolute top-[46px] left-0 w-full h-px bg-slate-200" />

            {[
              { step: '1', title: 'Search & Select', desc: 'Browse profiles, read reviews, and choose the best fit.', IconComp: IconSearch },
              { step: '2', title: 'Book Directly', desc: 'Schedule appointments instantly based on real-time availability.', IconComp: IconCalendar },
              { step: '3', title: 'Relax & Enjoy', desc: 'Let the expert handle the job with peace of mind.', IconComp: IconCheckCircle },
            ].map((s) => (
              <div key={s.step} className="relative">
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

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 mb-16">
            Get your job done in 3 simple steps
          </p>

          <div className="max-w-6xl mx-auto mt-10 grid md:grid-cols-3 gap-8">
    {[
      { step: "1", title: "Search", desc: "Find skilled workers near you" },
      { step: "2", title: "Book", desc: "Choose time and confirm instantly" },
      { step: "3", title: "Relax", desc: "Get your job done stress-free" },
    ].map((s) => (
      <div key={s.step} className="p-6 border rounded-xl hover:shadow-lg transition">
        <div className="text-blue-600 font-bold text-xl">{s.step}</div>
        <h3 className="font-semibold mt-2">{s.title}</h3>
        <p className="text-gray-500 mt-1">{s.desc}</p>
      </div>
    ))}
    </div>
      {/* ── Near You Section ── */}
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

      {/* How it Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Get your tasks done in three simple steps.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 text-center">

            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200"></div>

            {/* Step 1 */}
            <div className="relative p-8 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-xl transition group">

              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow">
                1
              </div>

              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-bold group-hover:scale-110 transition">
                1
              </div>

              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-500">
                Find the right professional based on reviews, skills, and proximity.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-xl transition group">

              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm px-3 py-1 rounded-full shadow">
                2
              </div>

              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-bold group-hover:scale-110 transition">
                2
              </div>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                step: "1",
                title: "Search",
                desc: "Find nearby professionals based on skills, ratings, and location.",
                color: "blue"
              },
              {
                step: "2",
                title: "Book",
                desc: "Choose a time slot and confirm your booking instantly.",
                color: "green"
              },
              {
                step: "3",
                title: "Relax",
                desc: "Sit back while the expert completes your task efficiently.",
                color: "yellow"
              }
            ].map((item, i) => (

              <div key={i} className="p-8 rounded-2xl border hover:shadow-xl transition group">

                <div className={`w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center text-white text-lg font-bold bg-${item.color}-500 group-hover:scale-110 transition`}>
                  {item.step}
                </div>

                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
            {/* Step 3 */}
            <div className="relative p-8 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-xl transition group">

              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-sm px-3 py-1 rounded-full shadow">
                3
              </div>

              </div>

            ))}

          </div>
        </div>
      </div>

      {/* Popular Categories */}
      {/* Popular Categories */}
<div className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
      Popular Categories
    </h2>

    <p className="text-center text-gray-500 mb-12">
      Explore services based on your needs — from home repairs to cleaning and maintenance.
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

      {[
        {
          name: "Electrician",
          icon: "⚡",
          desc: "Wiring, repairs & installations"
        },
        {
          name: "Plumber",
          icon: "🚰",
          desc: "Pipes, leaks & fittings"
        },
        {
          name: "Carpenter",
          icon: "🪵",
          desc: "Furniture & woodwork"
        },
        {
          name: "Cleaner",
          icon: "🧹",
          desc: "Home & office cleaning"
        },
        {
          name: "Painter",
          icon: "🎨",
          desc: "Wall painting & polishing"
        },
        {
          name: "AC Repair",
          icon: "❄️",
          desc: "Cooling system service"
        },
        {
          name: "Pest Control",
          icon: "🐜",
          desc: "Remove insects & rodents"
        },
        {
          name: "Mechanic",
          icon: "🔧",
          desc: "Vehicle & machine repair"
        }
      ].map((category, idx) => (

        <Link
          key={idx}
          to={`/services?category=${category.name}`}
          className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center hover:border-blue-500 hover:shadow-xl transition-all duration-300"
        >

          <div className="text-4xl mb-4 group-hover:scale-110 transition">
            {category.icon}
          </div>

          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition">
            {category.name}
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            {category.desc}
          </p>

        </Link>
      ))}

    </div>

  </div>
</div>

      {/* Final CTA Section */}
      <div className="py-20 bg-blue-600 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Need Help Today?
        </h2>
        <p className="mb-6 text-blue-100">
          Book trusted professionals instantly and get your job done without hassle.
        </p>
        
        <Link
          to="/services"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
        <Link
  to="/feedback"
  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
>
  Give Feedback
</Link>
      </div>

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
              to="/worker-register"
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
