export const title = 'useFavorites';
export const steps = ['envelopper'];
export const duration = '15 min';
export const summary = `Trois composants lisent useContext(FavoritesContext), et plantent sur null sans dire pourquoi s'il n'y a pas
de provider. Un hook personnalisé, useFavorites, cache le contexte et dit clairement son oubli.`;
export const objectives = [
  'écrire un hook personnalisé (une fonction use… qui appelle des hooks)',
  "lever une erreur d'usage claire plutôt qu'un plantage plus loin",
  'remplacer une lecture répétée par un hook'
];
