import { screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { cardTitles } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';
import {
  FAILURE,
  PRODUCTIVITY,
  WAITING,
  WELLBEING,
  alertBlock,
  plug,
  race,
  settle
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

const titles = (request) => generateSuggestions(request).map((s) => s.title);

test('derniere-gagne', async () => {
  const { stale, current } = await race(calls, generateSuggestions);
  await settle(current, (call) => call.resolve(generateSuggestions(WELLBEING)));
  await settle(stale, (call) => call.resolve(generateSuggestions(PRODUCTIVITY)));
  const shown = cardTitles();
  if (shown.length > 0 && JSON.stringify(shown) === JSON.stringify(titles(PRODUCTIVITY))) {
    throw new Error(
      "La réponse de Productivité, arrivée après, a remplacé celle de Bien-être : l'effet doit renvoyer un nettoyage (return () => { active = false }) et ignorer une réponse quand active est faux."
    );
  }
  expect(shown, 'Bien-être a répondu, mais ses conseils ne sont plus affichés.').toEqual(
    titles(WELLBEING)
  );
});

test('erreur-perimee', async () => {
  const { stale, current } = await race(calls, generateSuggestions);
  await settle(current, (call) => call.resolve(generateSuggestions(WELLBEING)));
  await settle(stale, (call) => call.reject(new Error(FAILURE)));
  expect(
    alertBlock(),
    "Une demande périmée a échoué et son erreur s'affiche : ignore aussi le catch quand la demande n'est plus active."
  ).toBeFalsy();
});

test('chargement-perime', async () => {
  const { stale, current } = await race(calls, generateSuggestions);
  await settle(stale, (call) => call.resolve(generateSuggestions(PRODUCTIVITY)));
  expect(
    screen.queryByText(WAITING),
    "La demande périmée a arrêté le chargement alors que la suivante attend encore : ignore aussi le finally quand la demande n'est plus active."
  ).not.toBeNull();
  await settle(current, (call) => call.resolve(generateSuggestions(WELLBEING)));
});
