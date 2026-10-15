import { screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { EMPTY, ready, showList, three } from './helpers.jsx';

test('liste-vide', async () => {
  const SuggestionsList = await ready();
  showList(SuggestionsList, []);
  expect(
    screen.queryByText(EMPTY),
    `Avec une liste vide, rien ne s'affiche : teste suggestions.length et renvoie <p className="empty">${EMPTY}</p>.`
  ).not.toBeNull();
  expect(
    screen.queryAllByRole('article').length,
    "Avec une liste vide, aucune carte ne doit s'afficher."
  ).toBe(0);
});

test('message-masque', async () => {
  const SuggestionsList = await ready();
  showList(SuggestionsList, three);
  expect(
    screen.queryByText(EMPTY),
    `Le message « ${EMPTY} » s'affiche alors qu'il y a 3 cartes : il ne doit apparaître que quand la liste est vide.`
  ).toBeNull();
});
