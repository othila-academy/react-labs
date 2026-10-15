import { componentTest } from '@othila-academy/lab';

export const title = 'Réessayer';
export const instructions = `Ajoute dans le bloc d'erreur un bouton « Réessayer » qui relance la dernière demande : garde-la dans l'état
(lastRequest) au moment où elle part.`;

const check = (id, label) => componentTest({ id, label, file: 'tests/reessayer.test.jsx' });

export const checks = [
  check('bouton-reessayer', "le bloc d'erreur propose « Réessayer »"),
  check('relance', '« Réessayer » relance la même demande'),
  check(
    'reussite-apres-reessai',
    "si le nouvel essai réussit, les conseils s'affichent et l'erreur disparaît"
  )
];

export const hints = [
  'Pour relancer la même demande, que faut-il avoir gardé ?',
  'const [lastRequest, setLastRequest] = useState(null) ; setLastRequest(request) au début de generate ; onClick={() => generate(lastRequest)}.',
  '<div role="alert"> <p>{error}</p> <button type="button" onClick={() => generate(lastRequest)}>Réessayer</button> </div>'
];
