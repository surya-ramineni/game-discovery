import cheapshark from './cheapshark';

const PAGE_SIZE = 20;

export async function getGames({ page = 1, search } = {}) {
  const { data, headers } = await cheapshark.get('/deals', {
    params: {
      pageNumber: page - 1, // CheapShark is 0-indexed; our UI is 1-indexed
      pageSize: PAGE_SIZE,
      sortBy: search ? 'Title' : 'Deal Rating',
      ...(search ? { title: search } : {}),
    },
  });

  // CheapShark exposes this header via Access-Control-Expose-Headers. If it
  // ever goes missing, fall back to "a full page means there may be more".
  const totalPages = Number(headers['x-total-page-count']) || null;

  return {
    results: data,
    totalPages,
    hasNext: totalPages ? page < totalPages : data.length === PAGE_SIZE,
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
