import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, User } from '../types/Movie';

interface AppContextType {
  movies: Movie[];
  user: User | null;
  searchQuery: string;
  selectedGenre: string;
  setMovies: (movies: Movie[]) => void;
  setUser: (user: User | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string) => void;
  addMovie: (movie: Movie) => Promise<void>;
  updateMovie: (id: string, movie: Movie) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    // Fetch movies from backend API
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error('Failed to fetch movies:', err));
  }, []);

  const addMovie = async (movie: Movie) => {
    const res = await fetch('http://localhost:5000/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
    const newMovie = await res.json();
    setMovies(prev => [...prev, newMovie]);
  };

  const updateMovie = async (id: string, updatedMovie: Movie) => {
    const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMovie),
    });
    const movie = await res.json();
    setMovies(prev => prev.map(m => m.id === id ? movie : m));
  };

  const deleteMovie = async (id: string) => {
  await fetch(`http://localhost:5000/api/movies/${id}`, { method: 'DELETE' });
  setMovies(prev => prev.filter(m => m._id !== id));  // use _id here
};


  const login = (username: string, password: string): boolean => {
    // Mock authentication - replace with real authentication later
    if (username === 'admin' && password === 'admin123') {
      setUser({
        id: '1',
        username: 'admin',
        isAdmin: true
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      movies,
      user,
      searchQuery,
      selectedGenre,
      setMovies,
      setUser,
      setSearchQuery,
      setSelectedGenre,
      addMovie,
      updateMovie,
      deleteMovie,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};