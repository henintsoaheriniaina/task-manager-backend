# 🚀 Task Manager - Plateforme de Gestion de Tâches Collaboratives ( Baceknd )

Application Fullstack MERN avec authentification JWT, gestion de rôles, et interface moderne.

## 📋 Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies Utilisées](#technologies-utilisées)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Structure du Projet](#structure-du-projet)

## ✨ Fonctionnalités

- ✅ Authentification sécurisée (JWT + HTTP-Only Cookies)
- ✅ CRUD complet des utilisateurs
- ✅ CRUD complet des tâches
- ✅ Attribution de tâches aux utilisateurs
- ✅ Gestion des statuts (Todo / In Progress / Completed)
- ✅ Validation Zod sur toutes les routes
- ✅ Gestion globale des erreurs avec Express Async Handler
- ✅ Protection des routes avec middleware
- ✅ Système de rôles (Admin / User)

## 🛠 Technologies Utilisées

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de données**: MongoDB avec Mongoose
- **Langage**: TypeScript
- **Validation**: Zod
- **Authentification**: JWT + bcryptjs
- **Gestion d'erreurs**: Express Async Handler

## 🏗 Architecture

```
backend/          # API REST Node.js
├── src/
│   ├── config/   # Configuration DB & env
│   ├── controllers/  # Logique métier
│   ├── middleware/   # Auth, validation, errors
│   ├── models/   # Modèles Mongoose
│   ├── routes/   # Routes Express
│   ├── schemas/  # Validation Zod
│   ├── types/    # Types TypeScript
│   └── utils/    # Utilitaires
└── ...
```

## 📦 Installation

### Prérequis

- Node.js (v18+)
- MongoDB (local ou Atlas)
- bun

### 1. Cloner le repository

```bash
git clone https://github.com/henintsoaheriniaina/task-manager-backend.git
cd task-manager-backend
```

### 2. Installation

```bash
bun install
```

Créer un fichier `.env` :

```bash
cp .env.example .env
```

Configurer les variables d'environnement dans `.env` :

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/task-manager-backend
JWT_SECRET=votre_secret_jwt_tres_securise_minimum_32_caracteres
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:5173
```

## 🚀 Utilisation

```bash
cd backend
bun dev
```

Le serveur démarre sur `http://localhost:8000`

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api
```

### Endpoints

#### Authentication

| Méthode | Endpoint         | Description                      | Auth |
| ------- | ---------------- | -------------------------------- | ---- |
| POST    | `/auth/register` | Créer un compte                  | Non  |
| POST    | `/auth/login`    | Se connecter                     | Non  |
| POST    | `/auth/logout`   | Se déconnecter                   | Non  |
| GET     | `/auth/me`       | Récupérer l'utilisateur connecté | Oui  |

#### Users

| Méthode | Endpoint                    | Description            | Auth  |
| ------- | --------------------------- | ---------------------- | ----- |
| GET     | `/users`                    | Liste des utilisateurs | Admin |
| GET     | `/users/:id`                | Détails utilisateur    | Oui   |
| PUT     | `/users/:id`                | Modifier utilisateur   | Admin |
| DELETE  | `/users/:id`                | Supprimer utilisateur  | Admin |
| PUT     | `/users/me/change-password` | Changer mot de passe   | Oui   |

#### Tasks

| Méthode | Endpoint             | Description         | Auth |
| ------- | -------------------- | ------------------- | ---- |
| GET     | `/tasks`             | Liste des tâches    | Oui  |
| GET     | `/tasks?status=todo` | Filtrer par statut  | Oui  |
| GET     | `/tasks/:id`         | Détails d'une tâche | Oui  |
| POST    | `/tasks`             | Créer une tâche     | Oui  |
| PUT     | `/tasks/:id`         | Modifier une tâche  | Oui  |
| DELETE  | `/tasks/:id`         | Supprimer une tâche | Oui  |

### Exemples de Requêtes

#### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Create Task

```bash
POST /api/tasks
Content-Type: application/json
Cookie: token=<jwt_token>

{
  "title": "Nouvelle tâche",
  "description": "Description de la tâche",
  "status": "todo",
  "assignedTo": "user_id",
  "dueDate": "2026-01-30T00:00:00.000Z"
}
```

## 🔐 Système de Rôles

### Admin

- Gérer tous les utilisateurs (CRUD)
- Voir toutes les tâches
- Créer, modifier, supprimer n'importe quelle tâche
- Assigner des tâches à n'importe quel utilisateur

### User

- Voir uniquement ses tâches (créées ou assignées)
- Créer de nouvelles tâches
- Modifier/supprimer uniquement ses propres tâches
- Changer son mot de passe

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ JWT stockés dans des cookies HTTP-Only
- ✅ Validation stricte avec Zod côté backend et frontend
- ✅ Protection CORS configurée
- ✅ Middleware d'authentification sur toutes les routes protégées
- ✅ Vérification des rôles pour les actions sensibles

## 📝 Variables d'Environnement

### Backend (.env)

```env
NODE_ENV=development|production
PORT=8000
MONGODB_URI=mongodb://...
JWT_SECRET=<secret_32_chars_minimum>
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
FRONTEND_URL=http://localhost:5173
```

## 📧 Contact

Pour toute question : rasolomampiononahenintsoaherin@gmail.com

---

Powered by Henintsoa Heriniaina (Power) ⚡
