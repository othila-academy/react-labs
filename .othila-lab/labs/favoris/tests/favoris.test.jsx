import { fireEvent, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { load, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

const FILE = 'src/App.jsx';
const NONE = "Aucun favori pour l'instant";
const [walk] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
const SAVE = /^[^\p{L}]*Sauvegarder[^\p{L}]*$/u;
const SAVED = /^[^\p{L}]*Sauvegardé[^\p{L}]*$/u;

async function showApp() {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  show(<App />, FILE);
}

// Génère les conseils de bien-être ; un formulaire ou une liste cassés renvoient aux labs précédents.
function generate() {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const button = screen.queryByRole('button', { name: 'Générer' });
  if (!field || !button)
    throw new Error("App n'affiche plus le formulaire complet : voir le lab formulaire.");
  fireEvent.change(field, { target: { value: 'mieux dormir' } });
  fireEvent.click(button);
  const card = screen.queryAllByRole('article')[0];
  if (!card) throw new Error('Après Générer, aucune carte : voir le lab remonter-etat.');
  return card;
}

const savedTitles = () =>
  (screen.queryByRole('list')
    ? within(screen.getByRole('list')).queryAllByRole('listitem')
    : []
  ).map((li) => li.textContent);

function saveFirst() {
  const card = generate();
  const button = within(card).queryByRole('button', { name: SAVE });
  if (!button)
    throw new Error("Les cartes n'ont pas de bouton « Sauvegarder » : regarde l'étape carte.");
  fireEvent.click(button);
  return card;
}

test('favoris-vide', async () => {
  await showApp();
  expect(
    screen.queryByRole('heading', { level: 2, name: 'Favoris' }),
    "La page n'a pas de section « Favoris » : App affiche-t-elle <SavedList /> ? un <h2>Favoris</h2> ?"
  ).not.toBeNull();
  expect(screen.queryByText(NONE), `Au départ, la page n'affiche pas « ${NONE} ».`).not.toBeNull();
});

test('sauvegarder', async () => {
  await showApp();
  const card = saveFirst();
  expect(
    savedTitles().some((text) => text.includes(walk.title)),
    "Après Sauvegarder, le conseil n'apparaît pas dans les favoris : la fonction passée en onSave ajoute-t-elle le conseil à l'état d'App ? SuggestionsList la fait-elle passer aux cartes ?"
  ).toBe(true);
  expect(
    within(card).queryByRole('button', { name: SAVED }),
    'Le conseil est dans les favoris, mais sa carte propose encore « Sauvegarder » : App passe-t-elle savedIds à SuggestionsList, et la liste saved à chaque carte ?'
  ).not.toBeNull();
});

test('retirer', async () => {
  await showApp();
  const card = saveFirst();
  const item =
    screen.queryByRole('list') && within(screen.getByRole('list')).queryAllByRole('listitem')[0];
  const remove = item && within(item).queryByRole('button', { name: 'Retirer' });
  if (!remove)
    throw new Error(
      "Le favori n'a pas de bouton « Retirer » (ou la sauvegarde ne marche pas encore : regarde le check sauvegarder)."
    );
  fireEvent.click(remove);
  expect(
    savedTitles().some((text) => text.includes(walk.title)),
    "Après Retirer, le favori est toujours là : la fonction passée en onRemove retire-t-elle le conseil de l'état d'App (filter) ?"
  ).toBe(false);
  expect(
    within(card).queryByRole('button', { name: SAVE }),
    "Après Retirer, la carte ne propose pas de nouveau « Sauvegarder » : son saved vient-il bien des favoris d'App ?"
  ).not.toBeNull();
});
