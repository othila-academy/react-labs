import { createContext, useContext, useEffect, useReducer } from 'react';
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

// useFavorites() : les favoris et leurs actions, { saved, save, remove, clear } ; hors d'un FavoritesProvider, une
// erreur qui le dit, plutôt qu'un plantage sur null plus loin.
export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error('useFavorites doit être utilisé sous un FavoritesProvider');
  return value;
}
