import GameCard from './GameCard'

export default function GameGrid({ games }) {
  return (
    <div className="grid">
      {/* One game can appear as several deals (one per store), so dealID is
          the unique key. Saved favorites have no dealID — they're per game. */}
      {games.map((game) => (
        <GameCard key={game.dealID ?? game.gameID} game={game} />
      ))}
    </div>
  )
}
