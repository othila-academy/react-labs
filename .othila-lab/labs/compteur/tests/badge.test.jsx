import { expect, test } from 'vitest';
import { load } from '../../../shared/components.jsx';

test('badge-existe', async () => {
  const FavoritesBadge = await load(
    () => import('@client/src/components/FavoritesBadge.jsx'),
    'src/components/FavoritesBadge.jsx'
  );
  expect(typeof FavoritesBadge).toBe('function');
});
