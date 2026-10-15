// Les aides des tests du lab requete-perimee : fetchSuggestions est remplacée (dans chaque fichier de test) par un espion
// qui garde une promesse par appel ; le test les tient ou les rompt dans l'ordre qu'il choisit. Aucun délai réel.
import { act, screen } from '@testing-library/react';
import { alive, fire, load, show } from '../../../shared/components.jsx';

export const FILE = 'src/App.jsx';
export const GOAL = 'mieux dormir';
export const WELLBEING = { goal: GOAL, category: 'bien-etre' };
export const PRODUCTIVITY = { goal: GOAL, category: 'productivite' };
export const FAILURE = 'Le coach ne répond pas pour le moment.';
export const WAITING = /Le coach réfléchit(…|\.\.\.)/;

// Branche l'espion : calls[i] = { request, resolve, reject }.
export function plug(fetchSuggestions) {
  const calls = [];
  fetchSuggestions.mockReset();
  fetchSuggestions.mockImplementation(
    (request) => new Promise((resolve, reject) => calls.push({ request, resolve, reject }))
  );
  return calls;
}

export async function settle(call, outcome) {
  await act(async () => outcome(call));
  alive();
}

function form() {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const select = screen.queryByRole('combobox', { name: /^\s*Catégorie/ });
  const button = screen.queryByRole('button', { name: 'Générer' });
  if (!field || !select || !button) {
    throw new Error(
      "App n'affiche plus le formulaire complet (Objectif, Catégorie, Générer) : voir le lab formulaire."
    );
  }
  return { field, select, button };
}

// La course : Générer en Bien-être (réponse reçue), puis Productivité, puis Bien-être, sans attendre.
// Rend la demande périmée (Productivité) et la demande en cours (Bien-être), encore en attente toutes les deux.
export async function race(calls, generateSuggestions) {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  show(<App />, FILE);
  const { field, select, button } = form();
  fire.type(field, GOAL);
  fire.click(button);
  if (calls.length !== 1) {
    throw new Error('Générer ne lance plus une demande, et une seule : voir le lab effet-requete.');
  }
  await settle(calls[0], (call) => call.resolve(generateSuggestions(WELLBEING)));
  fire.change(select, { target: { value: 'productivite' } });
  fire.change(select, { target: { value: 'bien-etre' } });
  if (calls.length !== 3) {
    throw new Error(
      'Changer de catégorie ne relance plus la recherche (une demande par changement) : voir le lab effet-requete.'
    );
  }
  return { stale: calls[1], current: calls[2] };
}

export const alertBlock = () =>
  screen.queryAllByRole('alert').find((el) => el.textContent.includes(FAILURE));
