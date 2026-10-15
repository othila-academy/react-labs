import { componentTest } from '@othila-academy/lab';

export const title = 'Des actions plutôt que des écritures';
export const instructions = `Le provider garde ses favoris avec useReducer(favoritesReducer, undefined, readSaved) : le troisième argument
lit les favoris du navigateur au premier rendu. save, remove et une nouvelle fonction clear envoient chacune leur action
(dispatch). Le contexte fournit { saved, save, remove, clear }. Dans la section Favoris, un bouton « Tout retirer » vide la
liste ; il n'apparaît que s'il y a des favoris. SavedList reçoit onClear d'App.`;

export const prediction = {
  promptId: 'dispatch-qui-calcule',
  question: "Après dispatch({ type: 'clear' }), qui calcule le nouvel état ?",
  choices: [
    'le composant qui a appelé dispatch',
    "le reducer, que React appelle avec l'état courant et l'action"
  ],
  expected: "le reducer, que React appelle avec l'état courant et l'action"
};

const check = (id, label, options = {}) =>
  componentTest({ id, label, file: 'tests/envoyer.test.jsx', ...options });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check('contexte-clear', 'le contexte fournit clear, qui vide les favoris'),
  check(
    'tout-retirer',
    'depuis App, « Tout retirer » vide les favoris, le compteur et le navigateur'
  ),
  check('sans-favori', 'sans favori, pas de bouton « Tout retirer »', { passesOnStart: true }),
  check('favoris-toujours', 'depuis App, sauvegarder puis retirer marche toujours', {
    passesOnStart: true
  })
];

export const hints = [
  "Avec un reducer, comment demande-t-on un changement d'état ?",
  "const [saved, dispatch] = useReducer(favoritesReducer, undefined, readSaved) ; save = (s) => dispatch({ type: 'save', suggestion: s }) ; clear = () => dispatch({ type: 'clear' }) ; « Tout retirer » appelle onClear.",
  'Dans le provider : const clear = () => dispatch({ type: \'clear\' }) et value={{ saved, save, remove, clear }} ; dans App : <SavedList saved={saved} onRemove={remove} onClear={clear} /> ; dans SavedList, sous la liste : <button type="button" onClick={onClear}>Tout retirer</button>.'
];
