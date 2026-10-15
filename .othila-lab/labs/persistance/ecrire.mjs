import { componentTest } from '@othila-academy/lab';

export const title = 'Écrire à chaque changement';
export const instructions = `Les favoris disparaissent quand on recharge la page. Garde-les dans le navigateur : à chaque changement
des favoris, un effet (useEffect) les écrit dans localStorage, sous la clé ai-coach:favoris, en JSON.
Ouvre l'onglet Application (ou Stockage) des outils du navigateur pour les voir.
Si l'onglet du navigateur se fige, regarde le tableau de dépendances de ton effet.`;

export const prediction = {
  promptId: 'persistance-effet-sans-dependances',
  question: 'Un useEffect sans tableau de dépendances qui appelle setSaved : que se passe-t-il ?',
  choices: ['rien de particulier', 'une boucle de rendus sans fin'],
  expected: 'une boucle de rendus sans fin'
};

const check = (id, label) => componentTest({ id, label, file: 'tests/ecrire.test.jsx' });

export const checks = [
  check('ecrit', "sauvegarder un conseil l'écrit dans localStorage (ai-coach:favoris)"),
  check('retire-ecrit', 'retirer un favori met localStorage à jour')
];

export const hints = [
  'Quand faut-il écrire : à chaque rendu, une seule fois, ou quand les favoris changent ?',
  'useEffect(() => { localStorage.setItem(KEY, JSON.stringify(saved)); }, [saved]).',
  "const KEY = 'ai-coach:favoris'; … useEffect(() => { localStorage.setItem(KEY, JSON.stringify(saved)); }, [saved]);"
];
