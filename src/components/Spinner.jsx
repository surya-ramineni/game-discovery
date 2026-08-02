export default function Spinner({ label = 'Loading games…' }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  )
}
