import React from 'react';

export const PostCardSkeleton = ({ count = 1, className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}
        >
          <div className="h-48 bg-gray-200 w-full"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="flex items-center mt-6">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="ml-3">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default {
  PostCardSkeleton
};
