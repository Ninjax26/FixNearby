import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

export const GlobalStateContext = createContext(null);

export const GlobalStateProvider = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const activeFilters = {
    category: '',
    rating: 0,
    searchQuery: ''
  };

  const setActiveFilters = () => {};

  return (
    <GlobalStateContext.Provider value={{
      currentUser: user,
      setCurrentUser: () => {},
      activeFilters,
      setActiveFilters,
      logout,
      isAuthenticated
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const ctx = useContext(GlobalStateContext);
  if (!ctx) {
    throw new Error('useGlobalState must be used inside <GlobalStateProvider>');
  }
  return ctx;
};

export default GlobalStateContext;
