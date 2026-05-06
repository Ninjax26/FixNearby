import { Link, useLocation } from "react-router-dom";
import { FaGithub, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `transition ${
      location.pathname === path
        ? "text-blue-400 font-medium"
        : "text-gray-200 hover:text-blue-400"
    }`;

  return (
    <footer className="bg-gray-900 text-gray-200 mt-auto">
      
      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            FixNearby
          </h2>
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Connecting you with trusted local service providers quickly and easily.
          </p>
          <div className="mt-4 text-sm text-gray-400 space-y-1">
            <div className="font-semibold text-gray-200">Trust-first marketplace</div>
            <div>Vetted pros • Secure booking • Clear pricing</div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-400">Home</a></li>
            <li><a href="/#how-it-works" className="hover:text-blue-400">How it works</a></li>
            <li><a href="/services" className="hover:text-blue-400">Services</a></li>
            <li><a href="/register" className="hover:text-blue-400">Join as a Pro</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help" className={linkClass("/help")}>Help Center</Link></li>
            <li><Link to="/contact" className={linkClass("/contact")}>Contact</Link></li>
          </ul>
        </div>

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
      <div className="border-t border-gray-700" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-300">
        
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} FixNearby. All rights reserved.
        </p>

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