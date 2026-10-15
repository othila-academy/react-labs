import { componentTest } from '@othila-academy/lab';

export const title = 'Le badge lit lui-même';
export const instructions = `Le badge n'a plus besoin qu'on lui passe count : il lit les favoris dans le contexte. Header ne reçoit
plus rien, et App l'affiche sans prop (<Header />).`;

export const checks = [
  componentTest({
    id: 'header-seul',
    label: 'le Header, rendu seul et sans prop, compte les favoris du contexte',
    file: 'tests/lire.test.jsx'
  })
];

export const hints = [
  'Qui a besoin du nombre ? Peut-il aller le chercher lui-même ?',
  'Dans FavoritesBadge : const { saved } = useContext(FavoritesContext) ; Header rend <FavoritesBadge /> ; App rend <Header />.',
  "import { useContext } from 'react'; import { FavoritesContext } from '../context/FavoritesContext.jsx'; export default function FavoritesBadge() { const { saved } = useContext(FavoritesContext); const count = saved.length; … }"
];
