import { componentTest } from '@othila-academy/lab';

export const title = "Une API qu'on peut arrêter";
export const instructions = `Depuis le lab 13, une réponse périmée est ignorée, mais la requête court jusqu'au bout : une vraie API
travaille pour rien. fetch accepte un signal (AbortController) qui l'arrête. Fais de même : fetchSuggestions(request, { signal }) ;
quand le signal est annulé, le minuteur s'arrête (clearTimeout) et la promesse est rompue avec une AbortError
(new DOMException('Requête annulée', 'AbortError')). Sans second argument, elle marche comme avant.`;

export const prediction = {
  promptId: 'fetch-annule',
  question: "Quand on annule le signal d'un fetch en cours, que devient sa promesse ?",
  choices: [
    'elle est tenue avec une réponse vide',
    'elle reste en attente pour toujours',
    'elle est rompue avec une AbortError'
  ],
  expected: 'elle est rompue avec une AbortError'
};

const check = (id, label, options = {}) =>
  componentTest({ id, label, file: 'tests/signal.test.js', ...options });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check(
    'sans-signal',
    'sans second argument, fetchSuggestions répond toujours, à 300 ms en bien-être',
    {
      passesOnStart: true
    }
  ),
  check('annule', 'annuler le signal à 100 ms rompt aussitôt la promesse avec une AbortError'),
  check('minuteur-arrete', "après l'annulation, le minuteur du coach est arrêté")
];

export const hints = [
  "Qu'est-ce qui prévient fetchSuggestions qu'on ne veut plus de sa réponse ?",
  "const timer = setTimeout(…) ; signal?.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Requête annulée', 'AbortError')); }).",
  "export function fetchSuggestions(request, { signal } = {}) { return new Promise((resolve, reject) => { const known = …; const timer = setTimeout(() => { … }, DELAYS[known.value]); signal?.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Requête annulée', 'AbortError')); }); }); }"
];
