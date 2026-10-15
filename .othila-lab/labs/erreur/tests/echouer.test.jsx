import { screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { generateSuggestions } from '@client/src/api/coach.js';
import {
  FAILURE,
  REQUEST,
  WAITING,
  alertBlock,
  ask,
  fail,
  generateButton,
  needAlert,
  otherAlert,
  plug,
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

test('message-erreur', async () => {
  await showApp();
  ask(calls);
  await settle(calls[0], fail);
  const other = otherAlert();
  if (other) throw new Error(other);
  if (!alertBlock() && screen.queryByText(FAILURE, { exact: false })) {
    throw new Error(
      'Le message d\'erreur est affiché, mais pas annoncé : mets-le dans un bloc role="alert".'
    );
  }
  expect(
    alertBlock(),
    'Après un échec, aucun message d\'erreur : try / catch autour de await fetchSuggestions, et un état error affiché dans <div role="alert"> ?'
  ).toBeTruthy();
});

test('fin-chargement', async () => {
  await showApp();
  ask(calls);
  await settle(calls[0], fail);
  expect(
    screen.queryByText(WAITING),
    "Après un échec, « Le coach réfléchit… » reste affiché : remets loading à false dans finally, pour qu'il s'arrête aussi en cas d'erreur."
  ).toBeNull();
  expect(
    generateButton()?.disabled,
    'Après un échec, Générer reste désactivé : remets loading à false dans finally.'
  ).toBe(false);
});

test('erreur-effacee', async () => {
  await showApp();
  ask(calls);
  await settle(calls[0], fail);
  needAlert();
  ask(calls);
  expect(
    alertBlock(),
    "Pendant la nouvelle demande, l'erreur précédente reste affichée : remets error à null au début de chaque demande, avant await."
  ).toBeFalsy();
  await settle(calls[1], (call) => call.resolve(generateSuggestions(REQUEST)));
  expect(
    alertBlock(),
    "Après une demande réussie, l'erreur reste affichée : remets error à null au début de chaque demande."
  ).toBeFalsy();
});
