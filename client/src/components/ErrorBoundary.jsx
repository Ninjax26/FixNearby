import React from 'react';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const sanitizedMsg = String(error?.message || error).replace(/[^\w\s\-]/gi, '');
    console.error('[React Error Caught]:', sanitizedMsg, errorInfo);

    this.setState({ errorInfo });

    fetch('/api/logs/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message || String(error),
        stack: error.stack || '',
        componentStack: errorInfo?.componentStack || '',
        url: window.location.href
      })
    }).catch(err => console.error('Failed to report UI error to server:', err));
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    if (retryCount < MAX_RETRIES) {
      this.setState(prev => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prev.retryCount + 1
      }));
    }
  };

  handleHardReload = () => {
    window.location.reload();
  };

  handleResetApp = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { retryCount, error } = this.state;
      const canRetry = retryCount < MAX_RETRIES;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-2">
              We encountered an unexpected error while rendering this page.
            </p>
            {error?.message && (
              <p className="text-sm text-gray-400 mb-4 font-mono bg-gray-50 p-2 rounded">
                {error.message}
              </p>
            )}
            {retryCount > 0 && (
              <p className="text-xs text-amber-600 mb-4">
                Retry attempt {retryCount} of {MAX_RETRIES}
              </p>
            )}
            <div className="flex flex-col gap-2">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={this.handleHardReload}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleResetApp}
                className="text-sm text-gray-500 hover:text-gray-700 underline mt-2"
              >
                Reset Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
