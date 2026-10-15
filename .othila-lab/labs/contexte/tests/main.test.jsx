import { act, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { PROVIDER_HIDES, contextMessage } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

const [walk] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });

// main.jsx s'importe une seule fois par fichier : ce check vit seul.
test('main-provider', async () => {
  if (Object.keys(import.meta.glob('/src/**/FavoritesContext.{jsx,tsx}')).length === 0) {
    throw new Error(
      "src/context/FavoritesContext.jsx n'existe pas encore : regarde d'abord le check contexte-existe."
    );
  }
  document.body.innerHTML = '<div id="root"></div>';
  // Un favori gardé par le navigateur : seul un FavoritesProvider au-dessus d'App le relit.
  localStorage.setItem('ai-coach:favoris', JSON.stringify([walk]));
  const errors = [];
  const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
  const listen = (event) => {
    errors.push(String(event.error?.message ?? event.message));
    event.preventDefault();
  };
  window.addEventListener('error', listen);
  try {
    await act(async () => {
      await import('@client/src/main.jsx');
    });
  } catch (error) {
    errors.push(String(error?.message ?? error));
  } finally {
    window.removeEventListener('error', listen);
    quiet.mockRestore();
  }
  const shown = screen.queryByRole('heading', { name: 'AI Coach' });
  const lost = errors.find((e) => contextMessage(e, 'App'));
  if (!shown && lost && contextMessage(lost, 'App').includes('vaut null')) {
    throw new Error(
      'main.jsx affiche App sans FavoritesProvider au-dessus (useContext vaut null) : <FavoritesProvider><App /></FavoritesProvider> dans le rendu.'
    );
  }
  if (!shown && lost) throw new Error(`Depuis main.jsx, ${contextMessage(lost, 'App')}`);
  if (!shown && errors.length === 0)
    throw new Error(`main.jsx n'affiche pas App : ${PROVIDER_HIDES}`);
  expect(
    shown,
    `main.jsx n'affiche pas App${errors[0] ? ` (« ${errors[0]} »)` : ''}.`
  ).not.toBeNull();
  expect(
    screen.queryByText(walk.title),
    "Depuis main.jsx, le favori gardé par le navigateur n'est pas relu : <FavoritesProvider><App /></FavoritesProvider> dans le rendu."
  ).not.toBeNull();
});
