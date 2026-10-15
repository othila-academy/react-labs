import { screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { load, show } from '../../../shared/components.jsx';

test('titre-unique', async () => {
  const App = await load(() => import('@client/src/App.jsx'), 'src/App.jsx');
  show(<App />, 'src/App.jsx');
  const titles = screen.queryAllByRole('heading', { level: 1, name: 'AI Coach' });
  expect(
    titles.length,
    "Le titre « AI Coach » n'apparaît plus dans App : Header affiche-t-il bien <h1>AI Coach</h1> (étape creer) ?"
  ).not.toBe(0);
  expect(
    titles.length,
    `Le titre « AI Coach » apparaît ${titles.length} fois : retire le <h1> et le paragraphe d'App, c'est Header qui les affiche maintenant.`
  ).toBe(1);
});
