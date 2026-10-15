// Les aides des tests du cours : charger un composant de l'étudiant avec un message clair, le rendre comme main.jsx
// (sous StrictMode) avec une limite d'erreur qui dit s'il plante, et capter les avertissements de React.
import { Component, StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';

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

// load(() => import('@client/src/components/Header.jsx'), 'src/components/Header.jsx') : l'export par défaut.
// Un fichier absent est déjà signalé par lab check (« introuvable : as-tu créé ce fichier ? »).
export async function load(importer, file) {
  let mod;
  try {
    mod = await importer();
  } catch (error) {
    throw compileError(error, file) ?? error;
  }
  expect(
    typeof mod.default,
    `${file} n'a pas d'export par défaut : export default function …`
  ).toBe('function');
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

// show(<App />, 'src/App.jsx') : rendu sous StrictMode, comme dans le navigateur ; un plantage devient un échec lisible.
// React écrit l'erreur attrapée dans console.error : on la tait, sauf si reactWarnings écoute déjà (il la garde).
export function show(element, file) {
  const quiet = vi.isMockFunction(console.error)
    ? null
    : vi.spyOn(console, 'error').mockImplementation(() => {});
  let view;
  try {
    view = render(
      <StrictMode>
        <Limit>{element}</Limit>
      </StrictMode>
    );
  } finally {
    quiet?.mockRestore();
  }
  const crash = screen.queryByTestId('plantage');
  expect(crash, `${file} plante au rendu : « ${crash?.textContent} »`).toBeNull();
  return view;
}

// Les avertissements de React pendant un test : à créer avant show, à restaurer en fin de test.
// React n'avertit qu'une fois par page (key manquante…) : un check qui écoute un avertissement vit seul dans son
// fichier de test, et y rend le composant pour la première fois (show tait console.error pendant les autres rendus).
export function reactWarnings() {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const messages = () => spy.mock.calls.map((args) => args.map(String).join(' '));
  return {
    messages,
    missingKey: () => messages().some((m) => m.includes('unique "key" prop')),
    restore: () => spy.mockRestore()
  };
}
