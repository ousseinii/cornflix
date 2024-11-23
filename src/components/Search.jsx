export default function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Rechercher des films..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
