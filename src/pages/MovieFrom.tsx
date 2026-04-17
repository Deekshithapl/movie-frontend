import React, { useState, useEffect } from 'react';
import { Movie } from '../types/Movie';

interface MovieFormProps {
  movie?: Movie;
  onClose: () => void;
  refreshMovies: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ movie, onClose, refreshMovies }) => {
  const [formData, setFormData] = useState({
    title: '',
    genre: '', // comma-separated string
    year: '',
    rating: '',
    duration: '',
    poster: '',
    description: '',
  });

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title,
        genre: movie.genre.join(', '), // convert array to comma string
        year: movie.year.toString(),
        rating: movie.rating.toString(),
        duration: movie.duration,
        poster: movie.poster,
        description: movie.description,
      });
    }
  }, [movie]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert genre string to array
    const genreArray = formData.genre
      .split(',')
      .map(g => g.trim())
      .filter(g => g.length > 0);

    const movieData = {
      ...formData,
      genre: genreArray,
      year: Number(formData.year),
      rating: Number(formData.rating),
    };

    try {
      if (movie) {
        // Edit existing movie
        await fetch(`https://moviehub-backend-5.onrender.com/api/movies/${movie._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieData),
        });
      } else {
        // Add new movie
        await fetch('https://moviehub-backend-5.onrender.com/api/movies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieData),
        });
      }
      refreshMovies();
      onClose();
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
      >
        <h2 className="text-xl font-bold text-white mb-4">{movie ? 'Edit Movie' : 'Add Movie'}</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="genre"
          placeholder="Genres (comma separated)"
          value={formData.genre}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          min="0"
          max="10"
          step="0.1"
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          name="poster"
          placeholder="Poster URL"
          value={formData.poster}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          rows={4}
        />
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            {movie ? 'Save Changes' : 'Add Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;
