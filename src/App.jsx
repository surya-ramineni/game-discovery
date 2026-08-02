import { useEffect, useState } from 'react'
import rawg from './api/rawg'
import useDebounce from './hooks/useDebounce'
import SearchBar from './components/SearchBar'
import GameGrid from './components/GameGrid'
import Spinner from './components/Spinner'
import ErrorMessage from './components/ErrorMessage'
import './App.css'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    let ignore = false

    setLoading(true)
    setError(null)

    rawg
      .get('/games', {
        params: {
          ordering: '-added',
          page_size: 20,
          search: debouncedQuery || undefined,
        },
      })
      .then((res) => {
        if (!ignore) setGames(res.data.results)
      })
      .catch((err) => {
        if (!ignore) setError(err)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [debouncedQuery])

  return (
    <main className="page">
      <h1>{debouncedQuery ? `Results for “${debouncedQuery}”` : 'New and trending'}</h1>

      <SearchBar value={query} onChange={setQuery} />

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : games.length === 0 ? (
        // empty list is a successful response, not an error
        <p className="empty">No games match that search.</p>
      ) : (
        <GameGrid games={games} />
      )}
    </main>
  )
}

export default App
