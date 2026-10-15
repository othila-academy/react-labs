import { componentTest } from '@othila-academy/lab';

export const title = 'Un champ qui suit la saisie';
export const instructions = `Crée src/components/CoachForm.jsx : un formulaire (classe coach-form) avec un champ « Objectif »
(un <input> dans un <label> qui porte ce texte). Le champ est contrôlé : sa valeur vient d'un état (useState),
mis à jour à chaque saisie. Sous le champ, un compteur (classe counter) affiche « N caractères restants » sur 140,
et le champ n'accepte pas plus de 140 caractères (maxLength). Affiche CoachForm dans App, au-dessus de la liste.`;

export const prediction = {
  promptId: 'formulaire-sans-onchange',
  question: 'Un <input value={goal}> sans onChange : peut-on taper dedans ?',
  choices: ['oui', 'non, le champ reste figé'],
  expected: 'non, le champ reste figé'
};

const check = (id, label) => componentTest({ id, label, file: 'tests/saisir.test.jsx' });

export const checks = [
  check('form-existe', 'src/components/CoachForm.jsx exporte un composant par défaut'),
  check('champ-objectif', 'un champ de saisie nommé « Objectif »'),
  check('saisie', "le champ affiche ce qu'on tape"),
  check(
    'compteur',
    'le compteur suit la saisie : 140, puis 128 caractères restants après « mieux dormir »'
  ),
  check('limite', "le champ s'arrête à 140 caractères")
];

export const hints = [
  "Où le formulaire garde-t-il ce que tape l'étudiant, pour l'afficher et le compter ?",
  "const [goal, setGoal] = useState('') ; value={goal} et onChange={(event) => setGoal(event.target.value)} sur l'<input>.",
  'const [goal, setGoal] = useState(\'\'); … <label>Objectif <input value={goal} maxLength={140} onChange={(event) => setGoal(event.target.value)} /></label> <p className="counter">{140 - goal.length} caractères restants</p>'
];
