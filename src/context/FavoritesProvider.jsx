import { useCallback, useEffect, useMemo, useState } from 'react'
import FavoritesContext from './favorites-context'

const STORAGE_KEY = 'game-discovery:favorites'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    // Entries saved before the CheapShark migration are keyed by RAWG ids,
    // which don't exist here — drop them rather than render dead cards.
    return Array.isArray(parsed) ? parsed.filter((f) => f?.gameID) : []
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
      if (current.some((f) => f.gameID === game.gameID)) {
        return current.filter((f) => f.gameID !== game.gameID)
      }
      // Store only what the card needs, so /favorites renders with no refetch.
      // Prices are left out on purpose: they'd be stale by the next visit.
      return [
        ...current,
        {
          gameID: game.gameID,
          title: game.title,
          thumb: game.thumb ?? null,
          releaseDate: game.releaseDate ?? null,
          metacriticScore: game.metacriticScore ?? null,
        },
      ]
    })
  }, [])

  const isFavorite = useCallback(
    (gameID) => favorites.some((f) => f.gameID === gameID),
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
