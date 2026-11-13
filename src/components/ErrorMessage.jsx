export default function ErrorMessage({ error, onRetry }) {
  const status = error?.response?.status
  const message =
    error?.code === 'ECONNABORTED'
      ? 'CheapShark took too long to respond. Try again in a moment.'
      : status === 429
        ? 'Too many requests to CheapShark. Wait a few seconds and try again.'
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
