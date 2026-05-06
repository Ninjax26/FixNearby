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
          <div className="hidden md:flex items-center space-x-6">
            {/* TODO: Add authentication logic to toggle links */}
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Services</Link>
            <Link to="/worker-register" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4"> Become a Worker</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Register</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Dashboard</Link>
            <Link to="/bookings" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Bookings</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Profile</Link>
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
