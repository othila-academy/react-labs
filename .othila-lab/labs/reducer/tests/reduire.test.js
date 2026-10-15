import { expect, test } from 'vitest';
import { generateSuggestions } from '@client/src/api/coach.js';

const FILE = 'src/context/favoritesReducer.js';
const [walk, focus] = generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' });
const ids = (list) => (Array.isArray(list) ? list.map((s) => s?.id) : list);
const shown = (value) => JSON.stringify(ids(value)) ?? String(value);

async function reducer() {
  const mod = await import('@client/src/context/favoritesReducer.js');
  if (typeof mod.default !== 'function') {
    throw new Error(
      `${FILE} n'a pas encore d'export par défaut : regarde d'abord le check reducer-existe.`
    );
  }
  return mod.default;
}

// Appelle le reducer sur un état gelé : un push ou un splice lève une TypeError, dite comme une modification.
function reduce(favoritesReducer, state, action, what) {
  try {
    return favoritesReducer(Object.freeze([...state]), action);
  } catch (error) {
    if (
      error instanceof TypeError &&
      /not extensible|read only|read-only|frozen|Cannot (add|assign|delete)/i.test(error.message)
    ) {
      throw new Error(what);
    }
    throw error;
  }
}

test('reducer-existe', async () => {
  const mod = await import('@client/src/context/favoritesReducer.js');
  expect(
    typeof mod.default,
    `${FILE} n'a pas d'export par défaut : export default function favoritesReducer(state, action) { … }`
  ).toBe('function');
});

test('save', async () => {
  const favoritesReducer = await reducer();
  const changed =
    'save a modifié le tableau reçu : rends-en un nouveau ([...state, action.suggestion]), sans push.';
  const next = reduce(favoritesReducer, [walk], { type: 'save', suggestion: focus }, changed);
  expect(ids(next), `save rend ${shown(next)} : return [...state, action.suggestion].`).toEqual([
    walk.id,
    focus.id
  ]);
  const again = reduce(
    favoritesReducer,
    [walk, focus],
    { type: 'save', suggestion: walk },
    changed
  );
  expect(
    ids(again),
    "Sauvegardé deux fois, le conseil est en double : vérifie d'abord state.some((s) => s.id === action.suggestion.id)."
  ).toEqual([walk.id, focus.id]);
});

test('remove', async () => {
  const favoritesReducer = await reducer();
  const next = reduce(
    favoritesReducer,
    [walk, focus],
    { type: 'remove', id: walk.id },
    'remove a modifié le tableau reçu (splice) : filter rend un nouveau tableau.'
  );
  expect(
    ids(next),
    `remove rend ${shown(next)} : state.filter((s) => s.id !== action.id).`
  ).toEqual([focus.id]);
});

test('clear', async () => {
  const favoritesReducer = await reducer();
  const next = reduce(
    favoritesReducer,
    [walk, focus],
    { type: 'clear' },
    'clear a modifié le tableau reçu : rends un nouveau tableau vide.'
  );
  expect(ids(next), `clear rend ${shown(next)} au lieu de [] : case 'clear': return [].`).toEqual(
    []
  );
});

test('inconnue', async () => {
  const favoritesReducer = await reducer();
  let thrown = null;
  let result;
  try {
    result = favoritesReducer(Object.freeze([walk]), { type: 'inconnue' });
  } catch (error) {
    thrown = error;
  }
  expect(
    thrown,
    `L'action { type: 'inconnue' } ne lève pas d'erreur (le reducer rend ${shown(result)}) : default: throw new Error(\`Action inconnue : \${action.type}\`).`
  ).toBeInstanceOf(Error);
});
