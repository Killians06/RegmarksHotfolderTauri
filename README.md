# Tauri-Next-Designed-Template

![Shadcn](https://img.shields.io/badge/Shadcn-UI-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4.1-blue)
![Rust](https://img.shields.io/badge/Rust-v1.60.0-orange)
![TauriApp](https://img.shields.io/badge/TauriApp-v1.7.0-blue)
![Zustand](https://img.shields.io/badge/Zustand-v4.5.4-blue)

Ce projet est un template [Next.js](https://nextjs.org/) intégré avec [Tauri](https://tauri.app/), [TailwindCSS](https://tailwindcss.com/), et [Zustand](https://github.com/pmndrs/zustand). Il a été initialisé avec [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

git clone https://github.com/Onivoid/Tauri-Next-Designed-Template.git

cd Tauri-Next-Designed-Template

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