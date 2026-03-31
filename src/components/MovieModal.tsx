import { Movie } from '../types/Movie';

interface Props {
  movie: Movie | null;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: Props) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">✕</button>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img src={movie.image} alt={movie.title} className="w-full h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image'; }}
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">{movie.title}</h2>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Description</h3>
              <p className="text-gray-300">{movie.description}</p>
            </div>
            <button onClick={onClose} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;