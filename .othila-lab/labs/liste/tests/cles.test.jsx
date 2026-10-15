import { expect, test } from 'vitest';
import { reactWarnings } from '../../../shared/components.jsx';
import { ready, showList, three } from './helpers.jsx';

// React n'avertit qu'une fois d'une key manquante : ce check vit seul dans son fichier, où la liste est rendue
// pour la première fois.
test('cles', async () => {
  const SuggestionsList = await ready();
  const warnings = reactWarnings();
  try {
    showList(SuggestionsList, three);
    expect(
      warnings.missingKey(),
      'React signale une key manquante : donne key={suggestion.id} à chaque SuggestionCard du map.'
    ).toBe(false);
  } finally {
    warnings.restore();
  }
});
