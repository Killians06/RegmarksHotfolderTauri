# TaurineCN

![Shadcn](https://img.shields.io/badge/-Shadcn-007ACC?logo=visual-studio-code&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![Rust](https://img.shields.io/badge/-Rust-000000?logo=rust&logoColor=white)
![Tauri](https://img.shields.io/badge/-Tauri-FFC131?logo=tauri&logoColor=white)
![Zustand](https://img.shields.io/badge/-Zustand-000000?logo=zustand&logoColor=white)

Ce projet est un template [Next.js](https://nextjs.org/) intégré avec [Tauri](https://tauri.app/), [TailwindCSS](https://tailwindcss.com/), [Shadcn](https://ui.shadcn.com), et [Zustand](https://github.com/pmndrs/zustand). Il a été initialisé avec `create-next-app` en suivant la [Documentation de Tauri](https://tauri.app/fr/v1/guides/getting-started/setup/next-js).

![Présentation Gif](./Documentation/Assets/Animationsmall.gif)

## Prise en main

### Prérequis

Assurez-vous d'avoir installé les dépendances suivantes sur votre machine :

- Node.js
- Pnpm (Si vous utilisez un autre comme Yarn, des changements devront être fait dans le [Makefile](./Makefile))
- Rust et Cargo (pour Tauri)
- Make pour les commandes du [Makefile](./Makefile)

### Installation

Clonez le dépôt et installez les dépendances :

```bash

git clone https://github.com/Onivoid/TaurineCN.git

cd TaurineCN

npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install

```

> ⚠️ **Avant de continuer** ⚠️ : Si vous n'utilisez pas pnpm, vous allez devoir changer les commandes dans le [Makefile](./Makefile) avant de continuer

### Démarrer le serveur de développement

Pour démarrer le serveur de développement Tauri, utilisez la commande suivante définie dans le Makefile :

```bash
make dev
```

### Autres commandes Makefile

- Pour formater le code :

  ```bash
  make format
  ```

- Pour lancer l'analyse statique du code :

  ```bash
  make lint
  ```

- Pour formater et analyser le code :

  ```bash
  make check
  ```

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.