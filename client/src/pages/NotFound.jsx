import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const quickLinks = [
    { label: t("nav.services"), to: "/services", icon: "🛠️" },
    { label: t("nav.myBookings"), to: "/bookings", icon: "📅" },
    { label: t("footer.faq"), to: "/faq", icon: "❓" },
  ];

  return (
    <main
      id="main-content"
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center px-4 py-20 text-center overflow-hidden"
    >
      {/* Floating wrench illustration */}
      <div
        className={`transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
        style={{ animation: mounted ? "float 3s ease-in-out infinite" : "none" }}
      >
        <div className="w-24 h-24 mx-auto rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-lg mb-8">
          <svg
            className="w-12 h-12 text-[#0056D2]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
      </div>

      {/* 404 heading */}
      <div
        className={`transition-all duration-700 delay-100 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-[9rem] sm:text-[12rem] font-extrabold leading-none tracking-tighter bg-gradient-to-b from-[#0056D2] to-blue-300 bg-clip-text text-transparent select-none">
          404
        </h1>
      </div>

      {/* Message */}
      <div
        className={`transition-all duration-700 delay-200 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
          {t("errors.pageNotFound")}
        </h2>
        <p className="mt-3 text-slate-500 max-w-md mx-auto text-base leading-relaxed">
          {t("errors.pageNotFoundDesc")}
        </p>
      </div>

      {/* Primary CTA */}
      <div
        className={`mt-8 transition-all duration-700 delay-300 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0056D2] hover:bg-[#0047AF] text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {t("errors.backHome")}
        </button>
      </div>

      {/* Quick links */}
      <div
        className={`mt-12 transition-all duration-700 delay-[400ms] ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
          {t("notFound.orExplore")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {quickLinks.map(({ label, to, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-[#0056D2] hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Floating keyframe animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
};

export default NotFound;