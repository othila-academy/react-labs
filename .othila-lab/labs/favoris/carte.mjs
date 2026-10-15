import { componentTest } from '@othila-academy/lab';

export const title = 'La carte propose de sauvegarder';
export const instructions = `Chaque carte reçoit deux nouvelles props : onSave, une fonction, et saved, vrai si le conseil est déjà
sauvegardé. Ajoute à la carte un bouton « Sauvegarder » qui appelle onSave avec le conseil. Un conseil déjà
sauvegardé affiche « Sauvegardé », et son bouton est désactivé : pas de doublon possible.`;

export const prediction = {
  promptId: 'favoris-retirer-bouton',
  question:
    'Une fois les favoris en place, on retire un conseil des favoris. Que devient le bouton de sa carte ?',
  choices: ['il reste « Sauvegardé »', 'il redevient « Sauvegarder »'],
  expected: 'il redevient « Sauvegarder »'
};

const check = (id, label) => componentTest({ id, label, file: 'tests/carte.test.jsx' });

export const checks = [
  check(
    'bouton-sauvegarder',
    "la carte d'un conseil non sauvegardé a un bouton « Sauvegarder » actif"
  ),
  check('clic-sauvegarde', 'un clic sur « Sauvegarder » appelle onSave avec le conseil'),
  check(
    'deja-sauvegarde',
    'avec saved, la carte affiche « Sauvegardé » et son bouton est désactivé'
  )
];

export const hints = [
  "La carte ne sait pas ce qu'on fait des favoris : que lui faut-il pour prévenir, et pour savoir quoi afficher ?",
  'function SuggestionCard({ suggestion, saved = false, onSave }) ; un bouton dont onClick appelle onSave(suggestion), et disabled={saved}.',
  "<button type=\"button\" disabled={saved} onClick={() => onSave(suggestion)}>{saved ? 'Sauvegardé' : 'Sauvegarder'}</button>"
];
