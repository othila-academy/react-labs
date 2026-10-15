import { expect, test } from 'vitest';
import { load, show } from '../../../shared/components.jsx';
import { KEY, focus, walk } from './helpers.jsx';

// Le texte du badge : l'élément du <header> qui parle de favori(s), ou null.
function badgeText() {
  const header = document.querySelector('header');
  if (!header) return null;
  const leaves = [...header.querySelectorAll('*')].filter((el) => el.children.length === 0);
  return leaves.map((el) => el.textContent.trim()).find((text) => /favori/i.test(text)) ?? null;
}

test('header-seul', async () => {
  localStorage.setItem(KEY, JSON.stringify([walk, focus]));
  const Header = await load(
    () => import('@client/src/components/Header.jsx'),
    'src/components/Header.jsx'
  );
  show(<Header />, 'src/components/Header.jsx');
  expect(
    badgeText(),
    `Rendu seul, sans prop, le Header affiche « ${badgeText()} » alors que le navigateur garde deux favoris : FavoritesBadge doit lire saved dans le contexte (useContext(FavoritesContext)).`
  ).toBe('2 favoris');
});
