export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

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
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        className="btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </nav>
  )
}
