export const title = 'Combien de favoris ?';
export const steps = ['compter'];
export const duration = '20 min';
export const summary = `Le Header doit dire combien il y a de favoris. Le nombre se déduit des favoris d'App ;
pour arriver au badge, il traverse Header, qui ne s'en sert pas : c'est le props drilling.`;
export const objectives = [
  "déduire une valeur de l'état plutôt que la garder dans un état en double",
  'faire descendre une prop à travers plusieurs composants',
  "repérer les composants qui relaient des props sans s'en servir"
];
