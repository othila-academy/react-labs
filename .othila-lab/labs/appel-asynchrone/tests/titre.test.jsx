import { screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { load, show } from '../../../shared/components.jsx';

// Le check de non-régression du cours : ce que le lab ajoute ne doit rien casser de la page.
test('titre-toujours', async () => {
  const App = await load(() => import('@client/src/App.jsx'), 'src/App.jsx');
  show(<App />, 'src/App.jsx');
  expect(
    screen.queryByRole('heading', { level: 1, name: 'AI Coach' }),
    "La page n'affiche plus le titre « AI Coach » : App affiche-t-elle toujours <Header /> ?"
  ).not.toBeNull();
});
