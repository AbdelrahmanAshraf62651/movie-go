import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import MovieCard from "../components/MovieCard";

const scroll = (ref, direction) => {
    if (!ref?.current) return;
    const width = ref.current.clientWidth;
    ref.current.scrollBy({ left: direction * width, behavior: "smooth" });
};

const Carousel = forwardRef(({ title, items }, refProp) => {
    // Ensure items is an array before mapping
    const validItems = Array.isArray(items) ? items : [];

    return (
        <div className="carousel mb-10">
            <h1 className="text-3xl my-5 font-bold">{title}</h1>
            <div className="relative">
                <button onClick={() => scroll(refProp, -1)} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/70 hover:bg-gray-700 text-white p-2 rounded-full cursor-pointer">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <div ref={refProp} className="flex gap-4 group overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    {validItems.map((item) => (
                        <div key={item.id} className="shrink-0 w-37.5 sm:w-50 md:w-62.5 lg:w-75 overflow-hidden">
                            <MovieCard movie={item} />
                        </div>
                    ))}
                </div>

                <button onClick={() => scroll(refProp, 1)} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/70 hover:bg-gray-700 text-white p-2 rounded-full cursor-pointer">
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
});

export default Carousel;
