import { createContext } from 'react'

// Kept in its own file so the provider module only exports a component
// (react-refresh/only-export-components).
const FavoritesContext = createContext(null)

export default FavoritesContext
