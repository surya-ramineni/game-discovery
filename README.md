# Game Discovery

**[Live demo →](https://game-discovery-ten.vercel.app/)**

Browse, search and save PC game deals. Built with React 19, Vite and React Router,
against the [CheapShark](https://apidocs.cheapshark.com/) API.

![Home page](docs/screenshots/home.jpg)

## Features

- Browse the best-rated deals across PC game stores, one card per game showing its cheapest deal, with prev/next pagination
- Debounced search — one request per typing pause, not per keystroke
- Search term and page live in the URL, so results are shareable and survive a refresh
- Game pages comparing current prices across stores, plus the cheapest price ever
- Favorites saved to `localStorage` via Context, persisted across reloads
- Separate loading, error and empty states (an empty result set is a success, not a failure)
- Responsive grid, light and dark themes

### Search

![Search results](docs/screenshots/search.jpg)

### Detail page

![Game detail](docs/screenshots/detail.jpg)

## Tech

| | |
|---|---|
| Framework | React 19 |
| Build | Vite 8 |
| Routing | React Router 7 |
| HTTP | Axios instance with an 8-second timeout |
| State | `useState` / Context API |
| Styling | Plain CSS, custom properties for theming |
| Hosting | Vercel |

## Setup

```bash
npm install
npm run dev
```

No API key or `.env` needed — CheapShark is keyless.

## Structure

```
src/
  api/        cheapshark.js (axios instance), games.js (endpoints)
  hooks/      useFetch, useDebounce, useFavorites
  context/    FavoritesProvider + context object
  components/ GameCard, GameGrid, SearchBar, Pagination, Spinner, ErrorMessage
  pages/      Home, GameDetail, Favorites, NotFound
```

Routes: `/`, `/game/:id`, `/favorites`.

## Notes on a few decisions

**`useFetch` serialises its params.** Call sites pass an object literal
(`useFetch(getGames, { page, search })`), which is a new reference every render.
Using it directly as an effect dependency re-runs the effect forever.
`JSON.stringify` turns it into a primitive, so the effect only re-fires when the
values actually change and callers don't have to remember `useMemo`.

**`loading` is derived, not stored.** The hook records which request key last
settled and compares it during render. Calling `setLoading(true)` inside the
effect body triggers a cascading render, which React 19's
`react-hooks/set-state-in-effect` rule flags as an error.

**Stale responses are discarded.** Type quickly and the response for `"ha"` can
arrive after the one for `"hal"`. The effect cleanup flips a `cancelled` flag so
only the current request writes state.

**The data layer survived a provider switch.** The app was first built on RAWG.
In November 2026 RAWG's API stopped responding, so I moved it to CheapShark.
Because every request went through one axios instance and one fetching hook, the
change stayed inside `src/api` plus the components that render the new fields —
`useFetch`, routing and the page structure were untouched. I also added an
8-second timeout: with no timeout, a dead upstream left the UI on an endless
spinner instead of failing fast with a retry button.

**Context rather than Redux for favorites.** Low-frequency, low-complexity state
that only needs to escape prop-drilling through `Home → GameGrid → GameCard`.
Redux would be overhead without benefit here.

## Deploying to Vercel

`vercel.json` rewrites all paths to `index.html`, so deep links like
`/game/612` don't 404 on refresh. No environment variables are required.

## What I'd do differently

- **Grouping is per page.** CheapShark paginates deals, not games, so deals are
  grouped by `gameID` within each page. When browsing by deal rating, a game's
  other store offers can surface again on a later page. Fixing that properly
  needs a backend that aggregates deals before paginating.
- **No tests.** Vitest plus React Testing Library on `useDebounce`, `useFetch`
  and the favorites reducer would be the first thing to add.
- **No image placeholders.** Cover art pops in as it loads; a blurhash or
  skeleton would smooth that out.
- **Errors don't retry.** A single failed request shows an error with a manual
  retry button; automatic backoff would handle transient failures better.

---

Deal data and images provided by [CheapShark](https://www.cheapshark.com).
