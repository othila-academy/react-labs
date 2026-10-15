import { componentTest } from '@othila-academy/lab';

export const title = "Générer appelle l'API";
export const instructions = `Les conseils doivent maintenant venir de fetchSuggestions, comme d'une vraie API. Dans App, le gestionnaire
passé à onGenerate devient async : il attend la réponse (await fetchSuggestions(request)), puis range les conseils
dans l'état. generateSuggestions n'est plus appelée par App. Dans le navigateur, regarde le court délai avant les cartes.`;

export const prediction = {
  promptId: 'appel-asynchrone-cartes',
  question: 'Juste après le clic sur Générer, combien de nouvelles cartes la page affiche-t-elle ?',
  choices: ['trois', "aucune : la réponse n'est pas encore arrivée"],
  expected: "aucune : la réponse n'est pas encore arrivée"
};

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  componentTest({
    id: 'appelle-api',
    label: "« Générer » appelle fetchSuggestions avec l'objectif et la catégorie",
    file: 'tests/attendre.test.jsx'
  }),
  componentTest({
    id: 'attend-reponse',
    label: "les cartes n'apparaissent qu'à la réponse, avec les conseils reçus",
    file: 'tests/attendre.test.jsx'
  })
];

export const hints = [
  'fetchSuggestions rend une promesse : comment attendre sa valeur dans une fonction ?',
  'async function generate(request) { const next = await fetchSuggestions(request); setSuggestions(next); } ; onGenerate={generate}.',
  "import { fetchSuggestions } from './api/coach.js'; … async function generate(request) { const next = await fetchSuggestions(request); setSuggestions(next); } … <CoachForm onGenerate={generate} />"
];
