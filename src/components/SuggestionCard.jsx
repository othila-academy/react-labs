export default function SuggestionCard({ suggestion }) {
  return (
    <article className="card">
      <h3>{suggestion.title}</h3>
      <p>{suggestion.description}</p>
      <span className="badge">{suggestion.tag}</span>
    </article>
  );
}
