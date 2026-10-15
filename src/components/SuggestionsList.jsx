import SuggestionCard from './SuggestionCard.jsx';

export default function SuggestionsList({ suggestions, savedIds = [], onSave }) {
  if (suggestions.length === 0) return <p className="empty">Aucune suggestion pour l'instant</p>;
  return (
    <section className="suggestions">
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          suggestion={suggestion}
          saved={savedIds.includes(suggestion.id)}
          onSave={onSave}
        />
      ))}
    </section>
  );
}
