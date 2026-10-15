// Les aides des tests du lab compteur : rendre App, générer, sauvegarder, retirer, lire le badge du Header.
import { screen, within } from '@testing-library/react';
import { cardTitles, cardsChanged, fire, load, named, show } from '../../../shared/components.jsx';

export { badgeText } from '../../../shared/components.jsx';

export const FILE = 'src/App.jsx';
export const KEY = 'ai-coach:favoris';

export async function showApp() {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  return show(<App />, FILE);
}

export async function generate() {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const button = screen.queryByRole('button', { name: 'Générer' });
  if (!field || !button)
    throw new Error("App n'affiche plus le formulaire complet : voir le lab formulaire.");
  fire.type(field, 'mieux dormir');
  const before = cardTitles();
  fire.click(button);
  await cardsChanged(before);
}

// Sauvegarde la carte n° index (0, 1…).
export function saveCard(index) {
  const card = screen.queryAllByRole('article')[index];
  const save = card && within(card).queryByRole('button', { name: named('Sauvegarder') });
  if (!save)
    throw new Error('Impossible de sauvegarder un conseil depuis App : voir le lab favoris.');
  fire.click(save);
}

export function removeFirst() {
  const heading = screen.queryByRole('heading', { level: 2, name: named('Favoris') });
  const section = heading?.closest('section') ?? heading?.parentElement;
  const item = section && within(section).queryAllByRole('listitem')[0];
  const remove = item && within(item).queryByRole('button', { name: named('Retirer') });
  if (!remove) throw new Error('Impossible de retirer un favori depuis App : voir le lab favoris.');
  fire.click(remove);
}
