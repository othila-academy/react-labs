import { componentTest } from '@othila-academy/lab';

export const title = 'Créer le composant';
export const instructions = `App affiche lui-même le titre « AI Coach » et la phrase d'accroche. Range-les dans un composant à part :
crée src/components/Header.jsx, une fonction Header en export par défaut, qui renvoie ce titre (un <h1>)
et ce paragraphe (classe tagline). Le dossier src/components n'existe peut-être pas encore : crée-le.`;

export const prediction = {
  promptId: 'premier-composant-parent',
  question:
    'Header renvoie un <h1> et un <p>. Peut-on les renvoyer côte à côte, sans élément autour ?',
  choices: ['oui', 'non, il faut un parent ou un fragment'],
  expected: 'non, il faut un parent ou un fragment'
};

export const checks = [
  componentTest({
    id: 'header-existe',
    label: 'src/components/Header.jsx exporte un composant par défaut',
    file: 'tests/creer.test.jsx'
  }),
  componentTest({
    id: 'header-titre',
    label: 'Header affiche un titre de niveau 1 « AI Coach »',
    file: 'tests/creer.test.jsx'
  }),
  componentTest({
    id: 'header-accroche',
    label: "Header affiche la phrase d'accroche",
    file: 'tests/creer.test.jsx'
  })
];

export const hints = [
  "Un composant React, c'est une fonction : que renvoie-t-elle ?",
  'export default function Header() { return ( … ) } ; et deux éléments côte à côte doivent avoir un parent commun.',
  'export default function Header() { return ( <header> <h1>AI Coach</h1> <p className="tagline">Des conseils pour avancer vers ton objectif.</p> </header> ); }'
];
