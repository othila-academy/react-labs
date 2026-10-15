import { componentTest } from '@othila-academy/lab';

export const title = 'Un provider pour les favoris';
export const instructions = `Crée src/context/FavoritesContext.jsx. Il exporte FavoritesContext (createContext(null)) et FavoritesProvider,
un composant qui tient les favoris : l'état saved, sa lecture et son écriture dans le navigateur, save et remove, tout ce
qu'App faisait. Il fournit { saved, save, remove } à ses enfants. Dans main.jsx, enveloppe App avec FavoritesProvider.
App ne garde plus ses favoris : elle les lit dans le contexte (useContext(FavoritesContext)).`;

export const prediction = {
  promptId: 'contexte-sans-provider',
  question:
    "Un composant lit useContext(FavoritesContext), mais aucun FavoritesProvider n'est au-dessus de lui. Que reçoit-il ?",
  choices: ['une erreur de React', 'la valeur par défaut donnée à createContext (ici null)'],
  expected: 'la valeur par défaut donnée à createContext (ici null)'
};

const check = (id, label) => componentTest({ id, label, file: 'tests/fournir.test.jsx' });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check(
    'contexte-existe',
    'src/context/FavoritesContext.jsx exporte FavoritesContext et FavoritesProvider'
  ),
  check(
    'provider-fournit',
    'sous FavoritesProvider, un composant lit les favoris relus du navigateur, en ajoute et en retire, et le navigateur suit'
  ),
  check('app-partage', 'une sauvegarde faite dans App se voit dans le contexte'),
  componentTest({
    id: 'main-provider',
    label: 'main.jsx enveloppe App avec FavoritesProvider',
    file: 'tests/main.test.jsx'
  })
];

export const hints = [
  'Qui doit tenir les favoris, pour que tout composant puisse les lire ?',
  "export const FavoritesContext = createContext(null) ; FavoritesProvider reprend l'état, l'effet, save et remove d'App, et rend <FavoritesContext.Provider value={{ saved, save, remove }}>{children}</FavoritesContext.Provider>.",
  'export function FavoritesProvider({ children }) { const [saved, setSaved] = useState(readSaved); useEffect(() => { localStorage.setItem(KEY, JSON.stringify(saved)); }, [saved]); function save(suggestion) { … } function remove(id) { … } return <FavoritesContext.Provider value={{ saved, save, remove }}>{children}</FavoritesContext.Provider>; } — dans main.jsx : <FavoritesProvider><App /></FavoritesProvider> ; dans App : const { saved, save, remove } = useContext(FavoritesContext).'
];
