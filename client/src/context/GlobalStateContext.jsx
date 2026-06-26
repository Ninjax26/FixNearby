import { createContext, useState, useEffect } from 'react';

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    rating: 0,
    searchQuery: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('fixnearby_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('fixnearby_user');
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('fixnearby_user');
    setCurrentUser(null);
  };

  return (
    <GlobalStateContext.Provider value={{ currentUser, setCurrentUser, activeFilters, setActiveFilters, logout }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
