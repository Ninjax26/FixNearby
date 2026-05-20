// client/src/components/AvailabilityBadge.jsx

const STATUS_CONFIG = {
  available: { color: '#22c55e', bg: '#dcfce7', border: '#bbf7d0', label: 'Available',  dot: '#16a34a' },
  busy:      { color: '#f59e0b', bg: '#fef9c3', border: '#fde68a', label: 'Busy',       dot: '#d97706' },
  offline:   { color: '#94a3b8', bg: '#f1f5f9', border: '#e2e8f0', label: 'Offline',    dot: '#64748b' },
};

const AvailabilityBadge = ({ status = 'offline', lastActive, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.offline;

  const sizes = {
    sm: { fontSize: '11px', padding: '2px 8px', dotSize: '7px' },
    md: { fontSize: '13px', padding: '4px 12px', dotSize: '9px' },
    lg: { fontSize: '15px', padding: '6px 16px', dotSize: '11px' },
  };
  const s = sizes[size];

  const formatLastActive = (date) => {
    if (!date) return null;
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '50px',
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: '600',
        color: config.color,
      }}>
        {/* Animated dot */}
        <span style={{ position: 'relative', display: 'inline-flex' }}>
          {status === 'available' && (
            <span style={{
              position: 'absolute',
              width: s.dotSize,
              height: s.dotSize,
              borderRadius: '50%',
              background: config.dot,
              opacity: 0.4,
              animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
            }} />
          )}
          <span style={{
            width: s.dotSize,
            height: s.dotSize,
            borderRadius: '50%',
            background: config.dot,
            display: 'inline-block',
          }} />
        </span>
        {config.label}
      </span>
      {lastActive && status !== 'available' && (
        <span style={{ fontSize: '10px', color: '#94a3b8', paddingLeft: '4px' }}>
          Last active: {formatLastActive(lastActive)}
        </span>
      )}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AvailabilityBadge;