import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">
        Game<span>Discovery</span>
      </Link>
    </header>
  )
}
