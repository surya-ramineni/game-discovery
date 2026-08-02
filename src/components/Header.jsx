import { Link, NavLink } from 'react-router-dom'
import useFavorites from '../hooks/useFavorites'

export default function Header() {
  const { favorites } = useFavorites()

  return (
    <header className="header">
      <Link to="/" className="brand">
        Game<span>Discovery</span>
      </Link>

      <nav className="nav">
        <NavLink to="/" end>
          Browse
        </NavLink>
        <NavLink to="/favorites">
          Favorites
          {favorites.length > 0 && (
            <span className="badge">{favorites.length}</span>
          )}
        </NavLink>
      </nav>
    </header>
  )
}
