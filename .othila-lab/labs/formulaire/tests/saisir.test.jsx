import { screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { form, goalField, needGoal, showForm, type } from './helpers.jsx';

test('form-existe', async () => {
  await form();
});

test('champ-objectif', async () => {
  await showForm();
  expect(
    goalField(),
    "Aucun champ nommé « Objectif » : mets l'<input> dans un <label> qui commence par Objectif, c'est ce qui le nomme."
  ).not.toBeNull();
});

test('saisie', async () => {
  await showForm();
  const field = needGoal();
  type(field, 'mieux dormir');
  expect(
    field.value,
    `Après saisie de « mieux dormir », le champ affiche « ${field.value} » : sa valeur vient-elle d'un état (value={goal}) mis à jour par onChange ?`
  ).toBe('mieux dormir');
});

test('compteur', async () => {
  await showForm();
  const field = needGoal();
  expect(
    screen.queryByText('140 caractères restants'),
    'Le compteur n\'affiche pas « 140 caractères restants » au départ : un <p className="counter">{140 - goal.length} caractères restants</p> ?'
  ).not.toBeNull();
  type(field, 'mieux dormir');
  expect(
    screen.queryByText('128 caractères restants'),
    "Le compteur n'affiche pas « 128 caractères restants » après « mieux dormir » : calcule 140 - goal.length à chaque rendu."
  ).not.toBeNull();
});

test('limite', async () => {
  await showForm();
  expect(
    needGoal().maxLength,
    "Le champ accepte plus de 140 caractères : ajoute maxLength={140} à l'<input>."
  ).toBe(140);
});
