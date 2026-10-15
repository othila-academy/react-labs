export default function SuggestionCard({ suggestion, saved = false, onSave }) {
  return (
    <article className="card">
      <h3>{suggestion.title}</h3>
      <p>{suggestion.description}</p>
      <span className="badge">{suggestion.tag}</span>
      <button type="button" disabled={saved} onClick={() => onSave(suggestion)}>
        {saved ? 'Sauvegardé' : 'Sauvegarder'}
      </button>
    </article>
  );
}
