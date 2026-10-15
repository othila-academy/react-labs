import { componentTest } from '@othila-academy/lab';

export const title = 'Choisir et envoyer';
export const instructions = `Ajoute un menu « Catégorie » (un <select> dans un <label>), dont les options viennent de CATEGORIES
(src/api/coach.js), Bien-être par défaut. Ajoute un bouton « Générer », désactivé tant que l'objectif fait moins
de 10 caractères (les espaces au début et à la fin ne comptent pas). À l'envoi, le formulaire ne recharge pas la page et appelle
la prop onGenerate avec { goal, category }. Dans App, pour l'instant, donne-lui une fonction qui affiche la demande
dans la console.`;

const check = (id, label) => componentTest({ id, label, file: 'tests/envoyer.test.jsx' });

export const checks = [
  check(
    'categorie',
    'un menu « Catégorie » propose Bien-être et Productivité, Bien-être par défaut'
  ),
  check('bouton-desactive', '« Générer » est désactivé sous 10 caractères, actif à partir de 10'),
  check('envoi', "« Générer » appelle onGenerate une fois avec l'objectif et la catégorie choisis"),
  check('sans-rechargement', "l'envoi ne recharge pas la page")
];

export const hints = [
  "Qui doit décider quoi faire de la demande : le formulaire, ou celui qui l'affiche ?",
  '<form onSubmit={handleSubmit}> ; dans handleSubmit, event.preventDefault() puis onGenerate({ goal: goal.trim(), category }).',
  'function handleSubmit(event) { event.preventDefault(); onGenerate({ goal: goal.trim(), category }); } … <button type="submit" disabled={goal.trim().length < 10}>Générer</button>'
];
