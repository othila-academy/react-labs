import { fireEvent, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { load, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

const FILE = 'src/components/SuggestionCard.jsx';
const [walk] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
// Le texte du bouton, une étoile autour admise.
const SAVE = /^[^\p{L}]*Sauvegarder[^\p{L}]*$/u;
const SAVED = /^[^\p{L}]*Sauvegardé[^\p{L}]*$/u;

async function showCard(props) {
  const SuggestionCard = await load(
    () => import('@client/src/components/SuggestionCard.jsx'),
    FILE
  );
  show(<SuggestionCard suggestion={walk} {...props} />, FILE);
}

function needSave() {
  const button = screen.queryByRole('button', { name: SAVE });
  if (!button)
    throw new Error(
      "La carte n'a pas encore de bouton « Sauvegarder » : regarde le check bouton-sauvegarder."
    );
  return button;
}

test('bouton-sauvegarder', async () => {
  await showCard({ onSave: vi.fn() });
  const button = screen.queryByRole('button', { name: SAVE });
  expect(
    button,
    'La carte n\'a pas de bouton « Sauvegarder » : ajoute <button type="button" onClick={…}>Sauvegarder</button> dans l\'<article>.'
  ).not.toBeNull();
  expect(
    button.disabled,
    "Le bouton « Sauvegarder » d'un conseil non sauvegardé est désactivé : disabled={saved}, et saved vaut false par défaut."
  ).toBe(false);
});

test('clic-sauvegarde', async () => {
  const onSave = vi.fn();
  await showCard({ onSave });
  fireEvent.click(needSave());
  expect(
    onSave.mock.calls.length,
    "Le clic n'appelle pas onSave : onClick={() => onSave(suggestion)} sur le bouton."
  ).toBe(1);
  expect(
    onSave.mock.calls[0][0],
    `onSave a reçu ${JSON.stringify(onSave.mock.calls[0][0])} au lieu du conseil : passe-lui suggestion, l'objet entier.`
  ).toEqual(walk);
});

test('deja-sauvegarde', async () => {
  await showCard({ onSave: vi.fn(), saved: true });
  if (screen.queryAllByRole('button').length === 0) {
    throw new Error("La carte n'a pas encore de bouton : regarde le check bouton-sauvegarder.");
  }
  expect(
    screen.queryByRole('button', { name: SAVE }),
    "Avec saved, la carte propose encore « Sauvegarder » : affiche {saved ? 'Sauvegardé' : 'Sauvegarder'}."
  ).toBeNull();
  const button = screen.queryByRole('button', { name: SAVED });
  expect(button, "Avec saved, la carte n'affiche pas de bouton « Sauvegardé ».").not.toBeNull();
  expect(
    button.disabled,
    'Avec saved, le bouton « Sauvegardé » reste cliquable : disabled={saved}.'
  ).toBe(true);
});
