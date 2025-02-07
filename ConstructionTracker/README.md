# ARCHI BATI - Plateforme de Gestion de Chantier

Une plateforme avancée pour la gestion et le suivi des projets de construction.

## Fonctionnalités

- Suivi en temps réel des étapes du chantier
- Interface d'administration sécurisée
- Gestion des projets et des clients
- Interface responsive (mobile et desktop)

## Prérequis

- Node.js 20.x ou supérieur
- PostgreSQL 15.x ou supérieur
- npm ou yarn

## Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_REPO]
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
Créer un fichier `.env` à la racine du projet avec :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
PORT=5000
```

4. Initialiser la base de données
```bash
npm run db:push
```

5. Lancer l'application
```bash
npm run dev
```

## Déploiement sur Railway

1. Créer un nouveau projet sur Railway
2. Connecter le repository GitHub
3. Ajouter une base de données PostgreSQL
4. Configurer les variables d'environnement :
   - DATABASE_URL (fourni automatiquement par Railway)
   - PORT (fourni automatiquement par Railway)
5. Déployer !

## Structure du Projet

```
├── client/           # Frontend React
├── server/           # Backend Express
├── shared/           # Types et schémas partagés
└── ...
```

## License

© 2024 ARCHI BATI. Tous droits réservés.
