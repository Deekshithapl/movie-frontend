import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { Movie } from '../types/Movie';

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      if (response.data.success) {
        setMovies(response.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Hero Section */}
      <div className="text-center mb-12 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          🎬 Welcome to MovieHub
        </h1>
        <p className="text-gray-400 text-xl">Discover amazing movies from our collection</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && (
        <>
          {filteredMovies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No movies found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try a different search term' : 'Add some movies from the Admin page!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onDelete={fetchMovies}
                  onViewDetails={setSelectedMovie}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Movie Count */}
      {!loading && movies.length > 0 && (
        <div className="text-center mt-8 text-gray-400">
          <p>Showing {filteredMovies.length} of {movies.length} movies</p>
        </div>
      )}

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default HomePage;