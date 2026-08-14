# Plan — RecipeHub full-stack app

## Goal
Build a simple RecipeHub app (React + Express + PostgreSQL + JWT) with auth, browse/search recipes, favorites, and a basic admin area.

## Done when
- [ ] Users can register, log in, and access protected features with JWT
- [ ] Home shows featured recipes, categories, and recently added recipes
- [ ] Users can list, search, filter, and open recipe details
- [ ] Recipe details show title, image, description, category, prep time, ingredients, steps
- [ ] Logged-in users can add/remove/view Favorites
- [ ] Admin can CRUD recipes and manage categories
- [ ] Secrets live in `.env` (not committed); app runs with clear start steps

## Steps
1. **Scaffold** — Create `server/` (Express) and `client/` (React + React Router). Keep existing `docs/` learning files. Update `.cursor/rules/01-stack.mdc` for the new stack.
2. **Database** — Create PostgreSQL tables: Users, Categories, Recipes, Favorites. Add a small seed (one admin user, a few categories/recipes) so Home works.
3. **Auth API** — Register, login, JWT middleware, protect routes that need a user or admin.
4. **Public recipe API** — List recipes (search by name, filter by category), get one recipe, home data (featured, categories, recent).
5. **Favorites API** — Add, remove, list favorites (JWT required).
6. **Admin API** — CRUD recipes + manage categories (admin only).
7. **Frontend shell** — Layout, routes, auth context, reusable components, basic form validation, simple responsive CSS.
8. **Frontend pages** — Home, Recipes (search/filter), Recipe details, Login/Register, Favorites, Admin (recipes + categories).
9. **Wire + verify** — Connect client to API, document how to run (Postgres, `.env`, `npm` in server and client), smoke-test the flows above.

## Files likely touched
- `server/` (Express app, routes, middleware, DB, `.env.example`)
- `client/` (React pages, components, API helpers, styles)
- `.cursor/rules/01-stack.mdc`
- `plan.md` (this file)
- Root README with run steps (only if needed to start the app)

## Risks / questions
- **PostgreSQL must be running** on your machine (or via Docker). Connection string goes in `server/.env`.
- Figma / ClickUp MCP are not required for this build; no design file was given — UI will be clean and simple only.
- Admin = a user with `is_admin = true` in the Users table (needed for the Admin feature you asked for).
- Recipe **image** = image URL string (no file upload).
- Ingredients and instructions stored as lists on the recipe (simple JSON/text arrays).

## Out of scope
- File uploads, social login, comments, ratings, payments, email, advanced caching, TypeScript (unless already needed by tooling)
- Extra tables or features beyond Users, Recipes, Categories, Favorites
- Rewriting or removing the existing Cursor learning docs

## Build order note
We implement **one step at a time**. After you say **OK implement**, start with Step 1 (scaffold), then continue through the list unless you pause.
