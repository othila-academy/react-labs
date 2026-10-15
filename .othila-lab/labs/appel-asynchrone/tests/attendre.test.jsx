import { act, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { alive, cardTitles, fire, load, show } from '../../../shared/components.jsx';

// fetchSuggestions est remplacée par un espion dont le test tient la promesse quand il veut : aucun délai réel.
vi.mock('@client/src/api/coach.js', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchSuggestions: vi.fn()
}));
const coach = await import('@client/src/api/coach.js');

const FILE = 'src/App.jsx';
const REQUEST = { goal: 'mieux dormir', category: 'productivite' };
let answer = null;

beforeEach(() => {
  answer = null;
  coach.fetchSuggestions.mockReset();
  coach.fetchSuggestions.mockImplementation(
    () =>
      new Promise((resolve) => {
        answer = resolve;
      })
  );
});

async function showApp() {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  show(<App />, FILE);
}

function ask({ goal, category }) {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const select = screen.queryByRole('combobox', { name: /^\s*Catégorie/ });
  const button = screen.queryByRole('button', { name: 'Générer' });
  if (!field || !select || !button) {
    throw new Error("App n'affiche plus le formulaire complet : voir le lab formulaire.");
  }
  fire.type(field, goal);
  fire.change(select, { target: { value: category } });
  fire.click(button);
}

test('appelle-api', async () => {
  await showApp();
  ask(REQUEST);
  expect(
    coach.fetchSuggestions.mock.calls.length,
    "Après Générer, fetchSuggestions n'a pas été appelée : le gestionnaire passé à onGenerate l'appelle-t-il (import { fetchSuggestions } from './api/coach.js') ?"
  ).toBeGreaterThan(0);
  const [request] = coach.fetchSuggestions.mock.calls[0];
  expect(
    request,
    `fetchSuggestions a reçu ${JSON.stringify(request)} au lieu de { goal: 'mieux dormir', category: 'productivite' } : passe-lui la demande reçue.`
  ).toEqual(REQUEST);
});

test('attend-reponse', async () => {
  await showApp();
  const before = cardTitles();
  ask(REQUEST);
  expect(
    cardTitles(),
    'Les cartes apparaissent avant la réponse du coach : App appelle-t-elle encore generateSuggestions ? Attends fetchSuggestions (await) et range sa réponse.'
  ).toEqual(before);
  if (!answer)
    throw new Error("fetchSuggestions n'est pas appelée : regarde d'abord le check appelle-api.");
  const expected = coach.generateSuggestions(REQUEST);
  await act(async () => answer(expected));
  alive();
  expect(
    cardTitles(),
    "La réponse du coach est arrivée, mais les cartes ne la montrent pas : range le résultat de await fetchSuggestions(request) dans l'état (setSuggestions)."
  ).toEqual(expected.map((s) => s.title));
});
