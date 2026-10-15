import { componentTest } from '@othila-academy/lab';

export const title = 'Une carte de conseil';
export const instructions = `Le coach donne des conseils : un objet { id, title, description, tag } (voir src/api/coach.js).
Crée src/components/SuggestionCard.jsx : un composant qui reçoit un conseil dans la prop suggestion et l'affiche
dans un <article> (classe card) : le titre dans un <h3>, la description dans un <p>, la catégorie dans un <span>
(classe badge). Pour la voir, affiche dans App une carte d'exemple :
generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' })[0].`;

export const prediction = {
  promptId: 'props-lecture-seule',
  question:
    'Dans SuggestionCard, peut-on changer le conseil reçu, en écrivant props.suggestion = autreConseil ?',
  choices: ["oui, c'est une variable comme une autre", 'non, les props sont en lecture seule'],
  expected: 'non, les props sont en lecture seule'
};

export const checks = [
  componentTest({
    id: 'carte-existe',
    label: 'src/components/SuggestionCard.jsx exporte un composant par défaut',
    file: 'tests/carte.test.jsx'
  }),
  componentTest({
    id: 'carte-article',
    label: 'la carte est un <article>',
    file: 'tests/carte.test.jsx'
  }),
  componentTest({
    id: 'carte-contenu',
    label: 'la carte affiche le titre (niveau 3), la description et la catégorie du conseil reçu',
    file: 'tests/carte.test.jsx'
  }),
  componentTest({
    id: 'carte-configurable',
    label: 'deux conseils différents donnent deux cartes différentes',
    file: 'tests/carte.test.jsx'
  })
];

export const hints = [
  'Un composant reçoit ses props comme premier argument de sa fonction : comment récupères-tu suggestion ?',
  'function SuggestionCard({ suggestion }) { … } puis {suggestion.title} dans le JSX : les accolades interprètent du JavaScript.',
  'export default function SuggestionCard({ suggestion }) { return ( <article className="card"> <h3>{suggestion.title}</h3> <p>{suggestion.description}</p> <span className="badge">{suggestion.tag}</span> </article> ); }'
];
