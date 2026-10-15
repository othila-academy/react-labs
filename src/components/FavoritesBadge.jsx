// Le nombre de favoris, dit en toutes lettres : « Aucun favori », « 1 favori », « N favoris ».
export default function FavoritesBadge({ count = 0 }) {
  const label = count === 0 ? 'Aucun favori' : count === 1 ? '1 favori' : `${count} favoris`;
  return <p className="favorites-badge">{label}</p>;
}
