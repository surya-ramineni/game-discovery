import { Link } from 'react-router-dom'
import useFavorites from '../hooks/useFavorites'
import GameGrid from '../components/GameGrid'

export default function Favorites() {
  const { favorites } = useFavorites()

  return (
    <section>
      <h1>Favorites</h1>

      {favorites.length === 0 ? (
        <p className="empty">
          Nothing saved yet. Star a game and it&rsquo;ll show up here.{' '}
          <Link to="/">Browse games</Link>
        </p>
      ) : (
        <>
          <p className="count">
            {favorites.length} saved {favorites.length === 1 ? 'game' : 'games'}
          </p>
          <GameGrid games={favorites} />
        </>
      )}
    </section>
  )
}
