import { createContext, useEffect, useState } from 'react';

const KEY = 'ai-coach:favoris';

// Les favoris gardés par le navigateur ; un contenu illisible repart d'une liste vide.
function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [saved, setSaved] = useState(readSaved);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved]);

  function save(suggestion) {
    setSaved((current) =>
      current.some((s) => s.id === suggestion.id) ? current : [...current, suggestion]
    );
  }

  function remove(id) {
    setSaved((current) => current.filter((s) => s.id !== id));
  }

  return (
    <FavoritesContext.Provider value={{ saved, save, remove }}>
      {children}
    </FavoritesContext.Provider>
  );
}
