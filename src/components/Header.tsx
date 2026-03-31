import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, User, Search, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { user, logout, searchQuery, setSearchQuery } = useApp();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Film className="h-8 w-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
            <span className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
              MovieHub
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {isHomePage && (
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 w-64"
                />
              </div>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;