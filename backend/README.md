## Dépendences

`pnpm install`

## Génération du swagger

`pnpm generate`

## Compilation TypeScript

`pnpm build`

## Lancement dev

Permet d'être lancé sans compilation et de relancer dynamiquement l'application à chaque update
`pnpm dev`

## Architecture

- Config : Contient l'initialisation de la connexion à la base de données
- Controllers : Contient les classes contenant la gestion des routes de l'API
- DTO : Contient les interfaces de communication de l'API
- Model: Contient les entités représentant les différentes tables SQL
- Routes : Fichier généré par tsoa pour la déclaration des routes
- Services : Contient le code métier
- app.ts : Fichier principal de l'application
- library.sqlite : Fichier de base de données
- package.json : Contient les dépendances nécessaires pour l'application
- tsconfig.json : Configuration de la compilation typescript
- tsoa.json: Configuration de la génération du Swagger

## Pour lancer 

- npx ts-node sync.ts
- npx tsoa routes
- npm run dev