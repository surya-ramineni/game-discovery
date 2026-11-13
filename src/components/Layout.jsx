import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page">
        <Outlet />
      </main>
      <footer className="footer">
        Deal data from{' '}
        <a href="https://www.cheapshark.com" target="_blank" rel="noreferrer">
          CheapShark
        </a>
      </footer>
    </>
  )
}
