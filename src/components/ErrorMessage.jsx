export default function ErrorMessage({ error, onRetry }) {
  const status = error?.response?.status
  const message =
    status === 401
      ? 'RAWG rejected the API key. Check VITE_RAWG_KEY in your .env.'
      : status === 404
        ? 'We couldn’t find that.'
        : error?.message || 'Something went wrong.'

  return (
    <div className="error" role="alert">
      <h2>Couldn’t load that</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
