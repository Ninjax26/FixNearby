import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import LocationBanner from './components/LocationBanner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import WorkerProfile from './pages/WorkerProfile';
import Profile from './pages/Profile';
import Contact from "./components/Contact";
import Bookings from './pages/Bookings';
import Feedback from "./pages/Feedback";
import WorkerRegister from './pages/WorkerRegister';
import HelpCenter from './pages/HelpCenter';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import BackToTop from './components/BackToTop';

function AppContent() {
  const location = useLocation();
  // Only show LocationBanner if not on the Home page
  const showLocationBanner = location.pathname !== '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {showLocationBanner && <LocationBanner />}
      <Toast />
      <main className="flex-grow bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/worker/:id" element={<WorkerProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/worker-register" element={<WorkerRegister />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/faq" element={<FAQ />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BackToTop /> 
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

