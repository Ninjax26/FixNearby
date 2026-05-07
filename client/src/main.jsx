import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LocationProvider } from './context/LocationContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocationProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LocationProvider>
    <AuthProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </AuthProvider>
  </React.StrictMode>,
)
