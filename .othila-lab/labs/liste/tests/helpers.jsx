// Les aides des tests du lab liste : charger SuggestionsList, et rendre la liste en traduisant le plantage
// typique (une SuggestionCard sans conseil) en message.
import { screen } from '@testing-library/react';
import { load, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

export const FILE = 'src/components/SuggestionsList.jsx';
export const three = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
export const EMPTY = "Aucune suggestion pour l'instant";

export const list = () => load(() => import('@client/src/components/SuggestionsList.jsx'), FILE);
export const ready = () =>
  list().catch(() => {
    throw new Error(
      "SuggestionsList n'est pas encore prête : commence par le premier check (liste-existe)."
    );
  });

export function showList(SuggestionsList, suggestions) {
  try {
    return show(<SuggestionsList suggestions={suggestions} />, FILE);
  } catch (error) {
    if (/reading '(title|description|tag)'/.test(error.message)) {
      throw new Error(
        'Les cartes plantent : SuggestionCard ne reçoit pas de conseil. Passes-tu suggestion={suggestion} à chaque SuggestionCard ?'
      );
    }
    throw error;
  }
}

export const titles = () =>
  screen.queryAllByRole('article').map((card) => card.querySelector('h3')?.textContent ?? '');
