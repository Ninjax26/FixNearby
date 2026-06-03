import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const SEARCH_HISTORY_KEY = 'fixnearby_search_history';
const FAVORITE_SEARCHES_KEY = 'fixnearby_favorite_searches';
const MAX_HISTORY_ITEMS = 10;

/**
 * Custom hook for advanced search functionality with debouncing,
 * history tracking, and URL parameter synchronization
 */
const useSearch = (initialFilters = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('q') || initialFilters.query || ''
  );
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  
  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || initialFilters.category || 'All',
    minPrice: searchParams.get('minPrice') || initialFilters.minPrice || '',
    maxPrice: searchParams.get('maxPrice') || initialFilters.maxPrice || '',
    minRating: searchParams.get('minRating') || initialFilters.minRating || '',
    maxDistance: searchParams.get('maxDistance') || initialFilters.maxDistance || '',
    availability: searchParams.get('availability') || initialFilters.availability || 'all',
    sortBy: searchParams.get('sort') || initialFilters.sortBy || 'distance',
  });
  
  // History and favorites
  const [searchHistory, setSearchHistory] = useState([]);
  const [favoriteSearches, setFavoriteSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Refs for debouncing
  const debounceTimerRef = useRef(null);
  
  // Load search history and favorites from localStorage
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
      const favorites = JSON.parse(localStorage.getItem(FAVORITE_SEARCHES_KEY)) || [];
      setSearchHistory(history);
      setFavoriteSearches(favorites);
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  }, []);
  
  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);
  
  // Sync URL parameters with state
  useEffect(() => {
    const params = {};
    
    if (debouncedQuery) params.q = debouncedQuery;
    if (filters.category !== 'All') params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.maxDistance) params.maxDistance = filters.maxDistance;
    if (filters.availability !== 'all') params.availability = filters.availability;
    if (filters.sortBy !== 'distance') params.sort = filters.sortBy;
    
    setSearchParams(params, { replace: true });
  }, [debouncedQuery, filters, setSearchParams]);
  
  // Add search to history
  const addToHistory = useCallback((query, appliedFilters) => {
    if (!query.trim()) return;
    
    const searchEntry = {
      query: query.trim(),
      filters: { ...appliedFilters },
      timestamp: new Date().toISOString(),
    };
    
    try {
      let history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
      
      // Remove duplicate if exists
      history = history.filter(item => 
        item.query.toLowerCase() !== query.toLowerCase()
      );
      
      // Add to beginning
      history.unshift(searchEntry);
      
      // Keep only last 10 searches
      history = history.slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
      setSearchHistory(history);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, []);
  
  // Clear search history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    setSearchHistory([]);
  }, []);
  
  // Remove single history item
  const removeHistoryItem = useCallback((timestamp) => {
    try {
      let history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
      history = history.filter(item => item.timestamp !== timestamp);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
      setSearchHistory(history);
    } catch (error) {
      console.error('Error removing history item:', error);
    }
  }, []);
  
  // Save favorite search
  const saveFavoriteSearch = useCallback((name, query, appliedFilters) => {
    const favorite = {
      id: Date.now().toString(),
      name: name || query,
      query,
      filters: { ...appliedFilters },
      timestamp: new Date().toISOString(),
    };
    
    try {
      let favorites = JSON.parse(localStorage.getItem(FAVORITE_SEARCHES_KEY)) || [];
      favorites.unshift(favorite);
      localStorage.setItem(FAVORITE_SEARCHES_KEY, JSON.stringify(favorites));
      setFavoriteSearches(favorites);
      return true;
    } catch (error) {
      console.error('Error saving favorite search:', error);
      return false;
    }
  }, []);
  
  // Remove favorite search
  const removeFavoriteSearch = useCallback((id) => {
    try {
      let favorites = JSON.parse(localStorage.getItem(FAVORITE_SEARCHES_KEY)) || [];
      favorites = favorites.filter(item => item.id !== id);
      localStorage.setItem(FAVORITE_SEARCHES_KEY, JSON.stringify(favorites));
      setFavoriteSearches(favorites);
    } catch (error) {
      console.error('Error removing favorite search:', error);
    }
  }, []);
  
  // Load favorite search
  const loadFavoriteSearch = useCallback((favorite) => {
    setSearchQuery(favorite.query);
    setFilters(favorite.filters);
  }, []);
  
  // Update single filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);
  
  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      category: 'All',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      maxDistance: '',
      availability: 'all',
      sortBy: 'distance',
    });
    setSearchQuery('');
  }, []);
  
  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return (
      filters.category !== 'All' ||
      filters.minPrice !== '' ||
      filters.maxPrice !== '' ||
      filters.minRating !== '' ||
      filters.maxDistance !== '' ||
      filters.availability !== 'all' ||
      debouncedQuery !== ''
    );
  }, [filters, debouncedQuery]);
  
  // Get shareable URL
  const getShareableUrl = useCallback(() => {
    const params = new URLSearchParams();
    
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (filters.category !== 'All') params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.maxDistance) params.set('maxDistance', filters.maxDistance);
    if (filters.availability !== 'all') params.set('availability', filters.availability);
    if (filters.sortBy !== 'distance') params.set('sort', filters.sortBy);
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [debouncedQuery, filters]);
  
  return {
    // Search state
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    
    // Filters
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    hasActiveFilters: hasActiveFilters(),
    
    // History
    searchHistory,
    addToHistory,
    clearHistory,
    removeHistoryItem,
    
    // Favorites
    favoriteSearches,
    saveFavoriteSearch,
    removeFavoriteSearch,
    loadFavoriteSearch,
    
    // Suggestions
    showSuggestions,
    setShowSuggestions,
    
    // Utilities
    getShareableUrl,
  };
};

export default useSearch;
