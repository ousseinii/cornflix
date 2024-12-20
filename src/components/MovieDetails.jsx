import { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import StarRating from "./StarRating";
import Loader from "./Loader";
import { useKey } from "../hooks/useKey";

const KEY = "59350f2c";

export default function MovieDetails({
  selelectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selelectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selelectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selelectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
    toast.success("Film ajouté !");
  }

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function getMoviesDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?&apikey=${KEY}&i=${selelectedId}`
      );

      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }

    getMoviesDetails();
  }, [selelectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Film | ${title}`;

    return function () {
      document.title = "CornFlix";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              <FaArrowLeft size="16" />
            </button>
            <img src={poster} alt={`Affiche du film ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} note IMDb
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Ajouter à la liste
                    </button>
                  )}
                </>
              ) : (
                <p>
                  Vous avez donné la note de {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Avec {actors}</p>
            <p>Réalisé par {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
