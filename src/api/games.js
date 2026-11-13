import cheapshark from './cheapshark';

const BROWSE_PAGE_SIZE = 20;
// Searches sort by title, which puts one game's deals side by side, so a
// 20-deal page collapses to only ~5–8 games. Ask for CheapShark's max instead.
const SEARCH_PAGE_SIZE = 60;

// CheapShark returns one deal per store, so the same game can show up several
// times on a page. Keep a single entry per game — its cheapest deal here —
// in the order the games first appear, so the API's sort is preserved.
function onePerGame(deals) {
  const best = new Map();
  for (const deal of deals) {
    const current = best.get(deal.gameID);
    if (!current || Number(deal.salePrice) < Number(current.salePrice)) {
      best.set(deal.gameID, deal);
    }
  }
  return [...best.values()];
}

export async function getGames({ page = 1, search } = {}) {
  const pageSize = search ? SEARCH_PAGE_SIZE : BROWSE_PAGE_SIZE;

  const { data, headers } = await cheapshark.get('/deals', {
    params: {
      pageNumber: page - 1, // CheapShark is 0-indexed; our UI is 1-indexed
      pageSize,
      sortBy: search ? 'Title' : 'Deal Rating',
      ...(search ? { title: search } : {}),
    },
  });

  // X-Total-Page-Count is the index of the *last* page, not a count: "2" means
  // pages 0, 1 and 2 exist. CheapShark exposes it via
  // Access-Control-Expose-Headers; if it ever goes missing, fall back to "a
  // full page means there may be more". Pages count deals, not games, so the
  // fallback checks the raw deal count.
  const lastPageIndex = Number.parseInt(headers['x-total-page-count'], 10);
  const totalPages = Number.isNaN(lastPageIndex) ? null : lastPageIndex + 1;

  return {
    results: onePerGame(data),
    totalPages,
    hasNext: totalPages ? page < totalPages : data.length === pageSize,
  };
}

// Every fetcher takes a single params object so it can be handed straight to
// useFetch, which calls fetcher(params).
export async function getGame({ id }) {
  const { data } = await cheapshark.get('/games', { params: { id } });
  return data;
}

// The store list is effectively static, so fetch it once per visit and share
// the promise. A failed request is forgotten so the next caller retries.
let storesRequest = null;

export function getStores() {
  storesRequest ??= cheapshark
    .get('/stores')
    .then(({ data }) => data)
    .catch((err) => {
      storesRequest = null;
      throw err;
    });
  return storesRequest;
}
