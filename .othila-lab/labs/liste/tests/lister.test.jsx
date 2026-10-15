import { expect, test } from 'vitest';
import { list, ready, showList, three, titles } from './helpers.jsx';

test('liste-existe', async () => {
  await list();
});

test('une-carte-par-conseil', async () => {
  const SuggestionsList = await ready();
  showList(SuggestionsList, three);
  const shown = titles();
  expect(
    shown.length,
    `SuggestionsList affiche ${shown.length} carte(s) pour 3 conseils : fais-tu un suggestions.map(…) qui renvoie une SuggestionCard par conseil ?`
  ).toBe(3);
  expect(
    shown,
    "Les cartes n'affichent pas les titres des conseils, dans l'ordre : passes-tu suggestion={suggestion} à chaque SuggestionCard ?"
  ).toEqual(three.map((s) => s.title));
});
