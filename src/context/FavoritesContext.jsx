import { createContext, useEffect, useReducer } from 'react';
import favoritesReducer from './favoritesReducer.js';

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
  const [saved, dispatch] = useReducer(favoritesReducer, undefined, readSaved);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved]);

  const save = (suggestion) => dispatch({ type: 'save', suggestion });
  const remove = (id) => dispatch({ type: 'remove', id });
  const clear = () => dispatch({ type: 'clear' });

  return (
    <FavoritesContext.Provider value={{ saved, save, remove, clear }}>
      {children}
    </FavoritesContext.Provider>
  );
}
