import { Link } from "react-router-dom";

export const MovieCard = ({ movie, id, tag='' }) => {
  return (
    <Link to={id == "verMais" ? `search/${tag}` : `/movie/${id}`}>
      <div
        style={{
          backgroundImage: `url(${import.meta.env.VITE_API_IMAGE_URL}w600_and_h900_bestv2/${movie.poster_path})`,
        }}
        className={`relative bg-cover flex items-center justify-center bg-no-repeat rounded-md w-32 h-48 sm:w-48 sm:h-72 cursor-pointer ${id === "verMais" ? "bg-secondary" : ""}`}
      >
        {id === "verMais" ? (<h1 className="text-text font-bold text-center">VER MAIS DESSA CATEGORIA</h1>) : null}
        <div className="absolute hover:bg-gradient-to-t from-background flex items-start p-4 flex-col justify-end w-full h-full group transition-all duration-700 animate-in fade-in">
          <h2 className="text-text font-medium text-md hidden group-hover:flex transition-all duration-500 animate-in slide-in-from-bottom-10">
            {movie.title}
          </h2>
        </div>
      </div>
    </Link>
  );
};
