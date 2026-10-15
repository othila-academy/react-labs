// La préparation des tests de composants du cours, chargée par lab check avant chaque fichier de test.
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
});
