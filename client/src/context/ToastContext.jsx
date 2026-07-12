import { createContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

const TOAST_DURATIONS = {
  success: 3000,
  error: 4000,
  warning: 3500,
  info: 2800,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const showToast = useCallback((messageOrToast, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);

    let message, resolvedType;
    if (typeof messageOrToast === 'object' && messageOrToast !== null) {
      message = String(messageOrToast.message ?? '');
      resolvedType = messageOrToast.type || type;
    } else {
      message = String(messageOrToast ?? '');
      resolvedType = type;
    }

    if (!message) return id;

    const toast = { id, message, type: resolvedType };
    setToasts(prev => [...prev, toast]);

    const duration = TOAST_DURATIONS[resolvedType] ?? 3000;
    timersRef.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete timersRef.current[id];
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
