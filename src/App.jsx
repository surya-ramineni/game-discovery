import { useState } from 'react'
import { getGames } from './api/games'
import useFetch from './hooks/useFetch'
import useDebounce from './hooks/useDebounce'
import SearchBar from './components/SearchBar'
import GameGrid from './components/GameGrid'
import Spinner from './components/Spinner'
import ErrorMessage from './components/ErrorMessage'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  const { data, loading, error, reload } = useFetch(getGames, {
    search: debouncedQuery || undefined,
    ordering: '-added',
  })

  return (
    <main className="page">
      <h1>
        {debouncedQuery ? `Results for “${debouncedQuery}”` : 'New and trending'}
      </h1>

      <SearchBar value={query} onChange={setQuery} />

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage error={error} onRetry={reload} />
      ) : data.results.length === 0 ? (
        // empty list is a successful response, not an error
        <p className="empty">No games match that search.</p>
      ) : (
        <GameGrid games={data.results} />
      )}
    </main>
  )
}

export default App
