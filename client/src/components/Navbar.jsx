import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LanguageToggle from "./LanguageToggle";
import { useAuth } from '../context/AuthContext';

const WrenchIcon = () => (
  <svg
    className="w-4 h-4 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path;

  const desktopLinkCls = (path) =>
    `relative pb-0.5 text-sm font-medium transition-colors duration-200 ` +
    `after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 ` +
    `after:h-0.5 after:rounded-full after:bg-[#0056D2] after:transition-transform after:duration-200 ` +
    (isActive(path)
      ? 'text-[#0056D2] after:scale-x-100'
      : 'text-slate-600 hover:text-[#0056D2] after:scale-x-0 hover:after:scale-x-100');

  const mobileLinkCls = (path) =>
    `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ` +
    (isActive(path)
      ? 'text-[#0056D2] bg-blue-50'
      : 'text-slate-600 hover:text-[#0056D2] hover:bg-blue-50');

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-lg shadow-slate-200/50'
        : 'bg-white'
    }`}>
      {/* Top gradient accent line */}
      <div className="h-0.5 bg-gradient-to-r from-[#0056D2] via-blue-400 to-cyan-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0056D2] to-cyan-400 flex items-center justify-center shadow-sm group-hover:shadow-blue-300/50 group-hover:scale-105 transition-all duration-200">
              <WrenchIcon />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-[#0056D2]">Fix</span>
              <span className="text-slate-800">Nearby</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-7">
            <a href="/#how-it-works"
              className="relative pb-0.5 text-sm font-medium text-slate-600 hover:text-[#0056D2] transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-[#0056D2] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200">
              How it works
            </a>
            <Link to="/services" className={desktopLinkCls('/services')}>Services</Link>
            <LanguageToggle />

            {isAuthenticated ? (
              <>
                <Link to="/bookings" className={desktopLinkCls('/bookings')}>Bookings</Link>

                {/* User avatar + hover dropdown */}
                <div className="relative group ml-1">
                  <button className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all duration-200 cursor-pointer">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0056D2] to-cyan-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[80px] truncate">
                      {user?.name ?? 'Account'}
                    </span>
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200 shrink-0"
                      fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full pt-2 pointer-events-none group-hover:pointer-events-auto">
                    <div className="w-52 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 p-1.5
                      opacity-0 invisible translate-y-1
                      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                      transition-all duration-200">
                      <Link to="/profile"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-[#0056D2] hover:bg-blue-50 transition-colors duration-150">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                        Profile
                      </Link>
                      <Link to="/bookings"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-[#0056D2] hover:bg-blue-50 transition-colors duration-150">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
                          <path d="M8 3.5v4M16 3.5v4M4 9h16" />
                        </svg>
                        My Bookings
                      </Link>
                      <div className="my-1 h-px bg-slate-100 mx-2" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors duration-150">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5 ml-1">
                <Link to="/worker/register"
                  className="text-sm font-semibold text-[#0056D2] border border-[#0056D2]/25 bg-blue-50/70 hover:bg-blue-100 hover:border-[#0056D2]/50 px-4 py-2.5 rounded-xl transition-all duration-200">
                  Join as Pro
                </Link>
                <Link to="/register"
                  className="text-sm font-semibold text-white bg-[#0056D2] hover:bg-[#0047AF] px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-300/40 transition-all duration-200">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-[#0056D2] hover:bg-blue-50 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div className={`md:hidden border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${
        menuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-3 space-y-1 bg-white">
          <a href="/#how-it-works" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-[#0056D2] hover:bg-blue-50 transition-colors duration-150">
            How it works
          </a>
          <Link to="/services" className={mobileLinkCls('/services')}>Services</Link>

          {isAuthenticated ? (
            <>
              <Link to="/bookings" className={mobileLinkCls('/bookings')}>Bookings</Link>
              <Link to="/profile" className={mobileLinkCls('/profile')}>Profile</Link>
              <div className="mt-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 px-4 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0056D2] to-cyan-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-150">
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 mt-2 border-t border-slate-100 space-y-2">
              <Link to="/register"
                className="flex justify-center px-4 py-3 rounded-xl bg-[#0056D2] text-sm font-semibold text-white hover:bg-[#0047AF] transition-colors duration-150">
                Get Started
              </Link>
              <Link to="/worker/register"
                className="flex justify-center px-4 py-3 rounded-xl border border-[#0056D2]/25 bg-blue-50/70 text-sm font-semibold text-[#0056D2] hover:bg-blue-100 transition-colors duration-150">
                Join as Pro
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
