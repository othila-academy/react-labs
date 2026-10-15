// Les aides des tests du cours : charger un composant de l'étudiant avec un message clair, le rendre comme main.jsx
// (sous StrictMode) avec une limite d'erreur qui dit s'il plante, et capter les avertissements de React.
import { Component, StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';

// load(() => import('@client/src/components/Header.jsx'), 'src/components/Header.jsx') : l'export par défaut.
// Un fichier absent est déjà signalé par lab check (« introuvable : as-tu créé ce fichier ? »).
export async function load(importer, file) {
  const mod = await importer();
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
export function reactWarnings() {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const messages = () => spy.mock.calls.map((args) => args.map(String).join(' '));
  return {
    messages,
    missingKey: () => messages().some((m) => m.includes('unique "key" prop')),
    restore: () => spy.mockRestore()
  };
}
