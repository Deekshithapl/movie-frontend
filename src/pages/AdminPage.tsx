import MovieForm from '../components/MovieForm';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '../types/Movie';

const AdminPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('https://moviehub-backend-5.onrender.com/api/movies');
      if (response.data.success) {
        const movieList = response.data.data;
        setMovies(movieList);
        
        const today = new Date().toDateString();
        const todayCount = movieList.filter((m: Movie) => 
          new Date(m.createdAt!).toDateString() === today
        ).length;
        
        setStats({ total: movieList.length, today: todayCount });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-12 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          🔧 Admin Dashboard
        </h1>
        <p className="text-gray-400">Manage your movie collection</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-gray-200 text-sm font-medium">Total Movies</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-gray-200 text-sm font-medium">Added Today</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.today}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-gray-200 text-sm font-medium">Storage Used</h3>
          <p className="text-4xl font-bold text-white mt-2">~{stats.total * 2}MB</p>
        </div>
      </div>

      {/* Movie Form */}
      <MovieForm />

      {/* Recent Movies Table */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">📋 Recent Movies</h2>
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Image</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Title</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Description</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {movies.slice(0, 5).map((movie) => (
                  <tr key={movie._id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <img src={movie.image} alt={movie.title} className="w-16 h-16 object-cover rounded-lg" />
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{movie.title}</td>
                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{movie.description}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {movies.length === 0 && (
            <div className="text-center py-8 text-gray-400">No movies yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;