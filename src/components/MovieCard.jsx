import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";
import Skeleton from "./Skeleton";
import "../styles/fade-up.css";

function MovieCard({ movie }) {
    // Hide card if there is no poster
    if (!movie.poster_path) return null;

    // State
    const [isFav, setIsFav] = useState(() => {
        const favs = JSON.parse(localStorage.getItem("favs")) || [];
        return favs.some((fav) => fav.id === movie.id);
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Handle favorites on mount
    useEffect(() => {
        const favs = JSON.parse(localStorage.getItem("favs")) || [];
        setIsFav(favs.some((fav) => fav.id === movie.id));
    }, [movie.id]);

    // Toggle favorite
    const handleFavClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let favs = JSON.parse(localStorage.getItem("favs")) || [];
        if (isFav) {
            favs = favs.filter((fav) => fav.id !== movie.id);
        } else {
            favs.push(movie);
        }
        localStorage.setItem("favs", JSON.stringify(favs));
        setIsFav(!isFav);
        window.dispatchEvent(new Event("favsUpdated"));
    };

    // Determine media type
    const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie");
    const imgUrl = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;

    return (
        <Link
            to={`/${mediaType}/${movie.id}`}
            aria-label={`View details for ${movie.title || movie.name}`}
            className="movie-card shrink-0 flex flex-col hover:shadow-lg hover:brightness-80 transition duration-300 text-white rounded-lg bg-gray-950 h-full"
            style={{ flex: "0 0 20%", minWidth: "150px" }}
        >
            <div className="relative w-full aspect-2/3">
                {/* Skeleton while loading */}
                {loading && !error && (
                    <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
                )}

                {/* Movie Poster */}
                {!error && (
                    <img
                        src={imgUrl}
                        alt={movie.title || movie.name}
                        className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"
                            }`}
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setError(true);
                            setLoading(false);
                        }}
                    />
                )}

                {/* Fallback if image fails */}
                {error && (
                    <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-gray-300 text-sm rounded-lg">
                        No Image
                    </div>
                )}

                {/* Favorite Button */}
                <div className="absolute top-2 right-2 bg-[#fff0] p-2 rounded-full hover:brightness-125 cursor-pointer">
                    <button onClick={handleFavClick}>
                        <FontAwesomeIcon
                            icon={isFav ? solidHeart : regularHeart}
                            className={`w-5 h-5 ${isFav ? "text-red-500" : "text-white"
                                } cursor-pointer hover:scale-120 transition duration-300`}
                        />
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default MovieCard;
