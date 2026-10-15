import { componentTest } from '@othila-academy/lab';

export const title = "Une demande que l'on suit";
export const instructions = `Après une première demande, changer de catégorie doit relancer la recherche, sans recliquer sur Générer.
Plutôt que d'appeler fetchSuggestions depuis chaque geste, fais de la demande un état d'App (request) : Générer la remplace,
le menu « Catégorie » en change la catégorie (nouvelle prop onCategoryChange de CoachForm), Réessayer en crée une copie.
Un effet, qui dépend de request, charge les conseils (chargement, erreur, finally, comme avant).
Avant la première demande, changer de catégorie ne charge rien.`;

export const prediction = {
  promptId: 'effet-strictmode',
  question:
    "En développement, sous StrictMode, combien de fois un effet tourne-t-il au montage d'un composant ?",
  choices: ['une fois', 'deux fois'],
  expected: 'deux fois'
};

const check = (id, label, options = {}) =>
  componentTest({ id, label, file: 'tests/suivre.test.jsx', ...options });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check(
    'categorie-relance',
    'après une première demande, choisir Productivité relance fetchSuggestions avec la nouvelle catégorie, et affiche ses conseils'
  ),
  check('rien-avant', 'changer de catégorie avant toute demande ne charge rien', {
    passesOnStart: true
  }),
  check('reessayer-toujours', '« Réessayer » relance toujours la même demande', {
    passesOnStart: true
  })
];

export const hints = [
  "Qu'est-ce qui change, quand on change de catégorie ? Et qui doit réagir à ce changement ?",
  'const [request, setRequest] = useState(null) ; useEffect(() => { if (!request) return; … }, [request]) ; onGenerate={setRequest} ; onCategoryChange met à jour request.',
  'useEffect(() => { if (!request) return; async function load() { setLoading(true); setError(null); try { setSuggestions(await fetchSuggestions(request)); } catch (failure) { setError(failure.message); } finally { setLoading(false); } } load(); }, [request]); function changeCategory(category) { setRequest((current) => (current ? { ...current, category } : current)); } — et dans CoachForm : onChange={(event) => { setCategory(event.target.value); onCategoryChange?.(event.target.value); }}'
];
