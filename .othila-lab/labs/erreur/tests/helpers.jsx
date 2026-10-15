// Les aides des tests du lab erreur : fetchSuggestions est remplacée (dans chaque fichier de test) par un espion qui
// garde une promesse par appel ; le test la tient ou la rompt quand il veut. Aucun délai réel.
import { act, screen } from '@testing-library/react';
import { alive, fire, load, named, show } from '../../../shared/components.jsx';

export const FILE = 'src/App.jsx';
export const REQUEST = { goal: 'mieux dormir', category: 'bien-etre' };
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

export async function showApp() {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  show(<App />, FILE);
}

export const generateButton = () => screen.queryByRole('button', { name: 'Générer' });

export function ask(calls) {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const button = generateButton();
  if (!field || !button)
    throw new Error("App n'affiche plus le formulaire complet : voir le lab formulaire.");
  const before = calls.length;
  fire.type(field, REQUEST.goal);
  if (before > 0 && button.disabled) {
    throw new Error(
      "Générer reste désactivé après l'échec : regarde d'abord le check fin-chargement."
    );
  }
  fire.click(button);
  if (calls.length === before)
    throw new Error("Générer n'appelle pas fetchSuggestions : voir le lab appel-asynchrone.");
}

export async function settle(call, outcome) {
  await act(async () => outcome(call));
  alive();
}

export const fail = (call) => call.reject(new Error(FAILURE));

export const alertBlock = () =>
  screen.queryAllByRole('alert').find((el) => el.textContent.includes(FAILURE));

// Une alerte affichée, mais sans le message de l'erreur : le message qui dit ce qu'elle affiche (sans ses boutons).
export function otherAlert() {
  const other = screen.queryAllByRole('alert')[0];
  if (!other || alertBlock()) return null;
  const text = [...other.querySelectorAll('button')]
    .reduce((rest, b) => rest.replace(b.textContent, ''), other.textContent)
    .trim();
  return `Le bloc role="alert" affiche « ${text} » au lieu du message de l'erreur : affiche failure.message (« ${FAILURE} »).`;
}

// L'erreur affichée, ou un échec qui renvoie au check message-erreur.
export function needAlert() {
  const block = alertBlock();
  if (!block)
    throw new Error("L'échec ne s'affiche pas encore : regarde d'abord le check message-erreur.");
  return block;
}

export const retryButton = (block) =>
  [...block.querySelectorAll('button')].find((b) => named('Réessayer').test(b.textContent));
