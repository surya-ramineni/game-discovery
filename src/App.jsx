import { useEffect, useState } from 'react'
import rawg from './api/rawg'
import GameGrid from './components/GameGrid'
import Spinner from './components/Spinner'
import ErrorMessage from './components/ErrorMessage'
import './App.css'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    rawg
      .get('/games', { params: { ordering: '-added', page_size: 20 } })
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
  }, [])

  return (
    <main className="page">
      <h1>New and trending</h1>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : games.length === 0 ? (
        // empty list is a successful response, not an error
        <p className="empty">No games found.</p>
      ) : (
        <GameGrid games={games} />
      )}
    </main>
  )
}

export default App
