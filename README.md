# HRNet Frontend

Application web moderne de gestion des employés développée avec React et TypeScript. HRNet permet d'ajouter, consulter, filtrer et trier les informations des employés d'une entreprise.

## 📋 Table des matières

- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Scripts disponibles](#scripts-disponibles)
- [Tests](#tests)

## 🛠 Technologies

### Core
- **React 19.1.1** - Bibliothèque UI
- **TypeScript 5.9.3** - Typage statique
- **Vite 7.1.7** - Build tool et serveur de développement

### Gestion d'état
- **Redux Toolkit 2.9.2** - Gestion d'état centralisée
- **Redux Persist 6.0.0** - Persistance des données dans le localStorage
- **React Redux 9.2.0** - Intégration Redux avec React

### Interface utilisateur
- **Tailwind CSS 4.1.16** - Framework CSS utilitaire
- **Radix UI** - Composants UI accessibles et sans style
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-select`
  - `@radix-ui/react-slot`
- **Lucide React 0.552.0** - Bibliothèque d'icônes
- **TanStack Table 8.21.3** - Table de données performante avec tri et filtrage

### Routing
- **React Router 7.9.5** - Navigation et routing

### Validation
- **Zod** - Validation de schémas TypeScript-first

### Utilitaires
- **date-fns 4.1.0** - Manipulation et formatage de dates
- **class-variance-authority** - Gestion des variants de classes CSS
- **clsx & tailwind-merge** - Gestion conditionnelle des classes CSS

### Tests
- **Jest 29.7.0** - Framework de tests unitaires
- **Testing Library** - Utilitaires de tests React
- **Playwright 1.48.0** - Tests end-to-end

## 🏗 Architecture

### Architecture générale

L'application suit une architecture modulaire organisée par fonctionnalités :

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base (shadcn/ui)
│   └── addEmployeeModal.tsx
├── features/           # Features organisées par domaine
│   └── table/          # Feature de table de données
├── pages/              # Pages de l'application
├── slices/             # Redux slices (reducers)
├── store/              # Configuration Redux store
├── lib/                # Utilitaires et types partagés
└── utils/              # Fonctions utilitaires et constantes
```

### Flux de données

```
┌─────────────────┐
│   Components    │
│   (React)       │
└────────┬────────┘
         │ dispatch
         ▼
┌─────────────────┐
│  Redux Store    │
│  (Persist)      │
└────────┬────────┘
         │ subscribe
         ▼
┌─────────────────┐
│  LocalStorage   │
│  (Persistance)  │
└─────────────────┘
```

### Gestion d'état

L'application utilise **Redux Toolkit** avec **Redux Persist** pour :
- Centraliser la gestion des employés
- Persister les données dans le localStorage
- Permettre le partage d'état entre composants
- Faciliter le débogage avec Redux DevTools

Le store contient un slice `employees` qui gère :
- L'ajout d'employés (`addEmployee`)
- Le filtrage (`filterEmployees`)
- Le tri (`sortEmployees`)

### Routing

L'application utilise **React Router v7** avec deux routes principales :
- `/add` - Formulaire d'ajout d'employé (route par défaut)
- `/list` - Liste et gestion des employés

## 🚀 Installation

### Prérequis

- **Node.js** 18+ 
- **pnpm** (recommandé) ou npm/yarn

### Étapes d'installation

1. **Cloner le repository** (si applicable)
```bash
git clone <repository-url>
cd HRNet-Frontend
```

2. **Installer les dépendances**
```bash
pnpm install
# ou
npm install
```

3. **Lancer l'application en mode développement**
```bash
pnpm dev
# ou
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (port par défaut de Vite).

## 📁 Structure du projet

```
HRNet-Frontend/
├── public/                 # Assets statiques
├── src/
│   ├── __tests__/          # Tests unitaires
│   │   ├── AddEmployees.test.tsx
│   │   └── EmployeeSlice.test.ts
│   ├── assets/             # Images et ressources
│   ├── components/         # Composants réutilisables
│   │   ├── ui/             # Composants UI de base
│   │   │   ├── button.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── table.tsx
│   │   └── addEmployeeModal.tsx
│   ├── features/           # Features par domaine métier
│   │   └── table/          # Feature de table
│   │       ├── columns.tsx          # Définition des colonnes
│   │       ├── data-table.tsx       # Composant table principal
│   │       ├── data-table-column-header.tsx  # En-tête avec tri
│   │       └── data-table-pagination.tsx     # Pagination
│   ├── lib/                # Utilitaires et types
│   │   ├── types.ts        # Types TypeScript
│   │   └── utils.ts        # Fonctions utilitaires
│   ├── pages/              # Pages de l'application
│   │   ├── AddEmployees.tsx  # Formulaire d'ajout
│   │   └── ListEmployees.tsx # Liste des employés
│   ├── slices/             # Redux slices
│   │   └── EmployeeSlice.ts # Slice de gestion des employés
│   ├── store/              # Configuration Redux
│   │   └── store.ts        # Store et configuration
│   ├── utils/              # Constantes et utilitaires
│   │   └── variables.ts    # États, départements, filtres
│   ├── App.tsx             # Composant racine avec routing
│   ├── main.tsx            # Point d'entrée de l'application
│   └── index.css           # Styles globaux
├── tests/                   # Tests end-to-end (Playwright)
│   └── add-employee.spec.ts
├── .gitignore
├── components.json         # Configuration shadcn/ui
├── eslint.config.js        # Configuration ESLint
├── jest.config.js          # Configuration Jest
├── playwright.config.ts    # Configuration Playwright
├── package.json
├── tsconfig.json           # Configuration TypeScript
└── vite.config.ts          # Configuration Vite
```

## ✨ Fonctionnalités

### 1. Ajout d'employé (`/add`)

Formulaire complet avec validation pour ajouter un nouvel employé :

**Champs du formulaire :**
- Prénom (minimum 2 caractères)
- Nom (minimum 2 caractères)
- Date de naissance (l'employé doit avoir au moins 18 ans)
- Date de début (doit être après la date de naissance)
- Adresse complète (rue, ville, état, code postal)
- Département (Sales, Marketing, Engineering, Human Resources, Legal)

**Validations :**
- Validation côté client avec **Zod**
- Vérification de l'âge minimum (18 ans)
- Vérification que la date de début est postérieure à la date de naissance
- Prévention des doublons (vérification si l'employé existe déjà)
- Messages d'erreur clairs pour chaque champ

**Fonctionnalités :**
- Modal de confirmation après ajout réussi
- Navigation vers la liste des employés
- Persistance automatique dans le localStorage via Redux Persist

### 2. Liste des employés (`/list`)

Table interactive avec fonctionnalités avancées :

**Fonctionnalités de la table :**
- **Affichage** : Colonnes configurables (prénom, nom, date de début, département, date de naissance, adresse complète)
- **Tri** : Tri ascendant/descendant sur chaque colonne (clique sur l'en-tête)
- **Filtrage** : Filtre dynamique par colonne sélectionnable :
  - First Name
  - Last Name
  - Department
  - Start Date
  - Date of Birth
  - Street
  - City
  - State
  - Zip Code
- **Pagination** : Navigation entre les pages de résultats
- **Formatage** : Dates formatées en format français (dd/MM/yyyy)

**Technologies utilisées :**
- **TanStack Table** pour la gestion de la table
- **Radix UI** pour les composants de sélection
- **date-fns** pour le formatage des dates

### 3. Persistance des données

Tous les employés ajoutés sont automatiquement sauvegardés dans le **localStorage** du navigateur via Redux Persist. Les données persistent même après fermeture du navigateur.

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance le serveur de développement avec hot-reload |
| `pnpm build` | Compile l'application pour la production |
| `pnpm preview` | Prévisualise la build de production |
| `pnpm lint` | Vérifie le code avec ESLint |
| `pnpm test` | Lance les tests unitaires avec Jest |
| `pnpm test:watch` | Lance les tests en mode watch |
| `pnpm test:coverage` | Génère un rapport de couverture de tests |
| `pnpm test:e2e` | Lance les tests end-to-end avec Playwright |
| `pnpm test:e2e:ui` | Lance les tests e2e avec l'interface Playwright |
| `pnpm test:e2e:headed` | Lance les tests e2e en mode visible (non headless) |

## 🧪 Tests

### Tests unitaires

Les tests unitaires utilisent **Jest** et **React Testing Library** :

- Tests des composants (`AddEmployees.test.tsx`)
- Tests des reducers (`EmployeeSlice.test.ts`)

**Exécution :**
```bash
pnpm test
pnpm test:watch      # Mode watch
pnpm test:coverage   # Avec couverture de code
```

### Tests end-to-end

Les tests e2e utilisent **Playwright** pour tester le flux complet de l'application :

- Test du formulaire d'ajout d'employé (`add-employee.spec.ts`)

**Exécution :**
```bash
pnpm test:e2e              # Mode headless
pnpm test:e2e:ui           # Interface Playwright
pnpm test:e2e:headed       # Mode visible
```

### Configuration des tests

- **Jest** : Configuration dans `jest.config.js`
- **Playwright** : Configuration dans `playwright.config.ts`
- **Setup** : `setupTests.ts` configure l'environnement de test

## 🎨 Composants UI

L'application utilise des composants basés sur **shadcn/ui** (composants Radix UI stylisés avec Tailwind) :

- `Button` - Boutons stylisés
- `Input` - Champs de saisie
- `Select` - Sélecteurs dropdown
- `Table` - Composants de table
- `DropdownMenu` - Menus déroulants

Tous les composants sont accessibles (ARIA) et personnalisables via Tailwind CSS.

## 📝 Types TypeScript

Les principaux types définis dans `src/lib/types.ts` :

```typescript
interface Employee {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  startDate: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  department: string;
}
```

## 🔧 Configuration

### Vite

La configuration Vite (`vite.config.ts`) inclut :
- Plugin React SWC (compilation rapide)
- Plugin Tailwind CSS
- Alias `@` pour les imports depuis `src/`

### TypeScript

- Configuration principale : `tsconfig.json`
- Configuration app : `tsconfig.app.json`
- Configuration Node : `tsconfig.node.json`

### ESLint

Configuration moderne avec flat config dans `eslint.config.js`.

## 📦 Build de production

Pour créer une build de production :

```bash
pnpm build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

Pour prévisualiser la build :

```bash
pnpm preview
```

## 🤝 Contribution

Ce projet fait partie du parcours OpenClassrooms. Pour contribuer :

1. Créer une branche depuis `master`
2. Faire vos modifications
3. Ajouter des tests si nécessaire
4. S'assurer que tous les tests passent
5. Créer une pull request

## 📄 Licence

Ce projet est un projet éducatif dans le cadre d'OpenClassrooms.
