import { useState } from 'react';
import { Movie } from '../types/Movie';
import axios from 'axios';
import PaymentModal from './PaymentModal';

interface Props {
  movie: Movie;
  onDelete?: () => void;
}

const MovieCard = ({ movie, onDelete }: Props) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`http://localhost:5000/api/movies/${movie._id}`);
        if (onDelete) onDelete();
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete movie');
      }
    }
  };

  return (
    <>
      <div 
        className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 border border-gray-700 cursor-pointer group"
        onClick={() => setShowPaymentModal(true)}
      >
        <div className="relative overflow-hidden h-64">
          <img
            src={imageError ? 'https://via.placeholder.com/300x400?text=No+Image' : movie.image}
            alt={movie.title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            ₹199
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              💳 Buy Now
            </button>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-xl mb-2 text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-3">{movie.description}</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>📅 {movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          
          {onDelete && (
            <button 
              onClick={handleDelete}
              className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          movie={movie} 
          onClose={() => setShowPaymentModal(false)} 
        />
      )}
    </>
  );
};

export default MovieCard;