import { Routes, Route } from 'react-router-dom'
import FavoritesProvider from './context/FavoritesProvider'
import Layout from './components/Layout'
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import Favorites from './pages/Favorites'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="game/:id" element={<GameDetail />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </FavoritesProvider>
  )
}

export default App
