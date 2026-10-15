# Les labs du cours

Le cours React se joue en labs. Chaque lab te fait construire une partie de ton application, AI Coach, sur ton propre code : le lab suivant part de là où tu as fini le précédent. La commande `lab` vérifie ton travail en local, en rendant tes composants, et en informe le formateur.

## Au début du cours, une fois

```bash
git clone https://github.com/othila-academy/react-labs.git
cd react-labs
npm install
npx lab join      # le navigateur s'ouvre : code de session, e-mail, prénom ; sans navigateur : npx lab join --terminal
npx lab init      # crée ta branche my-project, depuis le départ du cours, avec les labs à jour
npx lab env       # vérifie Node, npm, git et l'accès au serveur othila-lab
npx lab start prise-en-main   # le tutoriel de la commande lab : 15 min, un petit fichier à réparer
```

`npm install` d'abord : sans lui, `npx lab` irait chercher un autre paquet du même nom sur npm.

## Pour chaque lab

```bash
npx lab catalog               # les labs du cours, dans l'ordre
npx lab start <lab>           # la fiche du lab : contexte, objectifs, consignes, ce qui sera vérifié
npm run dev                   # ton application dans le navigateur (http://localhost:5173), dans un autre terminal
npx lab check <lab> <étape>   # jusqu'au vert
npx lab hint <lab> <étape>    # si tu bloques : un indice, son coût en points est annoncé
npx lab submit <lab> <étape>  # ton explication en deux phrases : c'est elle qui termine l'étape
```

Les checks n'ont pas besoin de `npm run dev` : ils rendent tes composants eux-mêmes. Le navigateur, c'est pour toi, pour voir ce que tu construis.

À la fin d'un lab, commite ton travail : `git add -A && git commit -m "lab <lab>"`. `npx lab progress` montre où tu en es et tes points.

## Quand le formateur publie de nouveaux labs

```bash
npx lab update
```

Seuls `.othila-lab/` et, si besoin, la version de la commande `lab` (`package.json`, `package-lock.json`) changent, dans un commit à part : ton code, commité ou non, ne bouge pas. Si la commande te dit de lancer `npm install`, lance-le.

## Si tu as pris du retard

Absent à une séance, application bloquée : repars du départ de référence d'un lab, sur une nouvelle branche. Ta branche reste intacte.

```bash
git add -A && git commit -m "mon travail"
npx lab catchup <lab>
npm install
npx lab start <lab>
```

## En fin de session

`npx lab leave` envoie ce qui attend encore et efface le jeton de la machine.
