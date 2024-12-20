import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import Box from "./components/Box";
import MovieDetails from "./components/MovieDetails";
import Loader from "./components/Loader";
import WatchSummary from "./components/WatchSummary";
import MovieList from "./components/MovieList";
import WatchedMoviesList from "./components/WatchedMoviesList";
import ErrorMessage from "./components/ErrorMessage";

const KEY = process.env.REACT_APP_API_KEY;

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selelectedId, setSelectedId] = useState(null);

  function handleSelecteMovie(id) {
    setSelectedId((selelectedId) => (id === selelectedId ? null : id));
  }

  function handleCloseMovie(id) {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function hanldeDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    toast.error("Film retiré !");
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error(
              "Une erreur est survenue lors de la récupération des films"
            );

          const data = await res.json();

          if (data.Response === "False") throw new Error("Film non trouvé");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <ToastContainer theme="colored" />
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelecteMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selelectedId ? (
            <MovieDetails
              selelectedId={selelectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={hanldeDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
