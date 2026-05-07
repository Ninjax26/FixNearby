import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaGithub,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Search state
  const [query, setQuery] = useState("");

  // ✅ Handle search
  const handleSearch = () => {
    if (query.trim() !== "") {
      navigate(`/services?search=${query}`);
      setQuery("");
    }
  };

  const linkClass = (path) =>
    `transition duration-200 ${
      location.pathname === path
        ? "text-blue-400 font-medium"
        : "text-gray-300 hover:text-blue-400"
    }`;

  return (
    <footer className="bg-gray-950 text-gray-300 mt-auto border-t border-gray-800">
      
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
        
        {/* Brand */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            FixNearby
          </h2>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-sm">
            Connecting you with trusted local service providers quickly,
            safely, and efficiently — whenever you need help.
          </p>

          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <FaMapMarkerAlt />
            <span>Available in your local area</span>
          </div>

          {/* Socials */}
          <div className="flex gap-4 mt-6 text-lg">
            <a href="#" className="hover:text-blue-400 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaLinkedin />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaGithub />
            </a>
          </div>
          <div className="mt-4 text-sm text-gray-400 space-y-1">
            <div className="font-semibold text-gray-200">Trust-first marketplace</div>
            <div>Vetted pros • Secure booking • Clear pricing</div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            Navigation
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className={linkClass("/")}>Home</Link></li>
            <li><Link to="/services" className={linkClass("/services")}>Services</Link></li>
            <li><Link to="/bookings" className={linkClass("/bookings")}>Bookings</Link></li>
            <li><Link to="/about" className={linkClass("/about")}>About</Link></li>
          <h3 className="text-white font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-400">Home</a></li>
            <li><a href="/#how-it-works" className="hover:text-blue-400">How it works</a></li>
            <li><a href="/services" className="hover:text-blue-400">Services</a></li>
            <li><a href="/register" className="hover:text-blue-400">Join as a Pro</a></li>
            <li><Link to="/register" className={linkClass("/register")}>Join as a Pro</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            Support
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/help" className={linkClass("/help")}>Help Center</Link></li>
            <li><Link to="/contact" className={linkClass("/contact")}>Contact</Link></li>
            <li><Link to="/faq" className="hover:text-blue-400">FAQs</Link></li>
          </ul>
        </div>

        {/* Newsletter + Search */}
        {/* Newsletter */}
        <div className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-4 tracking-wide">
            Stay Updated
          </h3>

          <p className="text-sm text-gray-400 mb-4 max-w-sm">
            Get updates on new services, offers, and features directly to your inbox.
          </p>

          {/* 🔍 Footer Search */}
          <div className="mb-5">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search services..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition"
              >
                🔍
              </button>
            </div>
          </div>

          {/* Newsletter Form */}
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm focus:outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition"
            >
              Subscribe
            </button>
          </form>
        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className={linkClass("/privacy")}>Privacy Policy</Link></li>
            <li><Link to="/terms" className={linkClass("/terms")}>Terms of Service</Link></li>
          </ul>
          <div className="mt-5">
            <h3 className="text-white font-medium mb-3">Contact</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <div><span className="text-gray-300 font-semibold">Email:</span> support@fixnearby.com</div>
              <div><span className="text-gray-300 font-semibold">Phone:</span> +1 (000) 000-0000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
        
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} FixNearby. All rights reserved.
        </p>

        <div className="flex items-center flex-wrap justify-center gap-6 mt-3 sm:mt-0">
          
          <Link to="/privacy" className="hover:text-blue-400 transition">
            Privacy Policy
          </Link>

          <Link to="/terms" className="hover:text-blue-400 transition">
            Terms
          </Link>

          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <FaGithub />
            GitHub
          </a>

          <Link
            to="/contact"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <FaEnvelope />
            Contact
          </Link>
        <div className="flex space-x-4 mt-3 md:mt-0">
          <a href="#" className="hover:text-blue-400">Help</a>
          <a href="#" className="hover:text-blue-400">Privacy</a>
          <a href="#" className="hover:text-blue-400">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;