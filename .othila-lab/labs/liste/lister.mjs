import { componentTest } from '@othila-academy/lab';

export const title = 'Une carte par conseil';
export const instructions = `Le coach donne trois conseils à la fois. Crée src/components/SuggestionsList.jsx : un composant qui reçoit
la liste dans la prop suggestions et affiche une SuggestionCard par conseil, dans une <section> (classe suggestions).
Dans App, remplace la carte d'exemple par la liste d'exemple :
generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' }).
Ouvre la console du navigateur (F12) : est-elle propre ?`;

export const prediction = {
  promptId: 'liste-sans-key',
  question: "Sans key sur les cartes, la liste s'affiche-t-elle ?",
  choices: ["non, React refuse de l'afficher", 'oui, mais React avertit dans la console'],
  expected: 'oui, mais React avertit dans la console'
};

export const checks = [
  componentTest({
    id: 'liste-existe',
    label: 'src/components/SuggestionsList.jsx exporte un composant par défaut',
    file: 'tests/lister.test.jsx'
  }),
  componentTest({
    id: 'une-carte-par-conseil',
    label: "trois conseils donnent trois cartes, dans l'ordre, avec leurs titres",
    file: 'tests/lister.test.jsx'
  }),
  componentTest({ id: 'cles', label: 'aucune key manquante', file: 'tests/lister.test.jsx' })
];

export const hints = [
  "Comment transformer un tableau de conseils en tableau d'éléments JSX ?",
  "suggestions.map((suggestion) => <SuggestionCard … />), et chaque élément d'une liste a besoin d'une key unique et stable.",
  '<section className="suggestions"> {suggestions.map((suggestion) => ( <SuggestionCard key={suggestion.id} suggestion={suggestion} /> ))} </section>'
];
