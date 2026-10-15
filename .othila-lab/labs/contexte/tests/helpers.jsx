// Les aides des tests du lab contexte : le module du contexte, une sonde qui lit le contexte, et les gestes dans App.
import { screen, within } from '@testing-library/react';
import {
  cardTitles,
  cardsChanged,
  fire,
  importModule,
  named
} from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

export const CONTEXT_FILE = 'src/context/FavoritesContext.jsx';
export const KEY = 'ai-coach:favoris';
export const [walk, focus] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });

// Le module du contexte ; ce qui manque est dit par contexte-existe, les autres checks y renvoient.
export async function contextModule() {
  const mod = await importModule(
    () => import('@client/src/context/FavoritesContext.jsx'),
    'src/context/FavoritesContext.jsx'
  );
  return mod;
}

export function needContext(mod) {
  if (
    mod.FavoritesContext?.$$typeof !== Symbol.for('react.context') ||
    typeof mod.FavoritesProvider !== 'function'
  ) {
    throw new Error(
      `${CONTEXT_FILE} n'exporte pas encore FavoritesContext et FavoritesProvider : regarde d'abord le check contexte-existe.`
    );
  }
  return mod;
}

// Une sonde : un composant du test qui lit le contexte et le garde dans seen.value.
export function probe(FavoritesContext, useContext) {
  const seen = { value: undefined };
  function Probe() {
    seen.value = useContext(FavoritesContext);
    return null;
  }
  return { Probe, seen };
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

export function saveFirstCard() {
  const card = screen.queryAllByRole('article')[0];
  const save = card && within(card).queryByRole('button', { name: named('Sauvegarder') });
  if (!save)
    throw new Error('Impossible de sauvegarder un conseil depuis App : voir le lab favoris.');
  fire.click(save);
}

export function stored() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return undefined;
  }
}

export const ids = (list) => (Array.isArray(list) ? list.map((s) => s?.id) : list);
