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
  if (!Array.isArray(value)) {
    throw new Error(
      `${KEY} n'est pas une liste en JSON (il vaut ${raw}) : écris JSON.stringify(saved).`
    );
  }
  if (!value.some((s) => s?.id === walk.id)) {
    throw new Error(
      `${KEY} ne contient pas le favori après Sauvegarder (il vaut ${raw}) : l'effet n'a pas tourné quand saved a changé ; mets [saved] dans son tableau de dépendances.`
    );
  }
});

test('retire-ecrit', async () => {
  await showApp();
  saveFirst();
  const written = stored().value;
  if (!Array.isArray(written) || !written.some((s) => s?.id === walk.id)) {
    throw new Error(
      "Le favori n'est pas encore écrit après Sauvegarder : regarde d'abord le check ecrit."
    );
  }
  removeFirst();
  const { value } = stored();
  expect(
    Array.isArray(value) && value.some((s) => s?.id === walk.id),
    "Après Retirer, localStorage contient encore le favori : l'effet tourne-t-il à chaque changement de saved ([saved] en dépendances) ?"
  ).toBe(false);
});
