// Les aides des tests du cours : charger un composant de l'étudiant avec un message clair, le rendre comme main.jsx
// (sous StrictMode) avec une limite d'erreur qui dit s'il plante, et capter les avertissements de React.
import { Component, StrictMode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// Une boucle de rendus (un effet qui change l'état à chaque rendu) : React l'annonce dans console.error, puis
// recommence sans fin. On lève à la place, pour arrêter la boucle et la dire (client-setup pose la garde).
const LOOP = 'Maximum update depth exceeded';
const LOOP_MESSAGE =
  "un effet change l'état à chaque rendu ; regarde le tableau de dépendances de tes useEffect";
export function guardLoop(args) {
  if (args.some((a) => String(a?.message ?? a).includes(LOOP))) throw new Error(LOOP_MESSAGE);
}

// Une erreur de compilation (JSX mal formé…) : Vite la donne en plusieurs lignes colorées, dont lab check ne garde
// que la première (« Transform failed with 1 error: »). On en tire la cause, sa ligne et sa colonne.
const plain = (text) => text.replace(/\u001b\[[0-9;]*m/g, '');
function compileError(error, file) {
  const text = plain(String(error?.message ?? ''));
  if (!text.startsWith('Transform failed')) return null;
  const cause = /\[[A-Z_]+\]\s*(.+)/.exec(text)?.[1].trim();
  // L'emplacement donné par Vite : le fichier fautif, qui peut être un composant importé par celui qu'on charge.
  const at = /\[\s*([^\s\]]+):(\d+):(\d+)\s*\]/.exec(text);
  const help = /Help:\s*(.+)/.exec(text)?.[1].trim();
  const where = at ? ` (ligne ${at[2]}, colonne ${at[3]})` : '';
  return new Error(
    `${at?.[1] ?? file} ne compile pas${where} : ${cause ?? 'erreur de syntaxe'}${help ? ` ${help}` : ''}`
  );
}

// Un import dont le chemin ne mène à rien (« Failed to resolve import … ») : on dit lequel, et d'où part le chemin.
function resolveError(error) {
  const found = /Failed to resolve import "(.+?)" from "(.+?)"/.exec(
    plain(String(error?.message ?? ''))
  );
  if (!found) return null;
  const [, spec, from] = found;
  return new Error(
    `${from} importe « ${spec} », introuvable : le chemin part du dossier de ${from} (depuis src/App.jsx, un composant s'importe par './components/<Nom>.jsx').`
  );
}

// Les providers que main.jsx pose autour d'App (à partir de la séance 3, FavoritesProvider) : les tests rendent App
// ou un composant seul, jamais main.jsx ; show les pose donc aussi. Ils sont cherchés par leur nom de fichier, où
// qu'ils soient sous src/ (un dossier déplacé, un .tsx) ; avant le lab qui les crée, il n'y a rien à trouver.
const PROVIDER_FILES = import.meta.glob('/src/**/FavoritesContext.{jsx,tsx}');
let providers = [];

async function loadProviders() {
  providers = [];
  for (const [path, importer] of Object.entries(PROVIDER_FILES)) {
    let mod;
    try {
      mod = await importer();
    } catch (error) {
      throw compileError(error, path.slice(1)) ?? resolveError(error) ?? error;
    }
    if (typeof mod.FavoritesProvider === 'function') providers.push(mod.FavoritesProvider);
  }
}

// load(() => import('@client/src/components/Header.jsx'), 'src/components/Header.jsx') : l'export par défaut.
// Un fichier absent est déjà signalé par lab check (« introuvable : as-tu créé ce fichier ? »).
// Les échecs sont des Error d'une ligne : lab check coupe un message d'assertion à « : expected ».
export async function load(importer, file) {
  let mod;
  try {
    await loadProviders();
    mod = await importer();
  } catch (error) {
    throw compileError(error, file) ?? resolveError(error) ?? error;
  }
  if (typeof mod.default !== 'function') {
    throw new Error(`${file} n'a pas d'export par défaut : export default function …`);
  }
  return mod.default;
}

class Limit extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) return <p data-testid="plantage">{this.state.error.message}</p>;
    return this.props.children;
  }
}

// Le texte d'un plantage, traduit quand React parle de lui-même ; when : « au rendu », « après cette action ».
function crashMessage(text, file, when) {
  if (text.startsWith(LOOP_MESSAGE)) return `${file} tourne en boucle : ${LOOP_MESSAGE}.`;
  if (text.includes('Element type is invalid')) {
    const parent = /render method of `(\w+)`/.exec(text)?.[1] ?? file;
    return `${parent} affiche un composant importé qui vaut undefined : le fichier de ce composant a-t-il un export par défaut (export default function …), et l'import est-il sans accolades ?`;
  }
  return `${file} plante ${when} : « ${text} »`;
}

let lastFile = 'le composant';
const crashText = () => screen.queryByTestId('plantage')?.textContent ?? null;

// show(<App />, 'src/App.jsx') : rendu sous StrictMode et sous les providers de main.jsx, comme dans le navigateur ;
// un plantage devient un échec lisible.
// React écrit l'erreur attrapée dans console.error : on la tait, sauf si reactWarnings écoute déjà (il la garde).
export function show(element, file) {
  lastFile = file;
  const quiet = vi.isMockFunction(console.error)
    ? null
    : vi.spyOn(console, 'error').mockImplementation((...args) => guardLoop(args));
  let view;
  try {
    view = render(
      <StrictMode>
        <Limit>
          {providers.reduceRight(
            (inner, Provider) => (
              <Provider>{inner}</Provider>
            ),
            element
          )}
        </Limit>
      </StrictMode>
    );
  } finally {
    quiet?.mockRestore();
  }
  const text = crashText();
  if (text !== null) throw new Error(crashMessage(text, file, "à l'affichage"));
  return view;
}

// Après un clic ou une saisie : un composant qui plante au nouveau rendu est dit comme tel.
export function alive() {
  const text = crashText();
  if (text !== null) throw new Error(crashMessage(text, lastFile, 'après cette action'));
}

// fireEvent, suivi de alive : les labs l'utilisent pour chaque clic et chaque saisie.
// type passe par l'évènement input, qui déclenche onChange comme onInput (React écoute input pour les deux).
export const fire = {
  type(element, value) {
    fireEvent.input(element, { target: { value } });
    alive();
  },
  click(element) {
    fireEvent.click(element);
    alive();
  },
  change(element, init) {
    fireEvent.change(element, init);
    alive();
  }
};

// Les avertissements de React pendant un test : à créer avant show, à restaurer en fin de test.
// React n'avertit qu'une fois par page (key manquante…) : un check qui écoute un avertissement vit seul dans son
// fichier de test, et y rend le composant pour la première fois (show tait console.error pendant les autres rendus).
export function reactWarnings() {
  const spy = vi.spyOn(console, 'error').mockImplementation((...args) => guardLoop(args));
  const messages = () => spy.mock.calls.map((args) => args.map(String).join(' '));
  return {
    messages,
    missingKey: () => messages().some((m) => m.includes('unique "key" prop')),
    restore: () => spy.mockRestore()
  };
}

// Le nom accessible d'un bouton ou d'un titre, une étoile ou un emoji autour admis : named('Favoris') accepte « ⭐ Favoris ».
export const named = (word) => new RegExp(`^[^\\p{L}]*${word}[^\\p{L}]*$`, 'u');

// Les titres des cartes de conseils affichées, dans l'ordre.
export const cardTitles = () =>
  screen.queryAllByRole('article').map((card) => card.querySelector('h3')?.textContent ?? '');

// Après « Générer » : à partir de la séance 2, les conseils arrivent après un délai. On attend que les cartes
// changent (au plus 2 s), puis on rend celles affichées ; sur un état sans délai, elles ont déjà changé.
export async function cardsChanged(before, timeout = 2000) {
  try {
    await waitFor(
      () => {
        const now = cardTitles();
        if (now.length === 0 || now.join('|') === before.join('|')) throw new Error('pas encore');
      },
      { timeout }
    );
  } catch {
    // les cartes n'ont pas changé : le check qui appelle le dit avec son propre message
  }
  alive();
  return cardTitles();
}
