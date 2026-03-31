import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import MovieCard from './MovieCard';

const MovieGrid: React.FC = () => {
  const { movies, searchQuery, selectedGenre } = useApp();

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          movie.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === '' || movie.genre.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });
  }, [movies, searchQuery, selectedGenre]);

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genre.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, [movies]);

  const { setSelectedGenre } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Genre Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGenre('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedGenre === ''
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Genres
          </button>
          {allGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedGenre === genre
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg mb-2">No movies found</div>
          <div className="text-gray-500">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;