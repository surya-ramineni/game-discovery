import { Link, useParams } from 'react-router-dom'
import { getGame } from '../api/games'
import useFetch from '../hooks/useFetch'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

export default function GameDetail() {
  const { id } = useParams()
  const { data: game, loading, error, reload } = useFetch(getGame, { id })

  if (loading) return <Spinner label="Loading game…" />
  if (error) return <ErrorMessage error={error} onRetry={reload} />

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
