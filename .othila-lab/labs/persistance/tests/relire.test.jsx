import { screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { KEY, saveFirst, showApp, shownFavorites, stored, walk } from './helpers.jsx';

// À partir de la séance 2, App attend fetchSuggestions : ici, le coach répond tout de suite, sans délai réel.
vi.mock('@client/src/api/coach.js', async (importOriginal) => {
  const coach = await importOriginal();
  return { ...coach, fetchSuggestions: async (request) => coach.generateSuggestions(request) };
});

test('relit', async () => {
  localStorage.setItem(KEY, JSON.stringify([walk]));
  await showApp();
  const overwritten = !(stored().value ?? []).some?.((s) => s?.id === walk.id);
  expect(
    shownFavorites().some((text) => text.includes(walk.title)),
    overwritten
      ? "Au démarrage, les favoris de localStorage ne s'affichent pas, et ils ont été écrasés par une liste vide : lis-les dans la valeur initiale de l'état, useState(() => …), avant que l'effet d'écriture ne tourne."
      : "Au démarrage, les favoris de localStorage ne s'affichent pas : lis-les dans la valeur initiale de l'état, useState(() => …)."
  ).toBe(true);
});

test('rechargement', async () => {
  const first = await showApp();
  await saveFirst();
  const written = stored().value;
  if (!Array.isArray(written) || !written.some((s) => s?.id === walk.id)) {
    throw new Error(
      "Le favori n'est pas encore écrit après Sauvegarder : regarde d'abord l'étape ecrire."
    );
  }
  first.unmount();
  await showApp();
  expect(
    shownFavorites().some((text) => text.includes(walk.title)),
    'Après rechargement, le favori a disparu : il est écrit (étape ecrire), mais est-il relu au démarrage ?'
  ).toBe(true);
});

test('illisible', async () => {
  for (const [content, hint] of [
    ['{cassé', "entoure JSON.parse d'un try/catch et repars d'une liste vide"],
    ['42', "vérifie Array.isArray avant de l'utiliser"]
  ]) {
    localStorage.setItem(KEY, content);
    let view;
    try {
      view = await showApp();
    } catch (error) {
      const crash = error.message;
      throw new Error(`Avec un ${KEY} qui vaut « ${content} », App plante : ${hint}. (${crash})`);
    }
    expect(
      shownFavorites(),
      `Avec un ${KEY} qui vaut « ${content} », App affiche des favoris : repars d'une liste vide.`
    ).toEqual([]);
    expect(
      screen.queryByText("Aucun favori pour l'instant"),
      `Avec un ${KEY} illisible, la section Favoris doit dire « Aucun favori pour l'instant ».`
    ).not.toBeNull();
    view.unmount();
    localStorage.clear();
  }
});
