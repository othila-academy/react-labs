import { act, screen } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { alive, fire, load, show } from '../../../shared/components.jsx';

// fetchSuggestions est remplacée par un espion dont le test tient la promesse : « pendant l'attente » veut dire
// « promesse pas encore tenue ». Aucun délai réel.
vi.mock('@client/src/api/coach.js', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchSuggestions: vi.fn()
}));
const coach = await import('@client/src/api/coach.js');

const FILE = 'src/App.jsx';
const REQUEST = { goal: 'mieux dormir', category: 'bien-etre' };
const WAITING = /Le coach réfléchit(…|\.\.\.)/;
let answer = null;

beforeEach(() => {
  answer = null;
  coach.fetchSuggestions.mockReset();
  coach.fetchSuggestions.mockImplementation(
    () =>
      new Promise((resolve) => {
        answer = resolve;
      })
  );
});

async function showApp() {
  const App = await load(() => import('@client/src/App.jsx'), FILE);
  show(<App />, FILE);
}

const generateButton = () => screen.queryByRole('button', { name: 'Générer' });

// Remplit le formulaire et clique Générer ; la demande reste en attente tant que le test ne la tient pas.
function ask() {
  const field = screen.queryByRole('textbox', { name: /^\s*Objectif/ });
  const button = generateButton();
  if (!field || !button)
    throw new Error("App n'affiche plus le formulaire complet : voir le lab formulaire.");
  fire.type(field, REQUEST.goal);
  fire.click(button);
  if (!answer)
    throw new Error("Générer n'appelle pas fetchSuggestions : voir le lab appel-asynchrone.");
}

async function respond() {
  await act(async () => answer(coach.generateSuggestions(REQUEST)));
  alive();
}

const waitingMessage = () =>
  screen.queryAllByRole('status').find((el) => WAITING.test(el.textContent));

test('message-attente', async () => {
  await showApp();
  ask();
  if (!waitingMessage() && screen.queryByText(WAITING)) {
    throw new Error(
      '« Le coach réfléchit… » est affiché, mais pas annoncé : mets-le dans un <p role="status">.'
    );
  }
  expect(
    waitingMessage(),
    'Pendant l\'attente, la page n\'affiche pas « Le coach réfléchit… » : un état loading mis à true avant await, et {loading && <p role="status">Le coach réfléchit…</p>} ?'
  ).toBeTruthy();
});

test('bouton-attente', async () => {
  await showApp();
  ask();
  expect(
    generateButton()?.disabled,
    "Pendant l'attente, Générer reste cliquable : passe loading à CoachForm, et disabled={!valid || loading} sur le bouton."
  ).toBe(true);
});

test('fin-attente', async () => {
  await showApp();
  ask();
  await respond();
  expect(
    screen.queryByText(WAITING),
    'La réponse est arrivée, mais « Le coach réfléchit… » reste affiché : remets loading à false après await.'
  ).toBeNull();
  expect(
    generateButton()?.disabled,
    'La réponse est arrivée, mais Générer reste désactivé : remets loading à false après await.'
  ).toBe(false);
});

test('une-seule-demande', async () => {
  await showApp();
  ask();
  if (generateButton()?.disabled === false) {
    throw new Error(
      "Générer reste cliquable pendant l'attente : regarde d'abord le check bouton-attente."
    );
  }
  fire.click(generateButton());
  fire.click(generateButton());
  const calls = coach.fetchSuggestions.mock.calls.length;
  expect(
    calls,
    `Trois clics pendant l'attente font partir ${calls} demandes : le bouton doit être désactivé tant que loading est vrai.`
  ).toBe(1);
});
