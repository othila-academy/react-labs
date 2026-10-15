import { useContext } from 'react';
import { act } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { alive, load, show } from '../../../shared/components.jsx';
import {
  CONTEXT_FILE,
  KEY,
  contextModule,
  focus,
  generate,
  ids,
  needContext,
  probe,
  saveFirstCard,
  stored,
  walk
} from './helpers.jsx';

// Le coach répond tout de suite : aucun délai réel.
vi.mock('@client/src/api/coach.js', async (importOriginal) => {
  const coach = await importOriginal();
  return { ...coach, fetchSuggestions: async (request) => coach.generateSuggestions(request) };
});

test('contexte-existe', async () => {
  const mod = await contextModule();
  expect(
    mod.FavoritesContext?.$$typeof,
    `${CONTEXT_FILE} n'exporte pas FavoritesContext : export const FavoritesContext = createContext(null).`
  ).toBe(Symbol.for('react.context'));
  expect(
    typeof mod.FavoritesProvider,
    `${CONTEXT_FILE} n'exporte pas FavoritesProvider : export function FavoritesProvider({ children }) { … }`
  ).toBe('function');
});

test('provider-fournit', async () => {
  const { FavoritesContext } = needContext(await contextModule());
  localStorage.setItem(KEY, JSON.stringify([walk]));
  const { Probe, seen } = probe(FavoritesContext, useContext);
  await load(async () => ({ default: Probe }), CONTEXT_FILE);
  show(<Probe />, CONTEXT_FILE);
  const value = seen.value;
  if (
    !value ||
    !Array.isArray(value.saved) ||
    typeof value.save !== 'function' ||
    typeof value.remove !== 'function'
  ) {
    const shape =
      value && typeof value === 'object' ? `{ ${Object.keys(value).join(', ')} }` : String(value);
    throw new Error(
      `Sous FavoritesProvider, useContext(FavoritesContext) vaut ${shape} : le provider doit fournir value={{ saved, save, remove }}.`
    );
  }
  expect(
    ids(value.saved),
    "Le navigateur garde un favori, mais le provider ne l'a pas relu : useState(readSaved)."
  ).toEqual([walk.id]);
  act(() => seen.value.save(focus));
  alive();
  expect(
    ids(seen.value.saved),
    "save(conseil) n'ajoute pas le conseil aux favoris du contexte."
  ).toEqual([walk.id, focus.id]);
  act(() => seen.value.remove(walk.id));
  alive();
  expect(ids(seen.value.saved), 'remove(id) ne retire pas le favori du contexte.').toEqual([
    focus.id
  ]);
  expect(
    ids(stored()),
    "Le navigateur ne garde pas les favoris du contexte : l'effet qui écrit dans localStorage a-t-il suivi l'état dans le provider ?"
  ).toEqual([focus.id]);
});

test('app-partage', async () => {
  const { FavoritesContext } = needContext(await contextModule());
  const { Probe, seen } = probe(FavoritesContext, useContext);
  const App = await load(() => import('@client/src/App.jsx'), 'src/App.jsx');
  show(
    <>
      <App />
      <Probe />
    </>,
    'src/App.jsx'
  );
  await generate();
  saveFirstCard();
  expect(
    seen.value?.saved?.length ?? 0,
    "App a sauvegardé un conseil, mais le contexte ne l'a pas : App doit lire saved, save et remove dans le contexte, pas garder son propre état."
  ).toBe(1);
});
