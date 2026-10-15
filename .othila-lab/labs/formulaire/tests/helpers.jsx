// Les aides des tests du lab formulaire : charger CoachForm, le rendre avec un onGenerate espion, trouver ses champs.
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { fire, load, show } from '../../../shared/components.jsx';

export const FILE = 'src/components/CoachForm.jsx';
export const form = () => load(() => import('@client/src/components/CoachForm.jsx'), FILE);
export const ready = () =>
  form().catch(() => {
    throw new Error(
      "CoachForm n'est pas encore prêt : commence par le premier check (form-existe)."
    );
  });

export async function showForm() {
  const CoachForm = await ready();
  const onGenerate = vi.fn();
  show(<CoachForm onGenerate={onGenerate} />, FILE);
  return onGenerate;
}

export const goalField = () => screen.queryByRole('textbox', { name: /^\s*Objectif/ });
export const categoryField = () => screen.queryByRole('combobox', { name: /^\s*Catégorie/ });
export const generateButton = () => screen.queryByRole('button', { name: 'Générer' });

// Le champ « Objectif », ou un échec qui renvoie au check qui le demande.
export function needGoal() {
  const field = goalField();
  if (!field)
    throw new Error('Le champ « Objectif » manque encore : regarde le check champ-objectif.');
  return field;
}

export const type = (field, value) => fire.type(field, value);
