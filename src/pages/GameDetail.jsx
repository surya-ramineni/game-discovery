import { Link, useParams } from 'react-router-dom'
import { getGame, getStores } from '../api/games'
import useFetch from '../hooks/useFetch'
import useFavorites from '../hooks/useFavorites'
import Spinner from '../components/Spinner'
import ErrorMessage from '../components/ErrorMessage'

const CHEAPSHARK = 'https://www.cheapshark.com'

function formatDate(unixSeconds) {
  return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function GameDetail() {
  const { id } = useParams()
  const { isFavorite, toggleFavorite } = useFavorites()

  const { data: game, loading, error, reload } = useFetch(getGame, { id })
  // Store names and icons. Non-critical: if this fails, deals fall back to
  // "Store <id>" rather than taking the page down.
  const { data: stores } = useFetch(getStores)

  if (loading) return <Spinner label="Loading deals…" />
  if (error) return <ErrorMessage error={error} onRetry={reload} />

  const { info, cheapestPriceEver, deals } = game
  const storeById = new Map((stores ?? []).map((s) => [s.storeID, s]))
  const sortedDeals = [...deals].sort((a, b) => a.price - b.price)
  const favorited = isFavorite(id)

  return (
    <article className="detail">
      <Link to="/" className="back">
        &larr; Back to deals
      </Link>

      <div className="detail-head">
        {info.thumb && <img className="detail-thumb" src={info.thumb} alt="" />}
        <h1>{info.title}</h1>
        <button
          type="button"
          className={favorited ? 'btn fav-btn on' : 'btn fav-btn'}
          onClick={() =>
            toggleFavorite({ gameID: id, title: info.title, thumb: info.thumb })
          }
          aria-pressed={favorited}
        >
          {favorited ? '★ Saved' : '☆ Save'}
        </button>
      </div>

      <dl className="facts">
        <div>
          <dt>Best price now</dt>
          <dd>{sortedDeals.length ? `$${sortedDeals[0].price}` : '—'}</dd>
        </div>
        <div>
          <dt>Cheapest ever</dt>
          <dd>
            {cheapestPriceEver?.price
              ? `$${cheapestPriceEver.price} on ${formatDate(cheapestPriceEver.date)}`
              : '—'}
          </dd>
        </div>
        <div>
          <dt>Stores</dt>
          <dd>{deals.length}</dd>
        </div>
      </dl>

      <h2>Deals</h2>
      {sortedDeals.length === 0 ? (
        <p className="empty">No store is selling this right now.</p>
      ) : (
        <ul className="deals">
          {sortedDeals.map((deal) => {
            const store = storeById.get(deal.storeID)
            const savings = Math.round(Number(deal.savings) || 0)

            return (
              <li key={deal.dealID} className="deal">
                <span className="deal-store">
                  {store && (
                    <img
                      src={`${CHEAPSHARK}${store.images.icon}`}
                      alt=""
                      width="16"
                      height="16"
                    />
                  )}
                  {store?.storeName ?? `Store ${deal.storeID}`}
                </span>

                <span className="price">
                  <span className="price-now">${deal.price}</span>
                  {savings > 0 && (
                    <>
                      <s className="price-was">${deal.retailPrice}</s>
                      <span className="price-off">-{savings}%</span>
                    </>
                  )}
                </span>

                {/* CheapShark's terms require deal links to go through their
                    redirect. dealID arrives already URL-encoded. */}
                <a
                  className="btn"
                  href={`${CHEAPSHARK}/redirect?dealID=${deal.dealID}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View deal
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}
