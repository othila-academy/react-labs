import { expect, test } from 'vitest';
import { badgeText, load, show } from '../../../shared/components.jsx';
import { KEY, focus, walk } from './helpers.jsx';

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
