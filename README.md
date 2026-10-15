# Formation React · Othila Academy

AI Coach, une petite application de conseils, construite **lab après lab** : chaque lab fait apprendre une notion de React en l'ajoutant à ton application, sur ton propre code.

## Pour l'apprenant

Tout le parcours est dans [`docs/LABS.md`](docs/LABS.md) : cloner, `npm install`, `npx lab join`, `npx lab init`, le tutoriel de la commande (`npx lab start prise-en-main`), puis un lab après l'autre avec `npx lab start`, `check`, `hint` et `submit`. `npm run dev` lance l'application dans le navigateur.

## Organisation du dépôt

- `src/` : l'application (Vite, React, JavaScript) ; `src/api/coach.js` simule le coach, sans réseau.
- `.othila-lab/` : la formation (`formation.json`), les labs (`labs/<lab>/`) et les aides de leurs tests (`shared/`) ; `local/`, ton état, n'est jamais commité.

## La chaîne de labs

`main` est une chaîne d'états de référence : `base`, le starter, puis `solution/<lab>` pour chaque lab, dans l'ordre de `formation.json`. Le départ d'un lab est la solution du lab précédent. Pour écrire un lab : le [guide d'écriture des labs](https://github.com/othila-academy/lab-cli/blob/main/docs/ecrire-un-lab.md).
