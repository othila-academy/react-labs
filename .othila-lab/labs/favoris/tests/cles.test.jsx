import { expect, test, vi } from 'vitest';
import { load, reactWarnings, show } from '../../../shared/components.jsx';
import { generateSuggestions } from '@client/src/api/coach.js';

// React n'avertit qu'une fois d'une key manquante : ce check vit seul dans son fichier, où la liste des favoris
// est rendue pour la première fois.
const FILE = 'src/components/SavedList.jsx';

test('cles-favoris', async () => {
  const SavedList = await load(() => import('@client/src/components/SavedList.jsx'), FILE);
  const warnings = reactWarnings();
  try {
    show(
      <SavedList
        saved={generateSuggestions({ goal: 'mieux dormir', category: 'bien-etre' })}
        onRemove={vi.fn()}
      />,
      FILE
    );
    expect(
      warnings.missingKey(),
      'React signale une key manquante dans les favoris : donne key={suggestion.id} à chaque <li> du map.'
    ).toBe(false);
  } finally {
    warnings.restore();
  }
});
