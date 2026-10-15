import { componentTest } from '@othila-academy/lab';

export const title = 'Une réponse périmée ne compte plus';
export const instructions = `Génère en Bien-être, puis passe vite en Productivité et reviens en Bien-être. Le coach répond plus vite en
bien-être (300 ms) qu'en productivité (800 ms) : la réponse de Productivité arrive en dernier, et ses conseils s'affichent alors que
le menu dit Bien-être. Corrige : l'effet renvoie une fonction de nettoyage, que React appelle quand request change ; elle marque la
demande comme périmée, et sa réponse (conseils, erreur, fin de chargement) est ignorée.`;

export const prediction = {
  promptId: 'nettoyage-quand',
  question: 'Quand React appelle-t-il la fonction renvoyée par un effet ?',
  choices: [
    'seulement quand le composant disparaît',
    "avant chaque nouvelle exécution de l'effet, et quand le composant disparaît"
  ],
  expected: "avant chaque nouvelle exécution de l'effet, et quand le composant disparaît"
};

const check = (id, label) => componentTest({ id, label, file: 'tests/ignorer.test.jsx' });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check(
    'derniere-gagne',
    "Productivité puis Bien-être, Bien-être répond d'abord, Productivité ensuite : la page garde les conseils de Bien-être"
  ),
  check('erreur-perimee', "l'échec d'une demande périmée n'affiche pas d'erreur"),
  check(
    'chargement-perime',
    "la fin d'une demande périmée n'arrête pas le chargement de la demande en cours"
  )
];

export const hints = [
  "Quand une nouvelle demande part, qu'est-ce qui peut prévenir l'ancienne qu'elle ne compte plus ?",
  "let active = true ; … if (active) setSuggestions(next) … ; return () => { active = false } dans l'effet.",
  'useEffect(() => { if (!request) return; let active = true; async function load() { setLoading(true); setError(null); try { const next = await fetchSuggestions(request); if (active) setSuggestions(next); } catch (failure) { if (active) setError(failure.message); } finally { if (active) setLoading(false); } } load(); return () => { active = false; }; }, [request]);'
];
