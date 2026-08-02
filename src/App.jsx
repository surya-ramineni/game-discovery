import { useEffect, useState } from 'react'
import rawg from './api/rawg'
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

  if (loading) return <p>Loading…</p>
  if (error) return <p>Couldn’t load games: {error.message}</p>
  // empty list is a successful response, not an error
  if (games.length === 0) return <p>No games found.</p>

  return (
    <ul>
      {games.map((game) => (
        <li key={game.id}>{game.name}</li>
      ))}
    </ul>
  )
}

export default App
