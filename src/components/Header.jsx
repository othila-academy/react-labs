import FavoritesBadge from './FavoritesBadge.jsx';

export default function Header({ count = 0 }) {
  return (
    <header>
      <h1>AI Coach</h1>
      <p className="tagline">Des conseils pour avancer vers ton objectif.</p>
      <FavoritesBadge count={count} />
    </header>
  );
}
