import { componentTest } from '@othila-academy/lab';

export const title = "Quand il n'y a rien";
export const instructions = `Avant la première génération, il n'y a aucun conseil. Une liste vide ne doit pas laisser un trou :
SuggestionsList affiche alors, à la place, un paragraphe (classe empty) « Aucune suggestion pour l'instant ».`;

export const checks = [
  componentTest({
    id: 'liste-vide',
    label: "sans conseil, la liste affiche « Aucune suggestion pour l'instant » et aucune carte",
    file: 'tests/vide.test.jsx'
  }),
  componentTest({
    id: 'message-masque',
    label: "avec des conseils, le message n'apparaît pas",
    file: 'tests/vide.test.jsx'
  })
];

export const hints = [
  'Un composant peut renvoyer un JSX différent selon ses props : avec quelle condition ?',
  'if (suggestions.length === 0) return …, avant le return de la liste.',
  'if (suggestions.length === 0) return <p className="empty">Aucune suggestion pour l\'instant</p>;'
];
