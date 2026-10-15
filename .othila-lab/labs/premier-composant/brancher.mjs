import { componentTest } from '@othila-academy/lab';

export const title = "L'afficher dans App";
export const instructions = `Header existe, mais personne ne l'affiche. Importe-le dans App et remplace le titre et le paragraphe
d'App par <Header />. Regarde le résultat avec npm run dev : rien ne doit changer à l'écran.`;

export const checks = [
  componentTest({
    id: 'app-affiche-header',
    label: 'App affiche le composant Header',
    file: 'tests/brancher.test.jsx'
  }),
  componentTest({
    id: 'titre-unique',
    label: "le titre « AI Coach » n'apparaît qu'une fois",
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  })
];

export const hints = [
  "Pour utiliser un composant d'un autre fichier, que faut-il écrire en haut d'App ?",
  "import Header from './components/Header.jsx', puis <Header /> à la place du titre et du paragraphe.",
  'import Header from \'./components/Header.jsx\'; export default function App() { return ( <main className="app"> <Header /> </main> ); }'
];
