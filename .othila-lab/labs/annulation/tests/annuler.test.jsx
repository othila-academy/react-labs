import { act, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { cardTitles } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';
import { WAITING, WELLBEING, ask, plug, race, settle } from './helpers.jsx';

vi.mock('@client/src/api/coach.js', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchSuggestions: vi.fn()
}));
const coach = await import('@client/src/api/coach.js');
let calls;
beforeEach(() => {
  calls = plug(coach.fetchSuggestions);
});

const NO_SIGNAL =
  "fetchSuggestions est appelée sans signal : passe-lui { signal: controller.signal }, d'un AbortController créé dans l'effet.";

test('signal-transmis', async () => {
  const first = await ask(calls);
  expect(first.signal instanceof AbortSignal, NO_SIGNAL).toBe(true);
});

test('annule-perimee', async () => {
  const { stale } = await race(calls, generateSuggestions);
  if (!(stale.signal instanceof AbortSignal)) {
    throw new Error(
      "fetchSuggestions ne reçoit pas encore de signal : regarde d'abord le check signal-transmis."
    );
  }
  expect(
    stale.signal.aborted,
    "La demande précédente n'est pas annulée : le nettoyage de l'effet doit appeler controller.abort()."
  ).toBe(true);
});

test('annulation-silencieuse', async () => {
  const { current } = await race(calls, generateSuggestions);
  await act(async () => {});
  expect(
    current.signal?.aborted ?? false,
    "La demande en cours est annulée elle aussi : crée un AbortController par demande, dans l'effet."
  ).toBe(false);
  // Le texte des alertes, sans celui de leurs boutons (Réessayer).
  const shown = screen
    .queryAllByRole('alert')
    .map((el) =>
      [...el.querySelectorAll('button')]
        .reduce((text, b) => text.replace(b.textContent, ''), el.textContent)
        .trim()
    );
  expect(
    shown,
    `Une demande annulée affiche « ${shown.join(' ')} » : ignore l'erreur d'une demande périmée (if (active) …).`
  ).toEqual([]);
  const expected = generateSuggestions(WELLBEING);
  await settle(current, (call) => call.resolve(expected));
  expect(
    cardTitles(),
    "La demande en cours a répondu, mais ses conseils ne s'affichent pas."
  ).toEqual(expected.map((s) => s.title));
});

test('chargement-annule', async () => {
  const { current } = await race(calls, generateSuggestions);
  await act(async () => {});
  expect(
    screen.queryByText(WAITING),
    "La demande annulée a arrêté le chargement de la suivante, qui attend encore : garde active, et ignore le finally d'une demande périmée (if (active) setLoading(false))."
  ).not.toBeNull();
  await settle(current, (call) => call.resolve(generateSuggestions(WELLBEING)));
});
