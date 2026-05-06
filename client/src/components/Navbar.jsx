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
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-extrabold tracking-tight text-[#0056D2]">FixNearby</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-7">
            <a
              href="/#how-it-works"
              className="text-slate-700 hover:text-[#0056D2] font-medium transition duration-200"
            >
              How it works
            </a>
            <Link to="/services" className="text-slate-700 hover:text-[#0056D2] font-medium transition duration-200">
              Services
            </Link>
            <Link to="/login" className="text-slate-700 hover:text-[#0056D2] font-medium transition duration-200">
              Log in
            </Link>
            <Link
              to="/register"
              className="bg-[#0056D2] hover:bg-[#0047AF] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors duration-200"
            >
              Join as a Pro
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
