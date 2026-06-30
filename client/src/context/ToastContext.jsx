import { createContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((messageOrToast, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast =
      typeof messageOrToast === 'object' && messageOrToast !== null
        ? {
            id,
            message: messageOrToast.message,
            type: messageOrToast.type || type,
          }
        : { id, message: messageOrToast, type };

    setToasts(prev => [...prev, toast]);

    // Auto-hide after 2.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
