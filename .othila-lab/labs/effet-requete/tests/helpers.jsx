// Les aides des tests du lab effet-requete : fetchSuggestions est remplacée (dans chaque fichier de test) par un espion
// qui garde une promesse par appel ; le test la tient ou la rompt quand il veut. Aucun délai réel.
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

// Affiche App ; au montage, personne n'a encore rien demandé : aucun appel.
export async function showApp(calls) {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  show(<App />, FILE);
  if (calls.length > 0) {
    throw new Error(
      `Au montage, avant toute demande, App appelle déjà fetchSuggestions (avec ${JSON.stringify(calls[0].request)}) : l'effet doit s'arrêter tant que request est null (if (!request) return).`
    );
  }
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

// Une demande en bien-être, par Générer.
export function ask(calls) {
  const { field, button } = form();
  const before = calls.length;
  fire.type(field, REQUEST.goal);
  if (before > 0 && button.disabled) {
    throw new Error(
      "Générer reste désactivé après la demande précédente : dans l'effet, remets loading à false dans finally."
    );
  }
  fire.click(button);
  if (calls.length === before) {
    throw new Error(
      "Générer n'appelle plus fetchSuggestions : Générer doit remplacer request (onGenerate={setRequest}), et l'effet, qui dépend de [request], charger les conseils."
    );
  }
  if (calls.length - before > 1) {
    throw new Error(
      `Une seule demande a lancé ${calls.length - before} appels à fetchSuggestions : l'effet tourne-t-il à chaque rendu ? Donne-lui ses dépendances : [request].`
    );
  }
}

// Choisit une catégorie dans le menu (cherché seul : pendant l'attente, le bouton peut changer de libellé).
export function choose(category) {
  const select = screen.queryByRole('combobox', { name: /^\s*Catégorie/ });
  if (!select)
    throw new Error("App n'affiche plus le menu « Catégorie » : voir le lab formulaire.");
  fire.change(select, { target: { value: category } });
}

// Le bouton d'envoi du formulaire, trouvé par sa place et non par son texte (il peut changer pendant l'attente).
export const submitButton = () =>
  screen
    .queryByRole('textbox', { name: /^\s*Objectif/ })
    ?.closest('form')
    ?.querySelector('button[type="submit"], button:not([type])') ?? null;

export async function settle(call, outcome) {
  await act(async () => outcome(call));
  alive();
}

export const fail = (call) => call.reject(new Error(FAILURE));

export const alertBlock = () =>
  screen.queryAllByRole('alert').find((el) => el.textContent.includes(FAILURE));

export const retryButton = (block) =>
  [...block.querySelectorAll('button')].find((b) => named('Réessayer').test(b.textContent));
