import { componentTest } from '@othila-academy/lab';

export const title = 'Une promesse qui répond plus tard';
export const instructions = `Une vraie API ne répond pas tout de suite. Dans src/api/coach.js, sous generateSuggestions, écris
fetchSuggestions(request) : elle rend une promesse (new Promise) qui, après un délai (setTimeout), tient sa promesse
avec les conseils de generateSuggestions(request). Le délai dépend de la catégorie : 300 ms pour bien-être, 800 ms
pour productivité (le coach réfléchit plus longtemps). Si l'objectif contient « échec », la promesse est rompue avec
une erreur « Le coach ne répond pas pour le moment. ». App ne change pas encore.`;

export const prediction = {
  promptId: 'promesse-en-attente',
  question: "Juste après l'appel fetchSuggestions(request), que contient la promesse ?",
  choices: ['les trois conseils', 'rien encore : elle est en attente'],
  expected: 'rien encore : elle est en attente'
};

const check = (id, label) => componentTest({ id, label, file: 'tests/promettre.test.js' });

export const checks = [
  check('fetch-existe', 'src/api/coach.js exporte fetchSuggestions, qui rend une promesse'),
  check(
    'delai-bien-etre',
    'en bien-être, la promesse est tenue à 300 ms, pas avant, avec les conseils de generateSuggestions'
  ),
  check('delai-productivite', 'en productivité, la promesse est tenue à 800 ms, pas avant'),
  check(
    'echec',
    'un objectif qui contient « échec » rompt la promesse avec « Le coach ne répond pas pour le moment. »'
  )
];

export const hints = [
  "Qu'est-ce qui, en JavaScript, représente une valeur qui n'existe pas encore ?",
  "return new Promise((resolve, reject) => { setTimeout(() => { … resolve(generateSuggestions(request)) … }, délai) }) ; le délai vient d'un objet DELAYS indexé par la catégorie.",
  "export const DELAYS = { 'bien-etre': 300, productivite: 800 }; export function fetchSuggestions(request) { return new Promise((resolve, reject) => { const known = CATEGORIES.find((c) => c.value === request.category) ?? CATEGORIES[0]; setTimeout(() => { if (/échec/i.test(request.goal)) reject(new Error('Le coach ne répond pas pour le moment.')); else resolve(generateSuggestions(request)); }, DELAYS[known.value]); }); }"
];
