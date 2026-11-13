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

  // CheapShark exposes this header via Access-Control-Expose-Headers. If it
  // ever goes missing, fall back to "a full page means there may be more".
  // Pages count deals, not games, so the fallback checks the raw deal count.
  const totalPages = Number(headers['x-total-page-count']) || null;

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

export async function getStores() {
  const { data } = await cheapshark.get('/stores');
  return data;
}
