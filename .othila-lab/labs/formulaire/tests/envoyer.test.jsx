import { createEvent, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import { categoryField, generateButton, needGoal, showForm, type } from './helpers.jsx';

function needButton() {
  const button = generateButton();
  if (!button)
    throw new Error(
      'Aucun bouton « Générer » : ajoute <button type="submit">Générer</button> au formulaire.'
    );
  return button;
}

test('categorie', async () => {
  await showForm();
  const select = categoryField();
  expect(
    select,
    'Aucun menu nommé « Catégorie » : un <select> dans un <label> qui commence par Catégorie.'
  ).not.toBeNull();
  const options = [...select.options].map((o) => [o.value, o.textContent.trim()]);
  expect(
    options,
    'Le menu ne propose pas Bien-être et Productivité : fais un CATEGORIES.map(…) en <option value={c.value}>{c.label}</option>.'
  ).toEqual([
    ['bien-etre', 'Bien-être'],
    ['productivite', 'Productivité']
  ]);
  expect(select.value, 'Le menu ne part pas sur Bien-être : useState(CATEGORIES[0].value).').toBe(
    'bien-etre'
  );
});

test('bouton-desactive', async () => {
  await showForm();
  const field = needGoal();
  const button = needButton();
  for (const value of ['', 'court', 'court      ']) {
    type(field, value);
    expect(
      button.disabled,
      `Avec « ${value} », Générer reste cliquable : disabled={goal.trim().length < 10} (les espaces au bord ne comptent pas).`
    ).toBe(true);
  }
  type(field, 'mieux dormir');
  expect(
    button.disabled,
    'Avec « mieux dormir » (12 caractères), Générer reste désactivé : la limite est de 10 caractères au moins.'
  ).toBe(false);
});

test('envoi', async () => {
  const onGenerate = await showForm();
  type(needGoal(), 'finir mon mémoire');
  const select = categoryField();
  if (!select) throw new Error('Le menu « Catégorie » manque encore : regarde le check categorie.');
  fireEvent.change(select, { target: { value: 'productivite' } });
  fireEvent.click(needButton());
  expect(
    onGenerate.mock.calls.length,
    'Après Générer, onGenerate n\'a pas été appelée une fois : le <form> a-t-il un onSubmit qui l\'appelle, et le bouton type="submit" ?'
  ).toBe(1);
  const [request] = onGenerate.mock.calls[0];
  expect(
    request,
    `onGenerate a reçu ${JSON.stringify(request)} au lieu de { goal: 'finir mon mémoire', category: 'productivite' } : envoie l'objectif et la catégorie de l'état.`
  ).toEqual({ goal: 'finir mon mémoire', category: 'productivite' });
});

test('sans-rechargement', async () => {
  await showForm();
  type(needGoal(), 'mieux dormir');
  const element = needGoal().closest('form');
  if (!element)
    throw new Error(
      "Le champ n'est dans aucun <form> : enveloppe le formulaire dans <form onSubmit={…}>."
    );
  const submit = createEvent.submit(element);
  fireEvent(element, submit);
  expect(
    submit.defaultPrevented,
    "L'envoi rechargerait la page : appelle event.preventDefault() dans le gestionnaire onSubmit du <form>."
  ).toBe(true);
});
