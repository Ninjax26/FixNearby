import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SOSButton.css";
// emergency categories that show up when SOS is triggered
const EMERGENCY_TYPES = [
  { label: "⚡ Power Outage", category: "Electrician" },
  { label: "💧 Water Leak", category: "Plumber" },
  { label: "🔥 Gas Issue", category: "Plumber" },
  { label: "❄️ AC Breakdown", category: "AC Technician" },
  { label: "🔧 Appliance Failure", category: "Appliance Repair" },
];
const SOSButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const handleEmergencySelect = (category) => {
    setIsOpen(false);
    navigate(`/services?category=${category}&urgent=true`);
  };
  return (
    <div className="sos-wrapper">
      {isOpen && (
        <div className="sos-panel">
          <p className="sos-panel-title">🚨 Select Emergency Type</p>
          <ul className="sos-options">
            {EMERGENCY_TYPES.map((type) => (
              <li key={type.category}>
                <button
                  className="sos-option-btn"
                  onClick={() => handleEmergencySelect(type.category)}
                >
                  {type.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            className="sos-cancel-btn"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {/* the main SOS button */}
      <button
        className={`sos-btn ${isOpen ? "sos-btn--active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Emergency SOS"
      >
        <span className="sos-pulse-ring" />
        <span className="sos-btn-inner">
          🆘
          <span className="sos-btn-label">SOS</span>
        </span>
      </button>
    </div>
  );
};
export default SOSButton;