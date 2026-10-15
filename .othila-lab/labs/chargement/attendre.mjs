import { componentTest } from '@othila-academy/lab';

export const title = 'Pendant que le coach réfléchit';
export const instructions = `Entre le clic et la réponse, rien ne bouge : on ne sait pas si l'application a entendu. Ajoute à App un
état loading, vrai pendant l'attente. Tant qu'il est vrai, la page affiche « Le coach réfléchit… » (un <p role="status">),
et « Générer » est désactivé : CoachForm reçoit une prop loading. À la réponse, le message disparaît et le bouton revient.`;

export const prediction = {
  promptId: 'chargement-trois-clics',
  question:
    'Sans bouton désactivé, que se passe-t-il quand on clique trois fois vite sur Générer ?',
  choices: ['une seule demande part', 'trois demandes partent, et trois réponses arrivent'],
  expected: 'trois demandes partent, et trois réponses arrivent'
};

const check = (id, label, extra = {}) =>
  componentTest({ id, label, file: 'tests/attendre.test.jsx', ...extra });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check(
    'message-attente',
    "pendant l'attente, la page affiche « Le coach réfléchit… » (role status)"
  ),
  check('bouton-attente', "pendant l'attente, « Générer » est désactivé"),
  check('fin-attente', 'à la réponse, le message disparaît et « Générer » revient', {
    passesOnStart: true
  }),
  check('une-seule-demande', "trois clics pendant l'attente ne font partir qu'une demande")
];

export const hints = [
  "Quelle information manque pour savoir qu'on attend ?",
  'const [loading, setLoading] = useState(false) ; setLoading(true) avant await, setLoading(false) après ; loading passé à CoachForm.',
  'setLoading(true); const next = await fetchSuggestions(request); setSuggestions(next); setLoading(false); … {loading && <p role="status">Le coach réfléchit…</p>} … dans CoachForm : disabled={!valid || loading}'
];
