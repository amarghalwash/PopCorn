import { useState } from "react";
import { useMovies } from "./customHooks/useMovies";
import { useLocalStorageState } from "./customHooks/useLocalStorageState";
import NavBar from "./navbar/NavBar";
import Search from "./navbar/Search";
import NumResults from "./navbar/NumResults";
import Main from "./main/Main";
import Box from "./main/Box";
import MovieList from "./main/MovieList";
import ErrorMessage from "./general/ErrorMessage";
import Loader from "./general/Loader";
import MovieDetails from "./main/MovieDetails";
import WatchedSummary from "./main/watchedlist/WatchedSummary";
import WatchedMoviesList from "./main/watchedlist/WatchedMoviesList";
import Footer from "./footer/Footer";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    // if  movie.imdbID is different from id that move will stay
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              onCloseMovie={handleCloseMovie}
              selectedId={selectedId}
              onAddWatched={handleAddWatched}
              watchList={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
      <Footer />
    </>
  );
}
