import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext.jsx';

// Le nombre de favoris, lu dans le contexte et dit en toutes lettres : « Aucun favori », « 1 favori », « N favoris ».
export default function FavoritesBadge() {
  const { saved } = useContext(FavoritesContext);
  const count = saved.length;
  const label = count === 0 ? 'Aucun favori' : count === 1 ? '1 favori' : `${count} favoris`;
  return <p className="favorites-badge">{label}</p>;
}
