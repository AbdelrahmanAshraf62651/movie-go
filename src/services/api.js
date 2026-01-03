const key = import.meta.env.VITE_IMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Popular
export async function getPopularMovie() {
    const res = await fetch(`${BASE_URL}/discover/movie?include_adult=false&api_key=${key}`);
    const data = await res.json();
    return data.results;
}

export async function getPopularTv() {
    const res = await fetch(`${BASE_URL}/discover/tv?include_adult=false&api_key=${key}`);
    const data = await res.json();
    return data.results;
}

// Top Rated
export async function getTopRatedMovie() {
    const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${key}`);
    const data = await res.json();
    return data.results;
}

export async function getTopRatedTv() {
    const res = await fetch(`${BASE_URL}/tv/top_rated?api_key=${key}`);
    const data = await res.json();
    return data.results;
}

// Trending (daily)
export async function getTrending() {
    const res = await fetch(`${BASE_URL}/trending/all/day?api_key=${key}`);
    const data = await res.json();
    return data.results;
}

// Upcoming Movies
export async function getUpcomingMovies() {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${key}`);
    const data = await res.json();
    return data.results;
}

// Search
export async function searchMovie(query) {
    const res = await fetch(`${BASE_URL}/search/movie?include_adult=false&api_key=${key}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results;
}

export async function searchTv(query) {
    const res = await fetch(`${BASE_URL}/search/tv?include_adult=false&api_key=${key}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results;
}

// Fetch by ID
export async function fetchMovieId(id) {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${key}`);
    const data = await res.json();
    return data;
}

export async function fetchTvId(id) {
    const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${key}`);
    const data = await res.json();
    return data;
}

// Discover by Genre
export async function discoverMovieByGenre(genreId) {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${key}&with_genres=${genreId}`);
    const data = await res.json();
    return data.results;
}

export async function discoverTvByGenre(genreId) {
    const res = await fetch(`${BASE_URL}/discover/tv?api_key=${key}&with_genres=${genreId}`);
    const data = await res.json();
    return data.results;
}

// Credits, Images, Videos
export async function fetchCredits(id, isTv = false) {
    const type = isTv ? "tv" : "movie";
    const res = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${key}`);
    const data = await res.json();
    return data;
}

export async function fetchImages(id, isTv = false) {
    const type = isTv ? "tv" : "movie";
    const res = await fetch(`${BASE_URL}/${type}/${id}/images?api_key=${key}`);
    const data = await res.json();
    return data;
}

export async function fetchVideos(id, isTv = false) {
    const type = isTv ? "tv" : "movie";
    const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${key}`);
    const data = await res.json();
    return data.results.slice(0, 1);
}

// Genres
export const GENRES = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
};
