import { useContext } from 'react';
import { act, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import {
  alive,
  cardTitles,
  cardsChanged,
  fire,
  load,
  named,
  show,
  badgeText,
  importModule
} from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

// Le coach répond tout de suite : aucun délai réel.
vi.mock('@client/src/api/coach.js', async (importOriginal) => {
  const coach = await importOriginal();
  return { ...coach, fetchSuggestions: async (request) => coach.generateSuggestions(request) };
});

// favoritesReducer garde son comportement, mais ses appels sont comptés : clear doit passer par lui.
vi.mock('@client/src/context/favoritesReducer.js', async (importOriginal) => {
  const mod = await importOriginal();
  return { ...mod, default: vi.fn(mod.default) };
});

const KEY = 'ai-coach:favoris';
const [walk, focus] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
const CLEAR = named('Tout retirer');

async function showApp() {
  const App = await load(() => import('@client/src/App.jsx'), 'src/App.jsx');
  show(<App />, 'src/App.jsx');
}

async function generate() {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const button = screen.queryByRole('button', { name: 'Générer' });
  if (!field || !button)
    throw new Error("App n'affiche plus le formulaire complet : voir le lab formulaire.");
  fire.type(field, 'mieux dormir');
  const before = cardTitles();
  fire.click(button);
  await cardsChanged(before);
}

function saveCard(index) {
  const card = screen.queryAllByRole('article')[index];
  const save = card && within(card).queryByRole('button', { name: named('Sauvegarder') });
  if (!save) throw new Error('Depuis App, aucune carte à sauvegarder : voir le lab favoris.');
  fire.click(save);
}

function favoritesSection() {
  const heading = screen.queryByRole('heading', { level: 2, name: named('Favoris') });
  return heading?.closest('section') ?? heading?.parentElement ?? null;
}

const items = () =>
  favoritesSection() ? within(favoritesSection()).queryAllByRole('listitem') : [];
const clearButton = () =>
  favoritesSection() ? within(favoritesSection()).queryByRole('button', { name: CLEAR }) : null;

// Deux fautes typiques de ce lab, dites par leur cause plutôt que par le plantage qu'elles provoquent.
async function guarded(run) {
  try {
    await run();
  } catch (error) {
    const message = String(error?.message ?? error);
    if (/saved\.\w+ is not a function/.test(message)) {
      throw new Error(
        "Les favoris du contexte ne sont pas une liste : useReducer(favoritesReducer, undefined, readSaved) ; sans le undefined, readSaved devient l'état lui-même au lieu de le calculer."
      );
    }
    const unknown = /Action inconnue : ([^\s»]+)/.exec(message);
    if (unknown) {
      throw new Error(
        `dispatch envoie l'action « ${unknown[1]} », que favoritesReducer ne connaît pas : les types sont 'save', 'remove' et 'clear'.`
      );
    }
    throw error;
  }
}

test('contexte-clear', () =>
  guarded(async () => {
    localStorage.setItem(KEY, JSON.stringify([walk, focus]));
    const { FavoritesContext } = await importModule(
      () => import('@client/src/context/FavoritesContext.jsx'),
      'src/context/FavoritesContext.jsx'
    );
    const seen = { value: undefined };
    function Probe() {
      seen.value = useContext(FavoritesContext);
      return null;
    }
    await load(async () => ({ default: Probe }), 'src/context/FavoritesContext.jsx');
    show(<Probe />, 'src/context/FavoritesContext.jsx');
    expect(
      typeof seen.value?.clear,
      "Le contexte ne fournit pas clear : value={{ saved, save, remove, clear }}, avec clear = () => dispatch({ type: 'clear' })."
    ).toBe('function');
    expect(
      (seen.value.saved ?? []).map?.((s) => s.id),
      'Le provider ne relit plus les favoris du navigateur : useReducer(favoritesReducer, undefined, readSaved).'
    ).toEqual([walk.id, focus.id]);
    act(() => seen.value.clear());
    alive();
    expect(seen.value.saved?.length, 'clear() ne vide pas les favoris du contexte.').toBe(0);
  }));

test('tout-retirer', () =>
  guarded(async () => {
    await showApp();
    await generate();
    saveCard(0);
    saveCard(1);
    const button = clearButton();
    if (!button) {
      throw new Error(
        "La section Favoris n'a pas de bouton « Tout retirer » : ajoute-le sous la liste, avec onClick={onClear}."
      );
    }
    fire.click(button);
    expect(
      items().length,
      `Après Tout retirer, il reste ${items().length} favori(s) : App passe-t-elle clear à SavedList (onClear) ?`
    ).toBe(0);
    expect(badgeText(), 'Après Tout retirer, le compteur ne revient pas à « Aucun favori ».').toBe(
      'Aucun favori'
    );
    expect(
      JSON.parse(localStorage.getItem(KEY)),
      "Après Tout retirer, le navigateur garde encore des favoris : clear doit passer par l'état du provider, que son effet écrit."
    ).toEqual([]);
  }));

test('sans-favori', async () => {
  await showApp();
  expect(
    clearButton(),
    "Sans favori, la section propose « Tout retirer » : affiche le bouton seulement quand saved n'est pas vide."
  ).toBeNull();
});

test('favoris-toujours', () =>
  guarded(async () => {
    await showApp();
    await generate();
    saveCard(0);
    expect(
      items().length,
      "Depuis App, Sauvegarder n'ajoute plus le favori : save envoie-t-il { type: 'save', suggestion } ?"
    ).toBe(1);
    const remove = within(items()[0]).queryByRole('button', { name: named('Retirer') });
    if (!remove) throw new Error("Le favori n'a plus de bouton Retirer : voir le lab favoris.");
    fire.click(remove);
    expect(
      items().length,
      "Depuis App, Retirer ne retire plus le favori : remove envoie-t-il { type: 'remove', id } ?"
    ).toBe(0);
  }));

test('reducer-branche', () =>
  guarded(async () => {
    const { FavoritesContext } = await importModule(
      () => import('@client/src/context/FavoritesContext.jsx'),
      'src/context/FavoritesContext.jsx'
    );
    const reducer = (
      await importModule(
        () => import('@client/src/context/favoritesReducer.js'),
        'src/context/favoritesReducer.js'
      )
    ).default;
    const seen = { value: undefined };
    function Probe() {
      seen.value = useContext(FavoritesContext);
      return null;
    }
    await load(async () => ({ default: Probe }), 'src/context/FavoritesContext.jsx');
    show(<Probe />, 'src/context/FavoritesContext.jsx');
    if (typeof seen.value?.clear !== 'function') {
      throw new Error(
        "Le contexte ne fournit pas encore clear : regarde d'abord le check contexte-clear."
      );
    }
    reducer.mockClear();
    act(() => seen.value.clear());
    alive();
    expect(
      reducer.mock.calls.some(([, action]) => action?.type === 'clear'),
      "clear ne passe pas par favoritesReducer : le provider garde ses favoris avec useReducer(favoritesReducer, undefined, readSaved), et clear envoie dispatch({ type: 'clear' })."
    ).toBe(true);
  }));

test('liste-onclear', async () => {
  const SavedList = await load(
    () => import('@client/src/components/SavedList.jsx'),
    'src/components/SavedList.jsx'
  );
  const onClear = vi.fn();
  show(
    <SavedList saved={[walk, focus]} onRemove={vi.fn()} onClear={onClear} />,
    'src/components/SavedList.jsx'
  );
  const button = screen.queryByRole('button', { name: CLEAR });
  if (!button) {
    throw new Error(
      "SavedList, rendue seule avec des favoris, n'a pas de bouton « Tout retirer » : ajoute-le sous la liste, avec onClick={onClear}."
    );
  }
  fire.click(button);
  expect(
    onClear.mock.calls.length,
    "SavedList ne doit pas lire le contexte : elle reste un composant de présentation, qui reçoit onClear d'App et l'appelle au clic."
  ).toBe(1);
});
