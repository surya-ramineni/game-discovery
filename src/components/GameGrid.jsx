import GameCard from './GameCard'

export default function GameGrid({ games }) {
  return (
    <div className="grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
