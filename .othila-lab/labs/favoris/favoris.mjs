import { componentTest } from '@othila-academy/lab';

export const title = 'App garde les favoris';
export const instructions = `Crée src/components/SavedList.jsx : une section titrée « Favoris » (un <h2>) qui affiche la liste des
favoris (un <ul>, classe saved, un <li> par favori avec son titre et un bouton « Retirer »), ou « Aucun favori pour
l'instant ». App garde les favoris dans son état : il passe à SuggestionsList les identifiants sauvegardés (savedIds)
et la fonction qui sauvegarde (onSave), que la liste fait passer à chaque carte ; et à SavedList les favoris et la
fonction qui retire (onRemove).`;

const check = (id, label) => componentTest({ id, label, file: 'tests/favoris.test.jsx' });

export const checks = [
  check(
    'favoris-vide',
    "au départ, la section « Favoris » affiche « Aucun favori pour l'instant »"
  ),
  check(
    'sauvegarder',
    '« Sauvegarder » sur une carte ajoute le conseil aux favoris, et la carte affiche « Sauvegardé »'
  ),
  check('retirer', '« Retirer » enlève le favori, et la carte propose de nouveau « Sauvegarder »'),
  componentTest({
    id: 'cles-favoris',
    label: 'aucune key manquante dans la liste des favoris',
    file: 'tests/cles.test.jsx'
  }),
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  })
];

export const hints = [
  'La carte et la liste des favoris doivent voir les mêmes favoris : où les ranger ?',
  'Dans App : const [saved, setSaved] = useState([]) ; save ajoute (sans doublon), remove filtre par id ; savedIds={saved.map((s) => s.id)}.',
  'function save(suggestion) { setSaved((current) => (current.some((s) => s.id === suggestion.id) ? current : [...current, suggestion])); } function remove(id) { setSaved((current) => current.filter((s) => s.id !== id)); }'
];
