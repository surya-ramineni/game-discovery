import { useState } from 'react'
import { Link } from 'react-router-dom'
import useFavorites from '../hooks/useFavorites'

function metacriticClass(score) {
  if (score >= 75) return 'meta good'
  if (score >= 50) return 'meta ok'
  return 'meta bad'
}

export default function GameCard({ game }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(game.gameID)
  // Some store CDNs refuse hotlinked images (Gamesplanet answers 403).
  // Remember which URL failed so a card reused for another game still tries.
  const [failedThumb, setFailedThumb] = useState(null)
  const showThumb = game.thumb && game.thumb !== failedThumb

  // CheapShark sends releaseDate as Unix seconds and metacriticScore as a
  // string; 0 / "0" mean "unknown", not a real value. Release dates are
  // midnight UTC, so read the year in UTC — a 1 Jan release would otherwise
  // show the previous year anywhere west of Greenwich.
  const year = game.releaseDate
    ? new Date(game.releaseDate * 1000).getUTCFullYear()
    : null
  const metacritic = Number(game.metacriticScore) || null
  const savings = Math.round(Number(game.savings) || 0)

  return (
    <article className="card">
      <Link to={`/game/${game.gameID}`} className="card-link">
        {showThumb ? (
          <img
            className="card-img"
            src={game.thumb}
            alt={game.title}
            loading="lazy"
            onError={() => setFailedThumb(game.thumb)}
          />
        ) : (
          <div className="card-img card-img-empty">No image</div>
        )}

        <div className="card-body">
          <h3 className="card-title">{game.title}</h3>

          {/* Favorites are stored without prices (they go stale), so this
              only renders for live deals. */}
          {game.salePrice != null && (
            <div className="price">
              <span className="price-now">${game.salePrice}</span>
              {savings > 0 && (
                <>
                  <s className="price-was">${game.normalPrice}</s>
                  <span className="price-off">-{savings}%</span>
                </>
              )}
            </div>
          )}

          <div className="card-meta">
            {year && <span>{year}</span>}
            {metacritic && (
              <span className={metacriticClass(metacritic)}>{metacritic}</span>
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
            ? `Remove ${game.title} from favorites`
            : `Add ${game.title} to favorites`
        }
      >
        {favorited ? '★' : '☆'}
      </button>
    </article>
  )
}
