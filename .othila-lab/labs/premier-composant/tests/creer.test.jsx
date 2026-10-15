import { screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { load, show } from '../../../shared/components.jsx';

const FILE = 'src/components/Header.jsx';
const header = () => load(() => import('@client/src/components/Header.jsx'), FILE);
// Les checks suivants renvoient au premier plutôt que de répéter son erreur.
const ready = () =>
  header().catch(() => {
    throw new Error(
      "Header n'est pas encore prêt : commence par le premier check (header-existe)."
    );
  });

test('header-existe', async () => {
  await header();
});

test('header-titre', async () => {
  const Header = await ready();
  show(<Header />, FILE);
  expect(
    screen.queryByRole('heading', { level: 1, name: 'AI Coach' }),
    "Header n'affiche pas de titre « AI Coach » : le JSX renvoyé contient-il <h1>AI Coach</h1> ?"
  ).not.toBeNull();
});

test('header-accroche', async () => {
  const Header = await ready();
  show(<Header />, FILE);
  expect(
    screen.queryByText('Des conseils pour avancer vers ton objectif.'),
    "Header n'affiche pas « Des conseils pour avancer vers ton objectif. » : recopie le paragraphe d'App dans le JSX de Header."
  ).not.toBeNull();
});
