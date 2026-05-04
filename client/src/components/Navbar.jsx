import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">FixNearby</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {/* TODO: Add authentication logic to toggle links */}
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Services</Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Register</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Dashboard</Link>
            <Link to="/bookings" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Bookings</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition duration-200 hover:underline underline-offset-4">Profile</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
