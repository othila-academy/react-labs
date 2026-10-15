// La préparation des tests de composants du cours, chargée par lab check avant chaque fichier de test.
// La garde de boucle reste posée pendant tout le test : une boucle lancée par un clic s'arrête aussi.
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { guardLoop } from './components.jsx';

const original = console.error;

beforeEach(() => {
  console.error = (...args) => {
    guardLoop(args);
    original(...args);
  };
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  console.error = original;
});
