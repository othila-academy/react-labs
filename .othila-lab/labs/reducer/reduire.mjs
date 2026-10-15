import { componentTest } from '@othila-academy/lab';

export const title = 'Un reducer pour les favoris';
export const instructions = `Les favoris changent de trois façons : on en sauvegarde un, on en retire un, et bientôt on les retire tous.
Écris ces changements en un seul endroit : src/context/favoritesReducer.js exporte par défaut favoritesReducer(state, action),
une fonction pure. Actions : { type: 'save', suggestion } (sans doublon), { type: 'remove', id }, { type: 'clear' }.
Elle rend toujours un nouvel état, sans modifier celui qu'elle reçoit ; une action inconnue lève une erreur.
Rien ne change encore dans l'application.`;

export const prediction = {
  promptId: 'reducer-push',
  question: 'Un reducer peut-il faire state.push(suggestion), puis rendre state ?',
  choices: [
    'oui, le favori est bien ajouté',
    'non : il rend le même tableau, et React ne voit pas de changement'
  ],
  expected: 'non : il rend le même tableau, et React ne voit pas de changement'
};

const check = (id, label) => componentTest({ id, label, file: 'tests/reduire.test.js' });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check('reducer-existe', 'src/context/favoritesReducer.js exporte par défaut une fonction'),
  check('save', 'save ajoute le conseil dans un nouveau tableau, sans doublon'),
  check('remove', 'remove retire le favori de cet id, sans toucher au tableau reçu'),
  check('clear', 'clear vide les favoris'),
  check('inconnue', 'une action inconnue lève une erreur')
];

export const hints = [
  "Pour chaque type d'action, quel est le nouvel état ? Peut-on le construire sans toucher à l'ancien ?",
  "switch (action.type) { case 'save': … case 'remove': … case 'clear': … default: throw … } ; [...state, x] et filter rendent de nouveaux tableaux.",
  "export default function favoritesReducer(state, action) { switch (action.type) { case 'save': return state.some((s) => s.id === action.suggestion.id) ? state : [...state, action.suggestion]; case 'remove': return state.filter((s) => s.id !== action.id); case 'clear': return []; default: throw new Error(`Action inconnue : ${action.type}`); } }"
];
