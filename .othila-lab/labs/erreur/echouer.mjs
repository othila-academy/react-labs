import { componentTest } from '@othila-academy/lab';

export const title = "Dire l'échec";
export const instructions = `Écris « échec » dans l'objectif et génère : le chargement ne s'arrête jamais, et la console affiche une erreur
que personne n'attrape. Attrape-la : try / catch autour de l'appel ; une erreur s'affiche dans un bloc role="alert"
avec son message (« Le coach ne répond pas pour le moment. ») ; le chargement s'arrête dans tous les cas (finally).
Une nouvelle demande efface l'erreur.`;

export const prediction = {
  promptId: 'erreur-non-attrapee',
  question: "fetchSuggestions échoue et rien ne l'attrape. Que voit l'utilisateur ?",
  choices: ["un message d'erreur", 'rien : « Le coach réfléchit… » reste affiché'],
  expected: 'rien : « Le coach réfléchit… » reste affiché'
};

const check = (id, label) => componentTest({ id, label, file: 'tests/echouer.test.jsx' });

export const checks = [
  componentTest({
    id: 'titre-toujours',
    label: 'la page affiche toujours le titre « AI Coach »',
    file: 'tests/titre.test.jsx',
    passesOnStart: true
  }),
  check(
    'message-erreur',
    'un échec affiche « Le coach ne répond pas pour le moment. » dans un bloc role="alert"'
  ),
  check(
    'fin-chargement',
    'après un échec, « Le coach réfléchit… » disparaît et « Générer » revient'
  ),
  check('erreur-effacee', "une demande réussie après un échec efface l'erreur")
];

export const hints = [
  "Où va l'erreur d'une promesse rompue, quand on l'attend avec await ?",
  'try { … await … } catch (failure) { setError(failure.message) } finally { setLoading(false) } ; setError(null) au début.',
  'const [error, setError] = useState(null); … setLoading(true); setError(null); try { const next = await fetchSuggestions(request); setSuggestions(next); } catch (failure) { setError(failure.message); } finally { setLoading(false); } … {error && <div role="alert"><p>{error}</p></div>}'
];
