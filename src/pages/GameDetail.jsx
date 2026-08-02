import { Link, useParams } from 'react-router-dom'
import { getGame } from '../api/games'
import useFetch from '../hooks/useFetch'
import useFavorites from '../hooks/useFavorites'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

export default function GameDetail() {
  const { id } = useParams()
  const { isFavorite, toggleFavorite } = useFavorites()

  const { data: game, loading, error, reload } = useFetch(getGame, { id })

  if (loading) return <Spinner label="Loading game…" />
  if (error) return <ErrorMessage error={error} onRetry={reload} />

  const favorited = isFavorite(game.id)

  return (
    <article className="detail">
      <Link to="/" className="back">
        &larr; Back to games
      </Link>

      {game.background_image && (
        <img className="detail-hero" src={game.background_image} alt="" />
      )}

      <div className="detail-head">
        <h1>{game.name}</h1>
        <button
          type="button"
          className={favorited ? 'btn fav-btn on' : 'btn fav-btn'}
          onClick={() => toggleFavorite(game)}
          aria-pressed={favorited}
        >
          {favorited ? '★ Saved' : '☆ Save'}
        </button>
      </div>

      <dl className="facts">
        <div>
          <dt>Released</dt>
          <dd>{game.released || 'TBA'}</dd>
        </div>
        <div>
          <dt>Metacritic</dt>
          <dd>{game.metacritic ?? '—'}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{game.rating ? `${game.rating} / 5` : '—'}</dd>
        </div>
        <div>
          <dt>Genres</dt>
          <dd>{game.genres?.map((g) => g.name).join(', ') || '—'}</dd>
        </div>
        <div>
          <dt>Platforms</dt>
          <dd>
            {game.platforms?.map((p) => p.platform.name).join(', ') || '—'}
          </dd>
        </div>
      </dl>

      {game.description_raw && (
        <div className="about">
          <h2>About</h2>
          <p>{game.description_raw}</p>
        </div>
      )}
    </article>
  )
}
