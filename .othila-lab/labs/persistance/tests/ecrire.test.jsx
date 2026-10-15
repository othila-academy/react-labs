import { expect, test } from 'vitest';
import { KEY, removeFirst, saveFirst, showApp, stored, walk } from './helpers.jsx';

test('ecrit', async () => {
  await showApp();
  saveFirst();
  const { raw, value } = stored();
  expect(
    raw,
    `Après Sauvegarder, localStorage n'a rien sous ${KEY} : un useEffect qui fait localStorage.setItem('${KEY}', JSON.stringify(saved)), avec [saved] en dépendances ?`
  ).not.toBeNull();
  expect(
    Array.isArray(value) && value.some((s) => s?.id === walk.id),
    `${KEY} ne contient pas le conseil sauvegardé, en JSON : JSON.stringify(saved).`
  ).toBe(true);
});

test('retire-ecrit', async () => {
  await showApp();
  saveFirst();
  if (!Array.isArray(stored().value))
    throw new Error("Les favoris ne sont pas encore écrits : regarde d'abord le check ecrit.");
  removeFirst();
  const { value } = stored();
  expect(
    Array.isArray(value) && value.some((s) => s?.id === walk.id),
    "Après Retirer, localStorage contient encore le favori : l'effet tourne-t-il à chaque changement de saved ([saved] en dépendances) ?"
  ).toBe(false);
});
