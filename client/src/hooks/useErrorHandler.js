import { useCallback, useState } from 'react';

const INITIAL_STATE = { error: null, context: null, dismissed: false };

const useErrorHandler = (options = {}) => {
  const { onError, logToServer = true } = options;
  const [state, setState] = useState(INITIAL_STATE);

  const handleError = useCallback((error, context = null) => {
    const errorObj = {
      message: error?.message || String(error),
      stack: error?.stack || null,
      context,
      timestamp: new Date().toISOString()
    };

    setState({ error: errorObj, context, dismissed: false });

    if (logToServer) {
      try {
        fetch('/api/logs/error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: errorObj.message,
            stack: errorObj.stack,
            context: JSON.stringify(context),
            url: window.location.href,
            source: 'useErrorHandler'
          })
        }).catch(() => {});
      } catch {}
    }

    if (onError && typeof onError === 'function') {
      onError(errorObj);
    }

    return errorObj;
  }, [onError, logToServer]);

  const dismissError = useCallback(() => {
    setState(prev => ({ ...prev, dismissed: true }));
  }, []);

  const clearError = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    error: state.error,
    context: state.context,
    dismissed: state.dismissed,
    handleError,
    dismissError,
    clearError
  };
};

export default useErrorHandler;
