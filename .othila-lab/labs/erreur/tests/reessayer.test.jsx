import { expect, test, vi, beforeEach } from 'vitest';
import { alive, cardTitles, fire } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';
import {
  REQUEST,
  alertBlock,
  ask,
  fail,
  needAlert,
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

async function failOnce() {
  await showApp();
  ask(calls);
  await settle(calls[0], fail);
  return needAlert();
}

function needRetry(block) {
  const button = retryButton(block);
  if (!button)
    throw new Error(
      "Le bloc d'erreur n'a pas encore de bouton « Réessayer » : regarde d'abord le check bouton-reessayer."
    );
  return button;
}

test('bouton-reessayer', async () => {
  const block = await failOnce();
  expect(
    retryButton(block),
    'Le bloc d\'erreur n\'a pas de bouton « Réessayer » : ajoute <button type="button">Réessayer</button> dans le <div role="alert">.'
  ).toBeTruthy();
});

test('relance', async () => {
  fire.click(needRetry(await failOnce()));
  alive();
  expect(
    calls.length,
    'Réessayer ne relance pas fetchSuggestions : son onClick appelle-t-il generate(lastRequest) ?'
  ).toBe(2);
  if (calls[1].request == null) {
    throw new Error(
      'Réessayer relance fetchSuggestions sans demande : garde la dernière dans lastRequest quand elle part (setLastRequest(request)), et passe-la à generate.'
    );
  }
  expect(
    calls[1].request,
    `Réessayer relance ${JSON.stringify(calls[1].request)} au lieu de la dernière demande : garde-la dans lastRequest quand elle part.`
  ).toEqual(REQUEST);
});

test('reussite-apres-reessai', async () => {
  fire.click(needRetry(await failOnce()));
  if (calls.length < 2)
    throw new Error("Réessayer ne relance rien encore : regarde d'abord le check relance.");
  const expected = generateSuggestions(REQUEST);
  await settle(calls[1], (call) => call.resolve(expected));
  expect(
    alertBlock(),
    "Le nouvel essai a réussi, mais l'erreur reste affichée : remets error à null au début de chaque demande."
  ).toBeFalsy();
  expect(cardTitles(), "Le nouvel essai a réussi, mais ses conseils ne s'affichent pas.").toEqual(
    expected.map((s) => s.title)
  );
});
