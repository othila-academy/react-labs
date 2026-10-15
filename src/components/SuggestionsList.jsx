import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext.jsx';
import SuggestionCard from './SuggestionCard.jsx';

export default function SuggestionsList({ suggestions }) {
  const { saved, save } = useContext(FavoritesContext);
  if (suggestions.length === 0) return <p className="empty">Aucune suggestion pour l'instant</p>;
  return (
    <section className="suggestions">
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          saved={saved.some((s) => s.id === suggestion.id)}
          onSave={save}
        />
      ))}
    </section>
  );
}
