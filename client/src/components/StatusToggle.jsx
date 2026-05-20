import { useState } from 'react';
import { updateAvailabilityStatus } from '../services/availabilityService';

const STATUSES = [
  { value: 'available', label: '🟢 Available', color: '#22c55e' },
  { value: 'busy',      label: '🟡 Busy',      color: '#f59e0b' },
  { value: 'offline',   label: '🔴 Offline',   color: '#94a3b8' },
];

const StatusToggle = ({ currentStatus = 'offline', onStatusChange }) => {
  const [status, setStatus]   = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus) => {
    if (newStatus === status || loading) return;
    setLoading(true);
    try {
      await updateAvailabilityStatus(newStatus);
      setStatus(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
    } catch (err) {
      alert('Failed to update status. Please login as a worker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '16px 20px',
      display: 'inline-flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>
        Your Availability
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => handleChange(s.value)}
            disabled={loading}
            style={{
              padding: '7px 14px',
              borderRadius: '50px',
              border: `2px solid ${status === s.value ? s.color : '#e2e8f0'}`,
              background: status === s.value ? s.color + '18' : '#f8fafc',
              color: status === s.value ? s.color : '#94a3b8',
              fontWeight: '600',
              fontSize: '13px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              transform: status === s.value ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusToggle;