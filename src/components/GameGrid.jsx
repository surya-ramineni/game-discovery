import GameCard from './GameCard'

export default function GameGrid({ games }) {
  return (
    <div className="grid">
      {/* getGames returns one entry per game, so gameID is unique here. */}
      {games.map((game) => (
        <GameCard key={game.gameID} game={game} />
      ))}
    </div>
  )
}
