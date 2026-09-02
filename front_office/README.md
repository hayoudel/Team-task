# Team Task — Prototype front-office

Prototype statique haute fidélité (React + TypeScript + Vite + Tailwind CSS v4)
de l'application de gestion de projets **Team Task**, avec deux vues démo :
**Chef de projet** (Bruno Martin) et **Utilisateur** (David Rousseau).

Aucune logique métier : pas de backend, pas de fetch, pas de state management,
pas de useEffect. Tout le contenu est du JSX statique. Le seul état local sert
à la navigation (onglets, sélecteur de rôle démo).

## Installation

```bash
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Structure

```
src/
  components/
    ui/            → composants du design system (Button, Avatar, Card, Table, Tabs, Timeline, ...)
    Sidebar.tsx     → navigation latérale, dépend du rôle actif
    RoleSwitcher.tsx→ sélecteur "Vue Chef de projet / Vue Utilisateur" (démo uniquement)
    Layout.tsx      → sidebar + switcher + zone de contenu (react-router <Outlet />)
  pages/
    Dashboard.tsx
    Projects.tsx
    ProjectDetail.tsx
    Tasks.tsx
    TaskDetail.tsx
    Profile.tsx
  App.tsx           → déclaration des routes + useState<"chef" | "user"> pour le rôle actif
```

## Notes

- La palette suit strictement le brief : accent `#F97316`, fond `#f8fafc`,
  sidebar blanche avec bordure `border-orange-100`.
- Les barres de recherche, filtres et champs de formulaire sont visuellement
  présents mais désactivés (`disabled`) : ce sont des maquettes, pas des
  contrôles fonctionnels.
- Les chiffres et listes affichés sont codés en dur dans chaque page.
