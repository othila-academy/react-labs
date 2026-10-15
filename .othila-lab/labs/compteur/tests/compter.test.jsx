import { expect, test, vi } from 'vitest';
import { generateSuggestions } from '@client/src/api/coach.js';
import { KEY, badgeText, generate, removeFirst, saveCard, showApp } from './helpers.jsx';

// Le coach répond tout de suite : aucun délai réel.
vi.mock('@client/src/api/coach.js', async (importOriginal) => {
  const coach = await importOriginal();
  return { ...coach, fetchSuggestions: async (request) => coach.generateSuggestions(request) };
});

const NO_BADGE =
  "Le Header n'affiche pas le nombre de favoris : FavoritesBadge affiche-t-il son texte, et Header l'affiche-t-il dans le <header> ?";

function expectBadge(expected, wrong) {
  const text = badgeText();
  if (text === null) throw new Error(NO_BADGE);
  expect(text, wrong(text)).toBe(expected);
}

test('aucun', async () => {
  await showApp();
  expectBadge(
    'Aucun favori',
    (text) =>
      `Au départ, le Header affiche « ${text} » au lieu de « Aucun favori » : à zéro, le badge dit « Aucun favori ».`
  );
});

test('compte', async () => {
  await showApp();
  await generate();
  saveCard(0);
  saveCard(1);
  expectBadge(
    '2 favoris',
    (text) =>
      `Après deux sauvegardes, le Header affiche « ${text} » au lieu de « 2 favoris » : App passe-t-elle count={saved.length} à Header, et Header à FavoritesBadge ?`
  );
  removeFirst();
  expectBadge(
    '1 favori',
    (text) =>
      `Après un retrait, le Header affiche « ${text} » au lieu de « 1 favori » : au singulier, pas de s.`
  );
});

test('relus', async () => {
  localStorage.setItem(
    KEY,
    JSON.stringify(generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' }).slice(0, 2))
  );
  await showApp();
  expectBadge(
    '2 favoris',
    (text) =>
      `Deux favoris relus du navigateur, mais le Header affiche « ${text} » : le nombre doit venir des favoris eux-mêmes (count={saved.length}, passé par App), pas d'un état à part.`
  );
});
