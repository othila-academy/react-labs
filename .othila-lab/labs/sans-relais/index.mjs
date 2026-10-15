export const title = 'Plus de relais';
export const steps = ['lire'];
export const duration = '20 min';
export const summary = `SuggestionsList reçoit savedIds et onSave seulement pour les passer aux cartes : un relais.
Elle lit maintenant les favoris dans le contexte ; les cartes, elles, gardent leurs props.`;
export const objectives = [
  "repérer un composant qui relaie des props sans s'en servir",
  'remplacer ce relais par une lecture du contexte',
  "garder les props d'un composant de présentation"
];
