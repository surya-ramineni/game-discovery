export default function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <input
        type="search"
        className="search-input"
        placeholder="Search games…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search games"
      />
    </div>
  )
}
