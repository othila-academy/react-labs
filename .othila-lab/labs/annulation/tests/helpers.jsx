// Les aides des tests du lab annulation : fetchSuggestions est remplacée (dans chaque fichier de test) par un espion
// qui respecte le signal, comme une vraie API : annulé, il rompt sa promesse avec une AbortError ; né annulé, aussitôt.
import { act, screen } from '@testing-library/react';
import { alive, fire, load, show } from '../../../shared/components.jsx';

export const FILE = 'src/App.jsx';
export const GOAL = 'mieux dormir';
export const WELLBEING = { goal: GOAL, category: 'bien-etre' };

// Branche l'espion : calls[i] = { request, signal, resolve, reject }.
export function plug(fetchSuggestions) {
  const calls = [];
  fetchSuggestions.mockReset();
  fetchSuggestions.mockImplementation(
    (request, options) =>
      new Promise((resolve, reject) => {
        const signal = options?.signal;
        calls.push({ request, signal, resolve, reject });
        const abort = () => reject(new DOMException('Requête annulée', 'AbortError'));
        if (signal?.aborted) abort();
        else signal?.addEventListener('abort', abort);
      })
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

// Générer en Bien-être : la première demande.
export async function ask(calls) {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  show(<App />, FILE);
  const { field, button } = form();
  fire.type(field, GOAL);
  fire.click(button);
  if (calls.length !== 1) {
    throw new Error('Générer ne lance plus une demande, et une seule : voir le lab effet-requete.');
  }
  return calls[0];
}

// La course du lab 13 : Générer en Bien-être (réponse reçue), puis Productivité, puis Bien-être, sans attendre.
// Rend la demande périmée (Productivité) et la demande en cours (Bien-être).
export async function race(calls, generateSuggestions) {
  await settle(await ask(calls), (call) => call.resolve(generateSuggestions(WELLBEING)));
  fire.change(form().select, { target: { value: 'productivite' } });
  fire.change(form().select, { target: { value: 'bien-etre' } });
  if (calls.length !== 3) {
    throw new Error(
      'Changer de catégorie ne relance plus la recherche (une demande par changement) : voir le lab effet-requete.'
    );
  }
  return { stale: calls[1], current: calls[2] };
}
