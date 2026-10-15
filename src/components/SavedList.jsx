export default function SavedList({ saved, onRemove }) {
  return (
    <section>
      <h2>Favoris</h2>
      {saved.length === 0 ? (
        <p className="empty">Aucun favori pour l'instant</p>
      ) : (
        <ul className="saved">
          {saved.map((suggestion) => (
            <li key={suggestion.id}>
              {suggestion.title}
              <button type="button" onClick={() => onRemove(suggestion.id)}>
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
