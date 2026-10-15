import { screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { load, show } from '../../../shared/components.jsx';

// Le DOM d'App ne dit pas si le titre vient de Header ou d'App : on remplace Header par un témoin,
// et on regarde si App l'affiche. C'est la frontière entre les deux composants qu'on observe.
vi.mock('@client/src/components/Header.jsx', () => ({ default: () => <p>Header témoin</p> }));

test('app-affiche-header', async () => {
  const App = await load(() => import('@client/src/App.jsx'), 'src/App.jsx');
  show(<App />, 'src/App.jsx');
  expect(
    screen.queryByText('Header témoin'),
    "App n'affiche pas Header : import Header from './components/Header.jsx', puis <Header /> dans le JSX d'App."
  ).not.toBeNull();
});
