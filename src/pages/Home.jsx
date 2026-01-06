import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import Carousel from "../components/Carousel";
import {
    getPopularMovie,
    getPopularTv,
    getTopRatedMovie,
    getTopRatedTv,
    getTrending,
    getUpcomingMovies,
    searchMovie,
    searchTv,
    GENRES,
    discoverMovieByGenre,
    discoverTvByGenre,
} from "../services/api.js";
import "../styles/fade-up.css";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [hasSearched, setHasSearched] = useState(false);
    const [searchResults, setSearchResults] = useState({ movies: [], tvs: [] });
    const [showAllSections, setShowAllSections] = useState(true);
    const [showNoResults, setShowNoResults] = useState(false);

    const [popularMovies, setPopularMovies] = useState([]);
    const [popularTvs, setPopularTvs] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [topRatedTvs, setTopRatedTvs] = useState([]);
    const [trending, setTrending] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);

    const movieRef = useRef(null);
    const tvRef = useRef(null);
    const topMovieRef = useRef(null);
    const topTvRef = useRef(null);
    const trendingRef = useRef(null);
    const upcomingRef = useRef(null);

    useEffect(() => {
        getTrending().then(setTrending);
        getPopularMovie().then(setPopularMovies);
        getPopularTv().then(setPopularTvs);
        getTopRatedMovie().then(setTopRatedMovies);
        getTopRatedTv().then(setTopRatedTvs);
        getUpcomingMovies().then(setUpcomingMovies);
    }, []);

    useEffect(() => {
        const search = searchParams.get("search");
        if (search) {
            performSearch(search);
        } else {
            setHasSearched(false);
            setShowAllSections(true);
            setSearchResults({ movies: [], tvs: [] });
        }
    }, [searchParams]);

    const performSearch = async (query) => {
        if (!query) return;
        setSearchQuery(query);
        setHasSearched(true);
        setShowAllSections(false);
        setShowNoResults(false);

        try {
            const [movieResults, tvResults] = await Promise.all([
                searchMovie(query),
                searchTv(query),
            ]);
            const filteredMovies = (movieResults || []).filter(
                (m) => m.poster_path && m.poster_path.trim() !== ""
            );
            const filteredTvs = (tvResults || []).filter(
                (t) => t.poster_path && t.poster_path.trim() !== ""
            );

            const results = { movies: filteredMovies, tvs: filteredTvs };
            setSearchResults(results);

            if (results.movies.length === 0 && results.tvs.length === 0) {
                setTimeout(() => setShowNoResults(true), 0);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ search: searchQuery });
    };

    useEffect(() => {
        const genreId = searchParams.get("genre");
        if (genreId) {
            discoverByGenre(Number(genreId));
        }
    }, [searchParams]);

    const discoverByGenre = async (genreId) => {
        setShowAllSections(false);
        setHasSearched(false);
        setShowNoResults(false);
        setSearchResults({ movies: [], tvs: [] });

        try {
            const [moviesByGenre, tvsByGenre] = await Promise.all([
                discoverMovieByGenre(genreId),
                discoverTvByGenre(genreId),
            ]);
            setPopularMovies(moviesByGenre || []);
            setPopularTvs(tvsByGenre || []);
            setShowAllSections(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGenreClick = (genreId) => {
        setSearchParams({ genre: String(genreId) });
    };

    return (
        <div className="home fade-up px-4 md:px-8 py-10 min-h-screen text-white">
            <form className="flex justify-center mb-6" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search movies or TV shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-2xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 caret-red-500"
                />
            </form>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {Object.entries(GENRES).map(([id, name]) => (
                    <button key={id} onClick={() => handleGenreClick(id)} className="px-4 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-105 transition transform duration-200 cursor-pointer">
                        {name}
                    </button>
                ))}
            </div>

            {hasSearched ? (
                searchResults.movies.length === 0 && searchResults.tvs.length === 0 ? (
                    showNoResults && (
                        <div className="text-center py-20 text-gray-400 fade-up">
                            <h2 className="text-2xl font-bold mb-2">No results found</h2>
                            <p className="text-lg">Try searching for another movie or TV show.</p>
                        </div>
                    )
                ) : (
                    <div className="movie-grid grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-5">
                        {searchResults.movies
                            .filter((movie) => movie.poster_path)
                            .map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        {searchResults.tvs
                            .filter((tv) => tv.poster_path)
                            .map((tv) => (
                                <MovieCard key={tv.id} movie={tv} />
                            ))}
                    </div>
                )
            ) : (
                <>
                    {showAllSections && trending.length > 0 && (
                        <Carousel title="Trending" items={trending} ref={trendingRef} />
                    )}
                    {popularMovies.length > 0 && (
                        <Carousel title="Popular Movies" items={popularMovies} ref={movieRef} />
                    )}
                    {popularTvs.length > 0 && (
                        <Carousel title="Popular TV Shows" items={popularTvs} ref={tvRef} />
                    )}
                    {showAllSections && (
                        <>
                            {topRatedMovies.length > 0 && (
                                <Carousel title="Top Rated Movies" items={topRatedMovies} ref={topMovieRef} />
                            )}
                            {topRatedTvs.length > 0 && (
                                <Carousel title="Top Rated TV Shows" items={topRatedTvs} ref={topTvRef} />
                            )}
                            {upcomingMovies.length > 0 && (
                                <Carousel title="Upcoming Movies" items={upcomingMovies} ref={upcomingRef} />
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;
