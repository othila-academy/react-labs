import { useContext } from 'react';
import { screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { cardTitles, cardsChanged, fire, load, named, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

// Le coach répond tout de suite : aucun délai réel.
vi.mock('@client/src/api/coach.js', async (importOriginal) => {
  const coach = await importOriginal();
  return { ...coach, fetchSuggestions: async (request) => coach.generateSuggestions(request) };
});

const KEY = 'ai-coach:favoris';
const LIST = 'src/components/SuggestionsList.jsx';
const suggestions = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
const [walk] = suggestions;

// SuggestionsList seule, avec une sonde qui lit le contexte à côté (le provider est posé par les aides, comme main.jsx).
async function showList() {
  const { FavoritesContext } = await import('@client/src/context/FavoritesContext.jsx');
  const seen = { value: undefined };
  function Probe() {
    seen.value = useContext(FavoritesContext);
    return null;
  }
  const SuggestionsList = await load(
    () => import('@client/src/components/SuggestionsList.jsx'),
    LIST
  );
  show(
    <>
      <SuggestionsList suggestions={suggestions} />
      <Probe />
    </>,
    LIST
  );
  return seen;
}

const firstCardButton = () => {
  const card = screen.queryAllByRole('article')[0];
  return card ? within(card).queryByRole('button') : null;
};

test('liste-sauvegarde', async () => {
  const seen = await showList();
  const button = firstCardButton();
  if (!button)
    throw new Error("SuggestionsList n'affiche pas de carte avec un bouton : voir le lab favoris.");
  try {
    fire.click(button);
  } catch (error) {
    if (/onSave is not a function/.test(error.message)) {
      throw new Error(
        'Rendue seule, sans onSave, SuggestionsList plante au clic sur Sauvegarder : elle doit lire save dans le contexte (useContext(FavoritesContext)) et le donner aux cartes.'
      );
    }
    throw error;
  }
  expect(
    (seen.value?.saved ?? []).map((s) => s.id),
    "Le clic sur Sauvegarder n'ajoute rien au contexte : onSave={save}, le save du contexte."
  ).toEqual([walk.id]);
});

test('liste-deja', async () => {
  localStorage.setItem(KEY, JSON.stringify([walk]));
  await showList();
  expect(
    firstCardButton()?.textContent,
    'Le conseil est déjà dans les favoris, mais sa carte propose « Sauvegarder » : saved={saved.some((s) => s.id === suggestion.id)}, avec le saved du contexte.'
  ).toMatch(named('Sauvegardé'));
});

// Le texte du badge : l'élément du <header> qui parle de favori(s), ou null.
function badgeText() {
  const header = document.querySelector('header');
  const leaves = header
    ? [...header.querySelectorAll('*')].filter((el) => el.children.length === 0)
    : [];
  return leaves.map((el) => el.textContent.trim()).find((text) => /favori/i.test(text)) ?? null;
}

function favoritesSection() {
  const heading = screen.queryByRole('heading', { level: 2, name: named('Favoris') });
  return heading?.closest('section') ?? heading?.parentElement ?? null;
}

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
  const save = screen.queryAllByRole('article')[0];
  const button = save && within(save).queryByRole('button', { name: named('Sauvegarder') });
  if (!button) throw new Error('Depuis App, aucune carte à sauvegarder : voir le lab favoris.');
  fire.click(button);
  const items = () =>
    favoritesSection() ? within(favoritesSection()).queryAllByRole('listitem') : [];
  expect(
    items().length,
    "Depuis App, Sauvegarder n'ajoute plus le favori : la liste passe-t-elle save du contexte aux cartes ?"
  ).toBe(1);
  expect(badgeText(), 'Depuis App, le compteur ne suit plus la sauvegarde.').toBe('1 favori');
  const remove = within(items()[0]).queryByRole('button', { name: named('Retirer') });
  if (!remove) throw new Error("Le favori n'a plus de bouton Retirer : voir le lab favoris.");
  fire.click(remove);
  expect(
    items().length,
    'Depuis App, Retirer ne retire plus le favori : App passe-t-elle toujours remove à SavedList ?'
  ).toBe(0);
  expect(badgeText(), 'Depuis App, le compteur ne suit plus le retrait.').toBe('Aucun favori');
});

test('carte-props', async () => {
  const SuggestionCard = await load(
    () => import('@client/src/components/SuggestionCard.jsx'),
    'src/components/SuggestionCard.jsx'
  );
  const onSave = vi.fn();
  show(
    <SuggestionCard suggestion={walk} saved={false} onSave={onSave} />,
    'src/components/SuggestionCard.jsx'
  );
  const button = screen.queryByRole('button');
  if (button) fire.click(button);
  expect(
    onSave.mock.calls.length,
    'SuggestionCard ne doit pas lire le contexte : elle reste un composant de présentation, qui reçoit saved et onSave de SuggestionsList.'
  ).toBe(1);
});
