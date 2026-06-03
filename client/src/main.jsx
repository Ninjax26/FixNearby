import "./i18n/index.js";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LocationProvider } from './context/LocationContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
