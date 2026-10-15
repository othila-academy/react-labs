import { componentTest } from '@othila-academy/lab';

export const title = 'Un hook pour lire les favoris';
export const instructions = `Trois composants écrivent useContext(FavoritesContext) : chacun doit savoir quel contexte lire, et s'il n'y a
pas de provider, ils plantent sur null sans dire pourquoi. Écris dans FavoritesContext.jsx un hook personnalisé, useFavorites(),
exporté : il lit le contexte et le rend ; s'il vaut null, il lève une erreur dont le message nomme FavoritesProvider.
Puis remplace useContext(FavoritesContext) par useFavorites() dans App, FavoritesBadge et SuggestionsList.`;

export const prediction = {
  promptId: 'hook-personnalise',
  question: "Qu'est-ce qu'un hook personnalisé ?",
  choices: [
    'un composant qui ne rend rien',
    "une fonction dont le nom commence par use, et qui appelle d'autres hooks"
  ],
  expected: "une fonction dont le nom commence par use, et qui appelle d'autres hooks"
};

const check = (id, label, options = {}) =>
  componentTest({ id, label, file: 'tests/envelopper.test.jsx', ...options });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check('hook-existe', 'FavoritesContext.jsx exporte useFavorites'),
  check('hook-rend', 'sous le provider, useFavorites() rend { saved, save, remove, clear }'),
  check('hors-provider', "hors d'un FavoritesProvider, useFavorites() lève une erreur qui le dit"),
  check('favoris-toujours', 'depuis App, sauvegarder, retirer et tout retirer marchent toujours', {
    passesOnStart: true
  })
];

export const hints = [
  'Que répètent les trois composants qui lisent les favoris ?',
  "export function useFavorites() { const value = useContext(FavoritesContext); if (!value) throw new Error('… FavoritesProvider'); return value; }",
  "export function useFavorites() { const value = useContext(FavoritesContext); if (!value) throw new Error('useFavorites doit être utilisé sous un FavoritesProvider'); return value; } — puis, dans App : const { saved, remove, clear } = useFavorites();"
];
