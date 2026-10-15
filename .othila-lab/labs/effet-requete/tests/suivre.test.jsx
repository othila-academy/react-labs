import { screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { alive, cardTitles, fire } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';
import {
  REQUEST,
  WAITING,
  alertBlock,
  otherAlert,
  ask,
  choose,
  fail,
  plug,
  retryButton,
  settle,
  showApp,
  submitButton
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
  await showApp(calls);
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
  await showApp(calls);
  choose('productivite');
  const created = calls[0]?.request;
  if (created && created.goal === undefined) {
    throw new Error(
      `Avant toute demande, changer de catégorie a créé une demande sans objectif (${JSON.stringify(created)}) : ne touche à request que s'il existe : setRequest((current) => (current ? { ...current, category } : current)).`
    );
  }
  expect(
    calls.length,
    "Avant toute demande, changer de catégorie a appelé fetchSuggestions : l'effet doit s'arrêter tant que request est null (if (!request) return)."
  ).toBe(0);
});

test('reessayer-toujours', async () => {
  await showApp(calls);
  ask(calls);
  await settle(calls[0], fail);
  const block = alertBlock();
  if (!block)
    throw new Error(
      otherAlert() ??
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

test('chargement-toujours', async () => {
  await showApp(calls);
  ask(calls);
  expect(
    screen.queryByText(WAITING),
    "Pendant l'attente, « Le coach réfléchit… » n'apparaît plus : dans l'effet, setLoading(true) au début de load."
  ).not.toBeNull();
  expect(
    submitButton()?.disabled,
    "Pendant l'attente, Générer reste cliquable : dans l'effet, setLoading(true) au début de load."
  ).toBe(true);
  await settle(calls[0], (call) => call.resolve(generateSuggestions(REQUEST)));
  expect(
    screen.queryByText(WAITING),
    "La réponse est arrivée, mais « Le coach réfléchit… » reste affiché : dans l'effet, setLoading(false) dans finally."
  ).toBeNull();
});

test('erreur-effacee-toujours', async () => {
  await showApp(calls);
  ask(calls);
  await settle(calls[0], fail);
  if (!alertBlock()) {
    throw new Error(
      otherAlert() ??
        "Après un échec, aucun message d'erreur : voir le lab erreur (l'effet garde son try / catch)."
    );
  }
  ask(calls);
  expect(
    alertBlock(),
    "Pendant la nouvelle demande, l'erreur précédente reste affichée : dans l'effet, setError(null) au début de load, avant await."
  ).toBeFalsy();
  await settle(calls[1], (call) => call.resolve(generateSuggestions(REQUEST)));
  expect(
    alertBlock(),
    "Après une demande réussie, l'erreur reste affichée : dans l'effet, setError(null) au début de load."
  ).toBeFalsy();
});
