import { useState } from 'react';
import { Movie } from '../types/Movie';
import PaymentButton from './PaymentButton';

interface Props {
  movie: Movie | null;
  onClose: () => void;
}

const PaymentModal = ({ movie, onClose }: Props) => {
  const [loading, setLoading] = useState(false);

  if (!movie) return null;

  const moviePrice = 199;
  const gst = Math.round(moviePrice * 0.18);
  const totalAmount = moviePrice + gst;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-700 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            💳 Purchase Movie
          </h2>
          <p className="text-gray-400 mt-2">Complete your purchase to watch this movie</p>
        </div>

        {/* Movie Info */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-4">
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-20 h-28 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x110?text=No+Image';
              }}
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-3">{movie.description}</p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Movie Price</span>
            <span>₹{moviePrice}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Taxes (18% GST)</span>
            <span>₹{gst}</span>
          </div>
          <div className="border-t border-gray-600 pt-2 flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Payment Button */}
        <PaymentButton
          amount={totalAmount}
          movieId={movie._id!}
          movieTitle={movie.title}
          onSuccess={() => {
            onClose();
            alert('🎉 Payment Successful! Invoice will be downloaded.');
          }}
        />

        {/* Security Badge */}
        <div className="mt-4 text-center text-gray-500 text-sm">
          <p>🔒 Secure Payment powered by Razorpay</p>
          <p className="text-xs mt-1">All transactions are encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;