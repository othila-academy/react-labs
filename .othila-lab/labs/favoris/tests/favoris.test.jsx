import { screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import { fire, load, named, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

const FILE = 'src/App.jsx';
const NONE = "Aucun favori pour l'instant";
const [walk] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
const SAVE = named('Sauvegarder');
const SAVED = named('Sauvegardé');

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
  fire.type(field, 'mieux dormir');
  fire.click(button);
  const card = screen.queryAllByRole('article')[0];
  if (!card) throw new Error('Après Générer, aucune carte : voir le lab remonter-etat.');
  return card;
}

// La liste des favoris, cherchée dans la section « Favoris » : la liste des conseils peut aussi être un <ul>.
function favoritesList() {
  const heading = screen.queryByRole('heading', { level: 2, name: named('Favoris') });
  const section = heading?.closest('section') ?? heading?.parentElement;
  return section ? within(section).queryByRole('list') : null;
}

const savedTitles = () =>
  (favoritesList() ? within(favoritesList()).queryAllByRole('listitem') : []).map(
    (li) => li.textContent
  );

// Sans section « Favoris », c'est favoris-vide qui le dit : les checks suivants y renvoient.
function needSection() {
  if (!screen.queryByRole('heading', { level: 2, name: named('Favoris') })) {
    throw new Error(
      "La section « Favoris » manque encore : regarde d'abord le check favoris-vide."
    );
  }
}

function saveFirst() {
  needSection();
  const card = generate();
  const button = within(card).queryByRole('button', { name: SAVE });
  if (!button)
    throw new Error("Les cartes n'ont pas de bouton « Sauvegarder » : regarde l'étape carte.");
  fire.click(button);
  return card;
}

test('favoris-vide', async () => {
  await showApp();
  expect(
    screen.queryByRole('heading', { level: 2, name: named('Favoris') }),
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
  const item = favoritesList() && within(favoritesList()).queryAllByRole('listitem')[0];
  const remove = item && within(item).queryByRole('button', { name: named('Retirer') });
  if (!remove)
    throw new Error(
      "Le favori n'a pas de bouton « Retirer » (ou la sauvegarde ne marche pas encore : regarde le check sauvegarder)."
    );
  fire.click(remove);
  expect(
    savedTitles().some((text) => text.includes(walk.title)),
    "Après Retirer, le favori est toujours là : la fonction passée en onRemove retire-t-elle le conseil de l'état d'App (filter) ?"
  ).toBe(false);
  expect(
    within(card).queryByRole('button', { name: SAVE }),
    "Après Retirer, la carte ne propose pas de nouveau « Sauvegarder » : son saved vient-il bien des favoris d'App ?"
  ).not.toBeNull();
});
