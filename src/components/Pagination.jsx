export default function Pagination({ page, totalPages, hasNext, onChange }) {
  // `totalPages` can be null (see getGames), so decide on `hasNext` instead.
  if (page <= 1 && !hasNext) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>

      <span className="page-count">
        {totalPages ? `Page ${page} of ${totalPages}` : `Page ${page}`}
      </span>

      <button
        type="button"
        className="btn"
        onClick={() => onChange(page + 1)}
        disabled={!hasNext}
      >
        Next
      </button>
    </nav>
  )
}
