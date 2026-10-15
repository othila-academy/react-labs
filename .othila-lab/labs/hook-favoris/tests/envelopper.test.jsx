import { Component } from 'react';
import { render, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import {
  cardTitles,
  cardsChanged,
  fire,
  importModule,
  load,
  named,
  show
} from '../../../shared/components.jsx';

// Le coach répond tout de suite : aucun délai réel.
vi.mock('@client/src/api/coach.js', async (importOriginal) => {
  const coach = await importOriginal();
  return { ...coach, fetchSuggestions: async (request) => coach.generateSuggestions(request) };
});

const FILE = 'src/context/FavoritesContext.jsx';

async function hook() {
  const mod = await importModule(
    () => import('@client/src/context/FavoritesContext.jsx'),
    'src/context/FavoritesContext.jsx'
  );
  if (typeof mod.useFavorites !== 'function') {
    throw new Error(
      `${FILE} n'exporte pas encore useFavorites : regarde d'abord le check hook-existe.`
    );
  }
  return mod.useFavorites;
}

const shape = (value) =>
  value && typeof value === 'object' ? `{ ${Object.keys(value).join(', ')} }` : String(value);

test('hook-existe', async () => {
  const mod = await importModule(
    () => import('@client/src/context/FavoritesContext.jsx'),
    'src/context/FavoritesContext.jsx'
  );
  expect(
    typeof mod.useFavorites,
    `${FILE} n'exporte pas useFavorites : export function useFavorites() { … }`
  ).toBe('function');
});

test('hook-rend', async () => {
  const useFavorites = await hook();
  const seen = { value: undefined };
  function Probe() {
    seen.value = useFavorites();
    return null;
  }
  await load(async () => ({ default: Probe }), FILE);
  show(<Probe />, FILE);
  const value = seen.value;
  const complete =
    value &&
    Array.isArray(value.saved) &&
    ['save', 'remove', 'clear'].every((name) => typeof value[name] === 'function');
  expect(
    complete,
    `Sous FavoritesProvider, useFavorites() rend ${shape(value)} : rends la valeur du contexte, return useContext(FavoritesContext).`
  ).toBe(true);
});

class Catch extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}

test('hors-provider', async () => {
  const useFavorites = await hook();
  const seen = { value: undefined, error: null };
  function Probe() {
    seen.value = useFavorites();
    return null;
  }
  const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    // Sans les aides : elles posent le provider ; ici, il ne doit pas y en avoir.
    render(
      <Catch ref={(boundary) => (seen.boundary = boundary)}>
        <Probe />
      </Catch>
    );
  } finally {
    quiet.mockRestore();
  }
  const error = seen.boundary?.state.error ?? null;
  if (!error) {
    throw new Error(
      `Hors d'un FavoritesProvider, useFavorites() rend ${shape(seen.value)} au lieu de lever une erreur : if (!value) throw new Error('useFavorites doit être utilisé sous un FavoritesProvider').`
    );
  }
  expect(
    String(error.message),
    `L'erreur levée ne nomme pas FavoritesProvider (« ${error.message} ») : dis ce qui manque.`
  ).toMatch(/FavoritesProvider/);
});

test('favoris-toujours', async () => {
  const App = await load(() => import('@client/src/App.jsx'), 'src/App.jsx');
  show(<App />, 'src/App.jsx');
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const generate = screen.queryByRole('button', { name: 'Générer' });
  if (!field || !generate)
    throw new Error("App n'affiche plus le formulaire complet : voir le lab formulaire.");
  fire.type(field, 'mieux dormir');
  const before = cardTitles();
  fire.click(generate);
  await cardsChanged(before);
  const cards = screen.queryAllByRole('article');
  for (const card of cards.slice(0, 2)) {
    const save = within(card).queryByRole('button', { name: named('Sauvegarder') });
    if (!save) throw new Error('Depuis App, aucune carte à sauvegarder : voir le lab favoris.');
    fire.click(save);
  }
  const heading = screen.queryByRole('heading', { level: 2, name: named('Favoris') });
  const section = heading?.closest('section') ?? heading?.parentElement;
  const items = () => (section ? within(section).queryAllByRole('listitem') : []);
  expect(items().length, "Depuis App, Sauvegarder n'ajoute plus les favoris.").toBe(2);
  fire.click(within(items()[0]).getByRole('button', { name: named('Retirer') }));
  expect(items().length, 'Depuis App, Retirer ne retire plus le favori.').toBe(1);
  const clear = within(section).queryByRole('button', { name: named('Tout retirer') });
  if (!clear)
    throw new Error(
      "La section Favoris n'a plus de bouton « Tout retirer » : voir le lab dispatch."
    );
  fire.click(clear);
  expect(items().length, 'Depuis App, Tout retirer ne vide plus les favoris.').toBe(0);
});
