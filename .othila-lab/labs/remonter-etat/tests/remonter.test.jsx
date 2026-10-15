import { screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { cardTitles, cardsChanged, fire, load, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

const FILE = 'src/App.jsx';
const EMPTY = "Aucune suggestion pour l'instant";
const titlesOf = (request) => generateSuggestions(request).map((s) => s.title);

async function showApp() {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  show(<App />, FILE);
}

// Remplit le formulaire d'App et envoie ; un formulaire incomplet renvoie au lab formulaire.
function ask(goal, category) {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const select = screen.queryByRole('combobox', { name: /^\s*Catégorie/ });
  const button = screen.queryByRole('button', { name: 'Générer' });
  if (!field || !select || !button) {
    throw new Error(
      "App n'affiche pas un formulaire complet (Objectif, Catégorie, Générer) : CoachForm est-il toujours affiché ? Voir le lab formulaire."
    );
  }
  fire.type(field, goal);
  fire.change(select, { target: { value: category } });
  fire.click(button);
}

test('titre-toujours', async () => {
  await showApp();
  expect(
    screen.queryByRole('heading', { level: 1, name: 'AI Coach' }),
    "La page n'affiche plus le titre « AI Coach » : App affiche-t-elle toujours <Header /> ?"
  ).not.toBeNull();
});

test('depart-vide', async () => {
  await showApp();
  const shown = cardTitles().length;
  expect(
    shown,
    `Au départ, la page affiche déjà ${shown} conseil(s) : App doit partir d'une liste vide, gardée dans son état : useState([]).`
  ).toBe(0);
  expect(
    screen.queryByText(EMPTY),
    `Au départ, la page n'affiche pas « ${EMPTY} » : App passe-t-elle sa liste (vide) à SuggestionsList ?`
  ).not.toBeNull();
});

test('generer', async () => {
  await showApp();
  const before = cardTitles();
  ask('mieux dormir', 'productivite');
  const after = await cardsChanged(before);
  expect(
    after.length > 0 && after.join() !== before.join(),
    "Après Générer, les cartes ne changent pas : la fonction donnée à onGenerate met-elle à jour l'état d'App (setSuggestions) ?"
  ).toBe(true);
  expect(
    after,
    "Les cartes ne correspondent pas à la demande : appelles-tu generateSuggestions avec l'objet reçu par onGenerate ?"
  ).toEqual(titlesOf({ goal: 'mieux dormir', category: 'productivite' }));
});

test('regenerer', async () => {
  await showApp();
  ask('mieux dormir', 'productivite');
  const first = await cardsChanged([]);
  if (first.join() !== titlesOf({ goal: 'mieux dormir', category: 'productivite' }).join()) {
    throw new Error(
      "La première demande n'affiche pas encore les bons conseils : regarde d'abord le check generer."
    );
  }
  const before = cardTitles();
  ask('dormir plus tôt', 'bien-etre');
  const shown = await cardsChanged(before);
  expect(
    shown.length,
    `Après une deuxième demande, la page affiche ${shown.length} cartes : remplace la liste (setSuggestions(nouveaux)) au lieu de l'allonger.`
  ).toBe(3);
  expect(
    shown,
    'Après une deuxième demande, les cartes ne sont pas celles de la nouvelle demande.'
  ).toEqual(titlesOf({ goal: 'dormir plus tôt', category: 'bien-etre' }));
});
