// Les aides des tests du lab persistance : rendre App, générer, sauvegarder, lire les favoris affichés et stockés.
import { screen, within } from '@testing-library/react';
import { cardTitles, cardsChanged, fire, load, named, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

export const FILE = 'src/App.jsx';
export const KEY = 'ai-coach:favoris';
export const [walk] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
const SAVE = named('Sauvegarder');

export async function showApp() {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  return show(<App />, FILE);
}

export async function saveFirst() {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const button = screen.queryByRole('button', { name: 'Générer' });
  if (!field || !button)
    throw new Error("App n'affiche plus le formulaire complet : voir le lab formulaire.");
  fire.type(field, 'mieux dormir');
  const before = cardTitles();
  fire.click(button);
  await cardsChanged(before);
  const card = screen.queryAllByRole('article')[0];
  const save = card && within(card).queryByRole('button', { name: SAVE });
  if (!save)
    throw new Error('Impossible de sauvegarder un conseil depuis App : voir le lab favoris.');
  fire.click(save);
}

// La liste des favoris, cherchée dans la section « Favoris » : la liste des conseils peut aussi être un <ul>.
function favoritesList() {
  const heading = screen.queryByRole('heading', { level: 2, name: named('Favoris') });
  const section = heading?.closest('section') ?? heading?.parentElement;
  return section ? within(section).queryByRole('list') : null;
}

export const shownFavorites = () =>
  favoritesList()
    ? within(favoritesList())
        .queryAllByRole('listitem')
        .map((li) => li.textContent)
    : [];

export function stored() {
  const raw = localStorage.getItem(KEY);
  try {
    return { raw, value: JSON.parse(raw) };
  } catch {
    return { raw, value: undefined };
  }
}

export function removeFirst() {
  const item = favoritesList() && within(favoritesList()).queryAllByRole('listitem')[0];
  const remove = item && within(item).queryByRole('button', { name: named('Retirer') });
  if (!remove) throw new Error('Impossible de retirer un favori depuis App : voir le lab favoris.');
  fire.click(remove);
}
