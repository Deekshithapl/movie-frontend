import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Download, HardDrive, Monitor } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { movies } = useApp();
  
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Movies</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                <div className="flex items-center space-x-6 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-xl font-semibold">{movie.rating}/10</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{movie.duration}</span>
                  </div>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((genre) => (
                  <span
                    key={genre}
                    className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">Overview</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Download Info */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Download Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <HardDrive className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="text-sm text-gray-400">File Size</div>
                      <div className="font-medium">{movie.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Monitor className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="text-sm text-gray-400">Quality</div>
                      <div className="font-medium">{movie.quality}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Star className="h-5 w-5 text-purple-400" />
                    <div>
                      <div className="text-sm text-gray-400">Rating</div>
                      <div className="font-medium">{movie.rating}/10</div>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => window.open(movie.downloadLink, '_blank')}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center space-x-3"
                >
                  <Download className="h-6 w-6" />
                  <span className="text-lg">Download Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;