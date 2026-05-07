import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-[#0056D2]">FixNearby</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/#how-it-works"
              className="text-slate-600 hover:text-[#0056D2] font-medium transition duration-200"
            >
              How it works
            </a>
            <Link to="/services" className="text-slate-600 hover:text-[#0056D2] font-medium transition duration-200">
              Services
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/bookings" className="text-slate-600 hover:text-[#0056D2] font-medium transition duration-200">
                  Bookings
                </Link>
                <Link to="/profile" className="text-slate-600 hover:text-[#0056D2] font-medium transition duration-200">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 font-medium transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-[#0056D2] font-medium transition duration-200">
                  Log in
                </Link>
                <Link
                  to="/worker-register"
                  className="bg-[#0056D2] hover:bg-[#0047AF] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  Join as a Pro
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
