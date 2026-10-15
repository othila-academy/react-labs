import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import * as coach from '@client/src/api/coach.js';

// Aucun délai réel : les fausses horloges de Vitest avancent le temps à la milliseconde près.
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const NO_FETCH =
  "src/api/coach.js n'exporte pas fetchSuggestions : export function fetchSuggestions(request) { … }";
const ERROR = 'Le coach ne répond pas pour le moment.';

// L'état d'une promesse, lu sans l'attendre : en attente, tenue (value) ou rompue (error).
function watch(promise) {
  const seen = { state: 'en attente' };
  promise.then(
    (value) => Object.assign(seen, { state: 'tenue', value }),
    (error) => Object.assign(seen, { state: 'rompue', error })
  );
  return seen;
}

function call(request) {
  if (typeof coach.fetchSuggestions !== 'function') {
    throw new Error(
      "fetchSuggestions n'existe pas encore : regarde le premier check (fetch-existe)."
    );
  }
  const result = coach.fetchSuggestions(request);
  if (typeof result?.then !== 'function') {
    throw new Error(
      'fetchSuggestions ne rend pas encore de promesse : regarde le premier check (fetch-existe).'
    );
  }
  return watch(result);
}

async function respondsAt(request, delay) {
  const label = coach.CATEGORIES.find((c) => c.value === request.category)?.label.toLowerCase();
  const seen = call(request);
  await vi.advanceTimersByTimeAsync(delay - 1);
  expect(
    seen.state,
    `En ${label}, la promesse est déjà ${seen.state} à ${delay - 1} ms : le setTimeout a-t-il le bon délai (${delay} ms) ?`
  ).toBe('en attente');
  await vi.advanceTimersByTimeAsync(1);
  expect(
    seen.state,
    `En ${label}, la promesse n'est pas tenue à ${delay} ms : resolve est-il appelé dans le setTimeout, avec le délai de la catégorie ?`
  ).toBe('tenue');
  expect(
    seen.value,
    'La promesse est tenue, mais pas avec les conseils de generateSuggestions(request).'
  ).toEqual(coach.generateSuggestions(request));
}

test('fetch-existe', () => {
  expect(typeof coach.fetchSuggestions, NO_FETCH).toBe('function');
  const result = coach.fetchSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
  expect(
    typeof result?.then,
    'fetchSuggestions ne rend pas de promesse : return new Promise((resolve, reject) => { … }).'
  ).toBe('function');
});

test('delai-bien-etre', async () => {
  await respondsAt({ goal: 'mieux dormir', category: 'bien-etre' }, 300);
});

test('delai-productivite', async () => {
  await respondsAt({ goal: 'finir mon mémoire', category: 'productivite' }, 800);
});

test('echec', async () => {
  const seen = call({ goal: 'échec garanti', category: 'bien-etre' });
  await vi.advanceTimersByTimeAsync(800);
  expect(
    seen.state,
    `Avec « échec garanti », la promesse est ${seen.state} : reject(new Error('${ERROR}')) quand l'objectif contient « échec ».`
  ).toBe('rompue');
  expect(
    seen.error?.message,
    `La promesse est rompue avec « ${seen.error?.message} » au lieu de « ${ERROR} ».`
  ).toBe(ERROR);
});
