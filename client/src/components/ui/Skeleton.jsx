import React from 'react';

const Skeleton = ({ className = '', ...props }) => (
  <div 
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

export const PostCardSkeleton = ({ count = 3 }) => {
  return Array(count).fill(0).map((_, index) => (
    <div key={index} className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white">
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
        <div className="mt-6">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  ));
};

export default Skeleton;
