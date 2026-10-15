import { screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { load, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

const FILE = 'src/components/SuggestionCard.jsx';
const [walk] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
const [focus] = generateSuggestions({ goal: 'finir mon mémoire', category: 'productivite' });

const card = () => load(() => import('@client/src/components/SuggestionCard.jsx'), FILE);
const ready = () =>
  card().catch(() => {
    throw new Error(
      "SuggestionCard n'est pas encore prête : commence par le premier check (carte-existe)."
    );
  });

test('carte-existe', async () => {
  await card();
});

test('carte-article', async () => {
  const SuggestionCard = await ready();
  show(<SuggestionCard suggestion={walk} />, FILE);
  expect(
    screen.queryByRole('article'),
    'SuggestionCard ne rend pas d\'<article> : enveloppe la carte dans <article className="card">…</article>.'
  ).not.toBeNull();
});

test('carte-contenu', async () => {
  const SuggestionCard = await ready();
  show(<SuggestionCard suggestion={walk} />, FILE);
  expect(
    screen.queryByRole('heading', { level: 3, name: walk.title }),
    `La carte n'affiche pas le titre « ${walk.title} » dans un <h3> : lis-tu bien suggestion.title, la prop s'appelle-t-elle suggestion ?`
  ).not.toBeNull();
  expect(
    screen.queryByText(walk.description),
    `La carte n'affiche pas la description du conseil : un <p>{suggestion.description}</p> ?`
  ).not.toBeNull();
  expect(
    screen.queryByText(walk.tag),
    `La carte n'affiche pas la catégorie « ${walk.tag} » : un <span className="badge">{suggestion.tag}</span> ?`
  ).not.toBeNull();
});

test('carte-configurable', async () => {
  const SuggestionCard = await ready();
  // Tant que la carte n'affiche pas son titre, c'est carte-contenu qui le dit : on y renvoie.
  const first = show(<SuggestionCard suggestion={walk} />, FILE);
  if (!screen.queryByRole('heading', { level: 3, name: walk.title })) {
    throw new Error(
      "La carte n'affiche pas encore le titre du conseil : regarde d'abord carte-contenu."
    );
  }
  first.unmount();
  show(<SuggestionCard suggestion={focus} />, FILE);
  expect(
    screen.queryByText(walk.title),
    `Avec un autre conseil, la carte affiche toujours « ${walk.title} » : le texte est-il écrit en dur au lieu de venir de suggestion ?`
  ).toBeNull();
  expect(
    screen.queryByRole('heading', { level: 3, name: focus.title }),
    `Avec le conseil « ${focus.title} », la carte ne l'affiche pas : chaque texte doit venir de suggestion.`
  ).not.toBeNull();
});
