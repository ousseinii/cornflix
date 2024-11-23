export default function NumResults({ movies }) {
  return (
    <p className="num-results">
      <strong>{movies.length}</strong> film{movies.length <= 0 ? "" : "s"}{" "}
      trouvés
    </p>
  );
}
