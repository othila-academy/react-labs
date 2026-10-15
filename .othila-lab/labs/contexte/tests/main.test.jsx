import { act, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

// main.jsx s'importe une seule fois par fichier : ce check vit seul.
test('main-provider', async () => {
  if (Object.keys(import.meta.glob('/src/**/FavoritesContext.{jsx,tsx}')).length === 0) {
    throw new Error(
      "src/context/FavoritesContext.jsx n'existe pas encore : regarde d'abord le check contexte-existe."
    );
  }
  document.body.innerHTML = '<div id="root"></div>';
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
  if (!shown && errors.some((e) => /null|undefined|FavoritesProvider/.test(e))) {
    throw new Error(
      `main.jsx affiche App sans FavoritesProvider (« ${errors[0]} ») : <FavoritesProvider><App /></FavoritesProvider> dans le rendu.`
    );
  }
  expect(
    shown,
    `main.jsx n'affiche pas App${errors[0] ? ` (« ${errors[0]} »)` : ''}.`
  ).not.toBeNull();
});
