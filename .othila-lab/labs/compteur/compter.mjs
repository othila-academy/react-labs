import { componentTest } from '@othila-academy/lab';

export const title = '« N favoris » dans le Header';
export const instructions = `Le Header doit dire combien il y a de favoris : « Aucun favori », « 1 favori », « 2 favoris »…
Crée src/components/FavoritesBadge.jsx, qui reçoit count et affiche ce texte ; Header l'affiche sous la phrase d'accroche.
Le nombre vient des favoris d'App : passe-le à Header (count={saved.length}), qui le passe au badge. Pas de nouvel état :
le nombre se déduit des favoris. Regarde ensuite le chemin parcouru par count, puis celui de savedIds et onSave
(App → SuggestionsList → SuggestionCard) : qui s'en sert vraiment ?`;

export const prediction = {
  promptId: 'compteur-etat',
  question: 'Faut-il un état (useState) pour le nombre de favoris ?',
  choices: ['oui : un état count, augmenté à chaque sauvegarde', 'non : saved.length suffit'],
  expected: 'non : saved.length suffit'
};

const check = (id, label) => componentTest({ id, label, file: 'tests/compter.test.jsx' });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  componentTest({
    id: 'badge-existe',
    label: 'src/components/FavoritesBadge.jsx exporte un composant par défaut',
    file: 'tests/badge.test.jsx'
  }),
  check('aucun', 'au départ, le Header affiche « Aucun favori »'),
  check('compte', 'après deux sauvegardes, « 2 favoris » ; après un retrait, « 1 favori »'),
  check('relus', "des favoris relus du navigateur sont comptés dès l'ouverture")
];

export const hints = [
  "D'où vient le nombre de favoris ? Est-il déjà quelque part ?",
  'count={saved.length} sur <Header />, puis <FavoritesBadge count={count} /> dans Header ; dans le badge : 0 → « Aucun favori », 1 → « 1 favori », sinon `${count} favoris`.',
  "export default function FavoritesBadge({ count = 0 }) { const label = count === 0 ? 'Aucun favori' : count === 1 ? '1 favori' : `${count} favoris`; return <p className=\"favorites-badge\">{label}</p>; } — Header({ count = 0 }) rend <FavoritesBadge count={count} /> sous la phrase d'accroche ; App rend <Header count={saved.length} />."
];
