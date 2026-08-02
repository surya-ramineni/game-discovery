import { useCallback, useEffect, useMemo, useState } from 'react'
import FavoritesContext from './favorites-context'

const STORAGE_KEY = 'game-discovery:favorites'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Corrupt JSON or storage disabled (private mode) — start empty rather
    // than taking the whole app down.
    return []
  }
}

export default function FavoritesProvider({ children }) {
  // Lazy initializer: reads localStorage once on mount, not every render.
  const [favorites, setFavorites] = useState(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Over quota or blocked — favorites just won't survive a reload.
    }
  }, [favorites])

  const toggleFavorite = useCallback((game) => {
    setFavorites((current) => {
      if (current.some((f) => f.id === game.id)) {
        return current.filter((f) => f.id !== game.id)
      }
      // Store only what the card needs, so /favorites renders with no refetch.
      return [
        ...current,
        {
          id: game.id,
          name: game.name,
          background_image: game.background_image,
          released: game.released,
          metacritic: game.metacritic ?? null,
        },
      ]
    })
  }, [])

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites],
  )

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite }),
    [favorites, toggleFavorite, isFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
