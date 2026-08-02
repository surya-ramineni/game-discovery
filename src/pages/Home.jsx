import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getGames } from '../api/games'
import useFetch from '../hooks/useFetch'
import useDebounce from '../hooks/useDebounce'
import SearchBar from '../components/SearchBar'
import GameGrid from '../components/GameGrid'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Home() {
  // The URL is the single source of truth for what's fetched, so a search is
  // shareable and survives a refresh.
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)

  // The input stays local and instant; only the settled value reaches the URL.
  const [term, setTerm] = useState(search)
  const debouncedTerm = useDebounce(term, 500)

  useEffect(() => {
    if (debouncedTerm === search) return
    // Omitting `page` resets to 1 — page 7 of the old query means nothing here.
    setSearchParams(debouncedTerm ? { search: debouncedTerm } : {}, {
      replace: true,
    })
  }, [debouncedTerm, search, setSearchParams])

  const { data, loading, error, reload } = useFetch(getGames, {
    page,
    search: search || undefined,
    ordering: '-added',
  })

  function goToPage(next) {
    const params = { page: String(next) }
    if (search) params.search = search
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section>
      <h1>{search ? `Results for “${search}”` : 'New and trending'}</h1>

      <SearchBar value={term} onChange={setTerm} />

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage error={error} onRetry={reload} />
      ) : data.results.length === 0 ? (
        // Zero results is a successful request, not a failure.
        <p className="empty">
          No games match {search ? `“${search}”` : 'that'}. Try a different
          search.
        </p>
      ) : (
        <>
          <p className="count">{data.count.toLocaleString()} games</p>
          <GameGrid games={data.results} />
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={goToPage}
          />
        </>
      )}
    </section>
  )
}
