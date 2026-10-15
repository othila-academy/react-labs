export const title = 'La catégorie relance la recherche';
export const steps = ['suivre'];
export const duration = '25 min';
export const summary = `Après une première demande, changer de catégorie devrait relancer la recherche, sans recliquer sur Générer.
La demande devient un état ; un effet la suit et charge les conseils chaque fois qu'elle change.`;
export const objectives = [
  'faire de la demande un état, que plusieurs gestes modifient',
  'charger des données dans un effet qui dépend de cet état',
  "ne rien charger tant qu'il n'y a pas de demande"
];
