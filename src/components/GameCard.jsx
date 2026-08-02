function metacriticClass(score) {
  if (score >= 75) return 'meta good'
  if (score >= 50) return 'meta ok'
  return 'meta bad'
}

export default function GameCard({ game }) {
  return (
    <article className="card">
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
    </article>
  )
}
