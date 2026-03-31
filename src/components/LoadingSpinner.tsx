import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-l-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;