import { createContext, useContext, useState, useCallback } from 'react';

/**
 * AuthContext
 * Provides { user, token, login, logout, isAuthenticated } to the entire tree.
 *
 * user  – { _id, name, email } or null
 * token – JWT string or null
 * login(userData) – persists user + token to state and localStorage
 * logout()        – clears state and localStorage
 */
const AuthContext = createContext(null);

const STORAGE_KEY = 'fixnearby_user';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => loadFromStorage());

  const login = useCallback((userData) => {
    // userData = { _id, name, email, token }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setAuthData(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthData(null);
  }, []);

  const value = {
    user: authData ? { _id: authData._id, name: authData.name, email: authData.email } : null,
    token: authData?.token ?? null,
    isAuthenticated: !!authData?.token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};

export default AuthContext;
