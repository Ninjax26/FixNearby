import "./i18n/index.js";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { LocationProvider } from './context/LocationContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <LocationProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LocationProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
