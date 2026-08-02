import rawg from './rawg';

const PAGE_SIZE = 20;

export async function getGames({ page = 1, search, genres, platforms, ordering } = {}) {
  const { data } = await rawg.get('/games', {
    params: {
      page,
      page_size: PAGE_SIZE,
      search: search || undefined,
      genres: genres || undefined,
      platforms: platforms || undefined,
      ordering: ordering || undefined,
    },
  });

  return {
    results: data.results,
    count: data.count,
    hasNext: Boolean(data.next),
    totalPages: Math.ceil(data.count / PAGE_SIZE),
  };
}

// Every fetcher takes a single params object so it can be handed straight to
// useFetch, which calls fetcher(params).
export async function getGame({ id }) {
  const { data } = await rawg.get(`/games/${id}`);
  return data;
}

export async function getGameScreenshots({ id }) {
  const { data } = await rawg.get(`/games/${id}/screenshots`);
  return data.results;
}

export async function getGenres() {
  const { data } = await rawg.get('/genres');
  return data.results;
}

export async function getPlatforms() {
  const { data } = await rawg.get('/platforms/lists/parents');
  return data.results;
}
