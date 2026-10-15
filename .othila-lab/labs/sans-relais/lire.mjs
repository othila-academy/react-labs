import { componentTest } from '@othila-academy/lab';

export const title = 'La liste lit les favoris';
export const instructions = `SuggestionsList reçoit savedIds et onSave, seulement pour les passer aux cartes. Fais-lui lire saved et save
dans le contexte ; elle ne reçoit plus que suggestions. SuggestionCard ne change pas : elle reçoit toujours saved et onSave,
de SuggestionsList. App ne passe plus à la liste que les conseils.`;

export const prediction = {
  promptId: 'contexte-rerendu',
  question:
    'Un favori est ajouté au contexte. Quels composants qui lisent le contexte se ré-affichent ?',
  choices: ['seulement celui qui a sauvegardé', 'tous ceux qui lisent le contexte'],
  expected: 'tous ceux qui lisent le contexte'
};

const check = (id, label, options = {}) =>
  componentTest({ id, label, file: 'tests/lire.test.jsx', ...options });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check(
    'liste-sauvegarde',
    'SuggestionsList rendue seule, avec ses seuls conseils, sauvegarde par le contexte'
  ),
  check(
    'liste-deja',
    'rendue seule, SuggestionsList marque « Sauvegardé » un conseil déjà dans les favoris'
  ),
  check(
    'favoris-toujours',
    'depuis App, sauvegarder puis retirer marche toujours, et le compteur suit',
    {
      passesOnStart: true
    }
  )
];

export const hints = [
  'Que fait SuggestionsList de savedIds et onSave, à part les passer ?',
  'const { saved, save } = useContext(FavoritesContext) dans SuggestionsList ; saved={saved.some(…)} et onSave={save} sur chaque carte ; <SuggestionsList suggestions={suggestions} /> dans App.',
  'export default function SuggestionsList({ suggestions }) { const { saved, save } = useContext(FavoritesContext); … <SuggestionCard key={suggestion.id} suggestion={suggestion} saved={saved.some((s) => s.id === suggestion.id)} onSave={save} /> … }'
];
