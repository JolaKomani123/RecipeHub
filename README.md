# RecipeHub

Simple recipe website: React frontend + Node/Express API + **SQLite** (no PostgreSQL install needed).

## Folders

- `client/` — React (Vite)
- `server/` — Express REST API
- `server/data/recipehub.db` — created by `npm run db:setup`
- `docs/` — Cursor learning notes

## 1. Backend

```bash
cd server
npm install
npm run db:setup
npm run dev
```

API: http://localhost:5000

Admin login after seed:

- Email: `admin@recipehub.com`
- Password: `admin123`

## 2. Frontend

```bash
cd client
npm install
npm run dev
```

App: http://localhost:5173

## Features

- Register / login (JWT)
- Home: featured, categories, recent
- Recipes: search + category filter + details
- Favorites (logged-in)
- Admin: manage recipes and categories
