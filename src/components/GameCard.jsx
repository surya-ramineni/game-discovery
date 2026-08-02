import { Link } from 'react-router-dom'
import useFavorites from '../hooks/useFavorites'

function metacriticClass(score) {
  if (score >= 75) return 'meta good'
  if (score >= 50) return 'meta ok'
  return 'meta bad'
}

export default function GameCard({ game }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(game.id)

  return (
    <article className="card">
      <Link to={`/game/${game.id}`} className="card-link">
        {game.background_image ? (
          <img
            className="card-img"
            src={game.background_image}
            alt={game.name}
            loading="lazy"
          />
        ) : (
          <div className="card-img card-img-empty">No image</div>
        )}

        <div className="card-body">
          <h3 className="card-title">{game.name}</h3>
          <div className="card-meta">
            <span>{game.released ? game.released.slice(0, 4) : 'TBA'}</span>
            {game.metacritic != null && (
              <span className={metacriticClass(game.metacritic)}>
                {game.metacritic}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        className={favorited ? 'fav on' : 'fav'}
        onClick={() => toggleFavorite(game)}
        aria-pressed={favorited}
        aria-label={
          favorited
            ? `Remove ${game.name} from favorites`
            : `Add ${game.name} to favorites`
        }
      >
        {favorited ? '★' : '☆'}
      </button>
    </article>
  )
}
