# Game Discovery

Browse, search and save games, powered by the [RAWG](https://rawg.io/apidocs) API.
React 19 + Vite + React Router.

## Setup

```bash
npm install
cp .env.example .env   # then paste your RAWG key
npm run dev
```

`VITE_RAWG_KEY` is required. `VITE_RAWG_URL` is optional and defaults to
`https://api.rawg.io/api`.

## Structure

```
src/
  api/        rawg.js (axios instance + key interceptor), games.js (endpoints)
  hooks/      useFetch, useDebounce, useFavorites
  context/    FavoritesProvider + context object
  components/ GameCard, GameGrid, SearchBar, Pagination, Spinner, ErrorMessage
  pages/      Home, GameDetail, Favorites, NotFound
```

Routes: `/`, `/game/:id`, `/favorites`.

## Deploying to Vercel

`vercel.json` rewrites all paths to `index.html` so deep links like
`/game/3498` don't 404 on refresh.

Add `VITE_RAWG_KEY` under **Settings → Environment Variables** in Vercel.
Vite inlines `VITE_*` variables at build time, so the value is baked into the
bundle — this is a public, rate-limited key, not a secret. Redeploy after
changing it; changing the variable alone won't update an existing build.
