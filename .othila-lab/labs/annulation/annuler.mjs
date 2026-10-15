import { componentTest } from '@othila-academy/lab';

export const title = 'Le nettoyage annule la requête';
export const instructions = `Dans l'effet, crée un AbortController et passe { signal: controller.signal } à fetchSuggestions.
Le nettoyage, en plus de marquer la demande périmée (active = false), appelle controller.abort() : la requête périmée s'arrête
vraiment. Garde active : il protège toujours la réponse, l'erreur et la fin du chargement ; c'est aussi lui qui empêche
l'AbortError de s'afficher.`;

const check = (id, label, options = {}) =>
  componentTest({ id, label, file: 'tests/annuler.test.jsx', ...options });

export const checks = [
  check('signal-transmis', 'fetchSuggestions reçoit un signal'),
  check('annule-perimee', 'changer de catégorie annule la demande précédente'),
  check(
    'annulation-silencieuse',
    "une demande annulée n'affiche pas d'erreur, et la suivante répond normalement",
    {
      passesOnStart: true
    }
  ),
  check(
    'chargement-annule',
    "l'annulation d'une demande n'arrête pas le chargement de la suivante",
    { passesOnStart: true }
  )
];

export const hints = [
  "Qui sait qu'une demande est périmée ? C'est lui qui doit l'arrêter.",
  "const controller = new AbortController() dans l'effet ; fetchSuggestions(request, { signal: controller.signal }) ; controller.abort() dans le nettoyage.",
  'useEffect(() => { if (!request) return; const controller = new AbortController(); let active = true; async function load() { … const next = await fetchSuggestions(request, { signal: controller.signal }); … } load(); return () => { active = false; controller.abort(); }; }, [request]);'
];
