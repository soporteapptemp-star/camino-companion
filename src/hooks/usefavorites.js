import { useState, useEffect } from 'react';

const STORAGE_KEY = 'camino_companion_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Guardado automático en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Manejo silencioso de cuota de disco
    }
  }, [favorites]);

  // Sincronización en tiempo real si se modifica en otra pestaña/instancia PWA
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setFavorites(JSON.parse(e.newValue));
        } catch {
          // Fallback silencioso
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleFavorite = (poiId) => {
    setFavorites((prev) =>
      prev.includes(poiId) ? prev.filter((id) => id !== poiId) : [...prev, poiId]
    );
  };

  const isFavorite = (poiId) => favorites.includes(poiId);

  return { favorites, toggleFavorite, isFavorite };
}