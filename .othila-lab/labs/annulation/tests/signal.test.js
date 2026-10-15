import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import * as coach from '@client/src/api/coach.js';

// Aucun délai réel : les fausses horloges de Vitest avancent le temps à la milliseconde près.
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const REQUEST = { goal: 'mieux dormir', category: 'bien-etre' };

// L'état d'une promesse, lu sans l'attendre : en attente, tenue (value) ou rompue (error).
function watch(promise) {
  const seen = { state: 'en attente' };
  promise.then(
    (value) => Object.assign(seen, { state: 'tenue', value }),
    (error) => Object.assign(seen, { state: 'rompue', error })
  );
  return seen;
}

// Une demande en bien-être, annulée à 100 ms.
async function abortAt100() {
  const controller = new AbortController();
  const seen = watch(coach.fetchSuggestions(REQUEST, { signal: controller.signal }));
  await vi.advanceTimersByTimeAsync(100);
  controller.abort();
  await vi.advanceTimersByTimeAsync(0);
  return seen;
}

test('sans-signal', async () => {
  let seen;
  try {
    seen = watch(coach.fetchSuggestions(REQUEST));
  } catch (failure) {
    throw new Error(
      `Sans second argument, fetchSuggestions plante (${failure.message}) : donne une valeur par défaut au second paramètre ({ signal } = {}).`
    );
  }
  await vi.advanceTimersByTimeAsync(300);
  expect(
    seen.state,
    `Sans second argument, la promesse est ${seen.state} à 300 ms au lieu d'être tenue : voir le lab promesse.`
  ).toBe('tenue');
});

test('annule', async () => {
  const seen = await abortAt100();
  expect(
    seen.state,
    seen.state === 'tenue'
      ? "La promesse est tenue malgré l'annulation : à l'annulation, rejette-la."
      : "À l'annulation, la promesse reste en attente : écoute le signal (signal?.addEventListener('abort', …)) et rejette."
  ).toBe('rompue');
  expect(
    seen.error?.name,
    `La promesse est rompue avec « ${seen.error?.message} » au lieu d'une AbortError : reject(new DOMException('Requête annulée', 'AbortError')).`
  ).toBe('AbortError');
});

test('minuteur-arrete', async () => {
  const seen = await abortAt100();
  if (seen.state !== 'rompue') {
    throw new Error(
      "L'annulation ne rompt pas encore la promesse : regarde d'abord le check annule."
    );
  }
  expect(
    vi.getTimerCount(),
    "Après l'annulation, le minuteur du coach tourne encore : clearTimeout(timer) dans l'écouteur abort."
  ).toBe(0);
});
