import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

const STORAGE_KEY = 'rr-favorites';

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(load);

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)); }
    catch { /* quota exceeded – ignore */ }
  }, [favorites]);

  const isFavorite = useCallback((id) => favorites.some(f => f.id === id), [favorites]);

  const addFavorite = useCallback((item) => {
    // item: { id, type ('program'|'episode'), title, subtitle, image, slug }
    setFavorites(prev => {
      if (prev.some(f => f.id === item.id)) return prev;
      return [{ ...item, savedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  }, []);

  const toggleFavorite = useCallback((item) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === item.id);
      if (exists) return prev.filter(f => f.id !== item.id);
      return [{ ...item, savedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};
