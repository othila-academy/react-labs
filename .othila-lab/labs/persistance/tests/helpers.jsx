// Les aides des tests du lab persistance : rendre App, générer, sauvegarder, lire les favoris affichés et stockés.
import { fireEvent, screen, within } from '@testing-library/react';
import { load, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

export const FILE = 'src/App.jsx';
export const KEY = 'ai-coach:favoris';
export const [walk] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
const SAVE = /^[^\p{L}]*Sauvegarder[^\p{L}]*$/u;

export async function showApp() {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  return show(<App />, FILE);
}

export function saveFirst() {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const button = screen.queryByRole('button', { name: 'Générer' });
  if (!field || !button)
    throw new Error("App n'affiche plus le formulaire complet : voir le lab formulaire.");
  fireEvent.change(field, { target: { value: 'mieux dormir' } });
  fireEvent.click(button);
  const card = screen.queryAllByRole('article')[0];
  const save = card && within(card).queryByRole('button', { name: SAVE });
  if (!save)
    throw new Error('Impossible de sauvegarder un conseil depuis App : voir le lab favoris.');
  fireEvent.click(save);
}

export const shownFavorites = () =>
  screen.queryByRole('list')
    ? within(screen.getByRole('list'))
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
  const item =
    screen.queryByRole('list') && within(screen.getByRole('list')).queryAllByRole('listitem')[0];
  const remove = item && within(item).queryByRole('button', { name: 'Retirer' });
  if (!remove) throw new Error('Impossible de retirer un favori depuis App : voir le lab favoris.');
  fireEvent.click(remove);
}
