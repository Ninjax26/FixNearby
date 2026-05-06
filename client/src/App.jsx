import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LocationBanner from './components/LocationBanner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import WorkerProfile from './pages/WorkerProfile';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import WorkerRegister from './pages/WorkerRegister';
import HelpCenter from './pages/HelpCenter';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

function AppShell() {
  const location = useLocation();
  const showLocationBanner = location.pathname !== '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {showLocationBanner ? <LocationBanner /> : null}
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
          {/* TODO: Add more routes here */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <LocationBanner />
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
            {/* TODO: Add more routes here */}
          </Routes>
        </main>
        <Footer />
      </div>
      <AppShell />
    </Router>
  );
}

export default App;
