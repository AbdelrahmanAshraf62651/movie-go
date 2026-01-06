import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    fetchMovieId,
    fetchTvId,
    fetchImages,
    fetchVideos
} from "../services/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fullStar, faStarHalfAlt as halfStar, faHeart as solidHeart, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar, faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import Skeleton from "../components/Skeleton";
import "../styles/fade-up.css";

function StarRating({ rating }) {
    let stars = [];
    let full = Math.floor(rating);
    let half = rating % 1 >= 0.5 ? 1 : 0;
    let empty = 5 - (full + half);
    let i = 0;
    while (full--) stars.push(<FontAwesomeIcon key={i++} icon={fullStar} className="text-red-500" />);
    if (half) stars.push(<FontAwesomeIcon key={i++} icon={halfStar} className="text-red-500" />);
    while (empty--) stars.push(<FontAwesomeIcon key={i++} icon={emptyStar} className="text-red-500" />);
    return <div className="flex gap-1">{stars}</div>;
}

function MovieDetail() {
    const { id } = useParams();
    const location = useLocation();
    const isTv = location.pathname.startsWith("/tv");

    const [item, setItem] = useState(null);
    const [images, setImages] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isFav, setIsFav] = useState(false);
    const [bgLoading, setBgLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imgLoaded, setImgLoaded] = useState({});
    const [modalLoaded, setModalLoaded] = useState(false);

    useEffect(() => {
        async function loadItem() {
            try {
                const data = isTv ? await fetchTvId(id) : await fetchMovieId(id);
                const imagesData = await fetchImages(id, isTv);
                const videosData = await fetchVideos(id, isTv);

                setItem(data);
                setImages(imagesData);
                setVideos(videosData);

                const favs = JSON.parse(localStorage.getItem("favs")) || [];
                setIsFav(favs.some(fav => fav.id === data.id));
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        }
        loadItem();
    }, [id, isTv]);

    function handleFavClick() {
        let favs = JSON.parse(localStorage.getItem("favs")) || [];
        if (isFav) {
            favs = favs.filter(fav => fav.id !== item.id);
        } else {
            favs.push(item);
        }
        localStorage.setItem("favs", JSON.stringify(favs));
        setIsFav(!isFav);
    }

    if (!item) {
        return (
            <p className="text-center mt-10">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-red-500" />
            </p>
        );
    }

    const bgUrl = item.backdrop_path
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : `https://image.tmdb.org/t/p/original${item.poster_path}`;

    let companies = item.production_companies || item.networks || [];

    return (
        <div className="flex flex-col justify-center relative min-h-[calc(100vh-112px)] text-white p-6 md:p-12">
            {bgLoading && (
                <div className="absolute inset-0">
                    <Skeleton className="w-full h-full" />
                </div>
            )}
            <img
                src={bgUrl}
                alt={item.title || item.name}
                className="absolute inset-0 w-full h-full object-cover"
                onLoad={() => { setBgLoading(false); console.log(item); }}
            />
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            <div className="absolute top-5 right-5 bg-[#fff0] p-3 rounded-full hover:brightness-150 transition duration-100 z-10">
                <button onClick={handleFavClick}>
                    <FontAwesomeIcon icon={isFav ? solidHeart : regularHeart} className={`w-6 h-6 hover:scale-120 transition duration-150 cursor-pointer ${isFav ? "text-red-500" : "text-white"}`} />
                </button>
            </div>

            <div className="fade-up relative max-w-2xl flex flex-col grow gap-3 justify-center">
                <h1 className="text-4xl font-bold">{item.title || item.name}</h1>
                {item.tagline && <h3 className="text-xl">{item.tagline}</h3>}
                <div className="flex gap-2 flex-wrap">
                    {item.genres?.map((genre) => (
                        <span key={genre.id} className="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-full">
                            {genre.name}
                        </span>
                    ))}
                </div>
                <p className="opacity-70">{item.release_date || item.first_air_date}</p>
                <p>{item.overview}</p>
                <p>Rate: {item.vote_average}</p>
                <StarRating rating={item.vote_average / 2} />

                {images?.backdrops?.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-3">Images</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 group">
                            {images?.backdrops?.slice(0, 4).map((img, idx) => (
                                <div key={img.file_path} className="relative w-full h-24 hover:cursor-pointer hover:brightness-110 group-hover:not-hover:brightness-50 transition duration-200">
                                    {!imgLoaded[idx] && <Skeleton />}
                                    <img
                                        src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
                                        alt="Backdrop"
                                        className={`h-24 w-full object-cover rounded-lg cursor-pointer transition-opacity ${!imgLoaded[idx] ? "opacity-0" : "opacity-100"}`}
                                        onClick={() => {
                                            setSelectedImage(`https://image.tmdb.org/t/p/original${img.file_path}`);
                                            setModalLoaded(false);
                                        }}
                                        onLoad={() => setImgLoaded(prev => ({ ...prev, [idx]: true }))}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {videos?.filter((v) => v.site === "YouTube").length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-xl font-bold mb-3">Videos</h2>
                        <div className="flex flex-col gap-3 mt-2">
                            {videos?.filter(v => v.site === "YouTube").map(v => (
                                <div key={v.id} className="w-full relative" style={{ paddingTop: "56.25%" }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${v.key}`}
                                        title={v.name}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                                    ></iframe>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {companies?.length > 0 && companies[0].logo_path && (
                    <div className="mt-4">
                        <div className="flex flex-row gap-4 items-center">
                            {companies.map((company) => (
                                <div key={company.id}>
                                    {((company.logo_path)) && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                            alt={company.name}
                                            className="max-w-12 object-contain bg-accent rounded-md p-1"
                                        />
                                    )}
                                </div>
                            ))}</div>
                    </div>
                )

                }
            </div>

            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-h-[90vh] max-w-[90vw]">
                        {!modalLoaded && <Skeleton />}
                        <img
                            src={selectedImage}
                            alt="Backdrop"
                            className={`max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg transition-opacity duration-300 ${modalLoaded ? "opacity-100" : "opacity-0 absolute"}`}
                            onLoad={() => setModalLoaded(true)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetail;
