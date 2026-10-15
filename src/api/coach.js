// La simulation du coach : trois conseils déterministes pour un objectif et une catégorie, sans réseau ni clé.
export const CATEGORIES = [
  { value: 'bien-etre', label: 'Bien-être' },
  { value: 'productivite', label: 'Productivité' }
];

const IDEAS = {
  'bien-etre': [
    ['Marcher dix minutes', 'Sors marcher dix minutes, sans téléphone.'],
    [
      'Respirer en carré',
      'Inspire quatre secondes, bloque quatre, expire quatre, bloque quatre ; cinq fois.'
    ],
    ['Couper les écrans', 'Éteins les écrans une heure avant de dormir.']
  ],
  productivite: [
    ['Une seule tâche', 'Choisis la tâche la plus importante et fais-la en premier.'],
    [
      'Vingt-cinq minutes',
      'Travaille vingt-cinq minutes sans interruption, puis fais une pause de cinq.'
    ],
    ['La liste du soir', 'Écris le soir les trois tâches du lendemain.']
  ]
};

// generateSuggestions({ goal, category }) : trois conseils { id, title, description, tag } ; une catégorie
// inconnue retombe sur bien-être. Toujours les mêmes pour les mêmes entrées : les tests peuvent les attendre.
export function generateSuggestions({ goal, category }) {
  const known = CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];
  return IDEAS[known.value].map(([title, description], i) => ({
    id: `${known.value}-${i + 1}`,
    title,
    description: `${description} Objectif : ${goal}.`,
    tag: known.label
  }));
}

// Le délai de réponse du coach, par catégorie : il réfléchit plus longtemps à la productivité.
export const DELAYS = { 'bien-etre': 300, productivite: 800 };

// fetchSuggestions(request, { signal }) : les conseils de generateSuggestions, mais comme une API :
// une promesse qui répond après DELAYS[catégorie], qui échoue si l'objectif contient « échec » (pour voir
// l'erreur dans le navigateur), et qui s'arrête si signal est annulé (AbortError).
export function fetchSuggestions(request, { signal } = {}) {
  return new Promise((resolve, reject) => {
    const known = CATEGORIES.find((c) => c.value === request.category) ?? CATEGORIES[0];
    const timer = setTimeout(() => {
      if (/échec/i.test(request.goal)) reject(new Error('Le coach ne répond pas pour le moment.'));
      else resolve(generateSuggestions(request));
    }, DELAYS[known.value]);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Requête annulée', 'AbortError'));
    });
  });
}
