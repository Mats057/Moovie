import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { SearchContext } from "../context/SearchContext";
import MoviesService from "@/services/MoviesService";
import { MovieCard } from "@/components/movie-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollRestoration, useParams } from "react-router-dom";
import { SearchFilters } from "@/components/search-filters";

function useWindowSize() {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateWidth() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  return width;
}

function Search() {
  const { searchTag } = useParams();
  const { searchTerm } = useContext(SearchContext);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ generos: [], nota: "" });
  const width = useWindowSize();

  useEffect(() => {
    if (searchTag) {
      fetchTag(searchTag, currentPage, filters);
    } else if (searchTerm) {
      fetchMovies(searchTerm, currentPage, filters);
    }
  }, [searchTag, searchTerm, currentPage, filters]);

  const fetchMovies = (searchTerm, page, filtros) => {
    MoviesService.searchMovies(searchTerm, page, filtros).then((query) => {
      setMovies(query.data.results);
      setTotalPages(query.data.total_pages);
    });
  };

  const fetchTag = async (tag, page, filtros) => {
    let tagSearch = null;
    if (tag === "trending") {
      tagSearch = await MoviesService.getTrendingMovies(page, filtros);
    } else {
      tagSearch = await MoviesService.getMoviesList(tag, page, filtros);
    }

    if (tagSearch.results) {
      setMovies(tagSearch.results);
      setTotalPages(tagSearch.total_pages);
    }
  };

  const handlePageChange = (page) => {
    document.documentElement.scrollTop = 0;
    setCurrentPage(page);
  };

  const aplicarFiltros = (novosFiltros) => {
    setFilters(novosFiltros);
    setCurrentPage(1); // Reseta para a primeira página após aplicar filtros
  };

  const renderPaginationItems = () => {
    const pages = [];
    const maxPagesToShow = width < 768 ? 1 : 2;

    if (currentPage > maxPagesToShow + 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            className="select-none cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (currentPage > maxPagesToShow + 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (
      let i = Math.max(1, currentPage - maxPagesToShow);
      i <= Math.min(totalPages, currentPage + maxPagesToShow);
      i++
    ) {
      pages.push(
        <PaginationItem key={i} active={`${i === currentPage}`}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            className={
              i === currentPage
                ? "bg-secondary select-none cursor-pointer"
                : "select-none cursor-pointer"
            }
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    if (currentPage < totalPages - maxPagesToShow) {
      if (currentPage < totalPages - maxPagesToShow - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            className="select-none cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  if (!searchTag && !searchTerm) {
    return (
      <div className="flex flex-col flex-1 flex-grow bg-background text-text justify-center items-center min-h-screen py-8">
        <h1 className="mb-4 text-2xl">Digite algo para pesquisar</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 flex-grow bg-background text-text justify-start items-center min-h-screen py-8">
      <div className="w-full md:w-[90%] xl:w-[50%] flex items-center justify-between px-12">
      <h1 className="font-bold text-2xl">Resultados da pesquisa:</h1>
      <SearchFilters aplicarFiltros={aplicarFiltros} />
      </div>

      {movies.length === 0 ? (
        <p className="text-2xl font-medium text-center">
          Nenhum filme encontrado ({searchTag || searchTerm})
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} id={movie.id} />
          ))}
        </div>
      )}
      {movies.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        >
          <PaginationContent>
            <PaginationItem disabled={currentPage === 1}>
              <PaginationPrevious
                className={
                  currentPage === 1
                    ? "cursor-not-allowed hover:bg-background select-none"
                    : "select-none cursor-pointer"
                }
                onClick={() => {
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationNext
                className={
                  currentPage === totalPages
                    ? "cursor-not-allowed hover:bg-background select-none"
                    : "select-none cursor-pointer"
                }
                onClick={() => {
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <ScrollRestoration />
    </div>
  );
}

export default Search;
