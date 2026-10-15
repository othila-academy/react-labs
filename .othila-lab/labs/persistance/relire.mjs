import { componentTest } from '@othila-academy/lab';

export const title = 'Relire au démarrage';
export const instructions = `Les favoris sont écrits, mais au rechargement App repart d'une liste vide, et l'écrase aussitôt.
Lis-les au premier rendu, comme valeur initiale de l'état : useState accepte une fonction, appelée une seule fois.
Un contenu illisible (JSON cassé, valeur qui n'est pas une liste) ne doit pas faire planter l'application :
elle repart alors d'une liste vide.`;

const check = (id, label, extra = {}) =>
  componentTest({ id, label, file: 'tests/relire.test.jsx', ...extra });

export const checks = [
  check('relit', "des favoris déjà présents dans localStorage s'affichent au démarrage"),
  check(
    'rechargement',
    "un favori sauvegardé est toujours là après un nouveau montage d'App (un rechargement)"
  ),
  check('illisible', 'un localStorage illisible ne fait pas planter App, qui repart sans favori', {
    passesOnStart: true
  })
];

export const hints = [
  'Lire localStorage à chaque rendu, ou une seule fois, au premier ?',
  "useState(readSaved), où readSaved lit, parse dans un try/catch, et renvoie [] si ce n'est pas une liste.",
  'function readSaved() { try { const value = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(value) ? value : []; } catch { return []; } } … const [saved, setSaved] = useState(readSaved);'
];
