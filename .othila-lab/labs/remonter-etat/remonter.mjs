import { componentTest } from '@othila-academy/lab';

export const title = 'App garde les conseils';
export const instructions = `CoachForm envoie une demande, SuggestionsList affiche des conseils, mais ils ne se connaissent pas.
Leur parent commun, App, doit garder les conseils dans son état : il part d'une liste vide, donne à CoachForm une
fonction onGenerate qui génère les conseils (generateSuggestions) et les range dans cet état, et passe l'état à
SuggestionsList. La liste d'exemple disparaît. Essaie dans le navigateur.`;

export const prediction = {
  promptId: 'remonter-etat-freres',
  question:
    'CoachForm et SuggestionsList sont frères. Comment CoachForm peut-il donner des conseils à SuggestionsList ?',
  choices: ['directement, par une prop entre frères', 'en passant par leur parent commun, App'],
  expected: 'en passant par leur parent commun, App'
};

const check = (id, label, extra = {}) =>
  componentTest({ id, label, file: 'tests/remonter.test.jsx', ...extra });

export const checks = [
  check('titre-toujours', 'la page affiche toujours le titre « AI Coach »', {
    passesOnStart: true
  }),
  check('depart-vide', "au départ, la page affiche « Aucune suggestion pour l'instant »"),
  check(
    'generer',
    'après « mieux dormir » en Productivité et « Générer », la page affiche les trois conseils de productivité'
  ),
  check('regenerer', "une deuxième demande remplace les conseils au lieu de s'y ajouter")
];

export const hints = [
  'Lequel des composants voit à la fois le formulaire et la liste ?',
  'Dans App : const [suggestions, setSuggestions] = useState([]) ; onGenerate={(request) => setSuggestions(generateSuggestions(request))} ; suggestions={suggestions}.',
  'const [suggestions, setSuggestions] = useState([]); … <CoachForm onGenerate={(request) => setSuggestions(generateSuggestions(request))} /> <SuggestionsList suggestions={suggestions} />'
];
