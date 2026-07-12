import React, { useEffect, useState } from 'react';

// Global state / emitter for announcing messages
let announceCallback = null;

export const announceToScreenReader = (message) => {
  if (announceCallback) {
    announceCallback(message);
  }
};

const AriaAnnouncer = () => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    announceCallback = (msg) => {
      setAnnouncement(msg);
      // Clear after 3 seconds so the same announcement can be repeated if necessary
      setTimeout(() => setAnnouncement(''), 3000);
    };
    return () => {
      announceCallback = null;
    };
  }, []);

  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
};

export default AriaAnnouncer;
