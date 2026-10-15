import { beforeEach, expect, test, vi } from 'vitest';
import { alive, cardTitles, fire } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';
import {
  REQUEST,
  alertBlock,
  ask,
  choose,
  fail,
  plug,
  retryButton,
  settle,
  showApp
} from './helpers.jsx';

vi.mock('@client/src/api/coach.js', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchSuggestions: vi.fn()
}));
const coach = await import('@client/src/api/coach.js');
let calls;
beforeEach(() => {
  calls = plug(coach.fetchSuggestions);
});

test('categorie-relance', async () => {
  await showApp();
  ask(calls);
  await settle(calls[0], (call) => call.resolve(generateSuggestions(REQUEST)));
  const before = calls.length;
  choose('productivite');
  expect(
    calls.length,
    "Après une première demande, changer de catégorie ne relance rien : la demande est-elle un état d'App, suivi par un useEffect qui dépend de [request] ? CoachForm prévient-il App (onCategoryChange) ?"
  ).toBeGreaterThan(before);
  const relaunched = calls.at(-1);
  const wanted = { ...REQUEST, category: 'productivite' };
  expect(
    relaunched.request,
    `La recherche relancée a reçu ${JSON.stringify(relaunched.request)} au lieu de ${JSON.stringify(wanted)} : onCategoryChange doit passer la catégorie choisie, et App la mettre dans request en gardant l'objectif.`
  ).toEqual(wanted);
  const expected = generateSuggestions(wanted);
  await settle(relaunched, (call) => call.resolve(expected));
  expect(
    cardTitles(),
    "La recherche relancée a répondu, mais ses conseils ne s'affichent pas."
  ).toEqual(expected.map((s) => s.title));
});

test('rien-avant', async () => {
  await showApp();
  choose('productivite');
  expect(
    calls.length,
    "Avant toute demande, changer de catégorie a appelé fetchSuggestions : l'effet doit s'arrêter tant que request est null (if (!request) return)."
  ).toBe(0);
});

test('reessayer-toujours', async () => {
  await showApp();
  ask(calls);
  await settle(calls[0], fail);
  const block = alertBlock();
  if (!block)
    throw new Error(
      "Après un échec, aucun message d'erreur : voir le lab erreur (l'effet garde son try / catch)."
    );
  const button = retryButton(block);
  if (!button)
    throw new Error("Le bloc d'erreur n'a plus de bouton « Réessayer » : voir le lab erreur.");
  fire.click(button);
  alive();
  expect(
    calls.length,
    "Réessayer ne relance plus la demande : une copie ({ ...request }) change request et relance l'effet ; le même objet, non."
  ).toBe(2);
  expect(calls[1].request, 'Réessayer relance une autre demande que la dernière.').toEqual(REQUEST);
});
