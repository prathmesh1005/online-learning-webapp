import React from 'react';

const ChapterContentSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      
      {/* Video Placeholder */}
      <div className="aspect-video bg-gray-200 rounded-lg"></div>
      
      {/* Description Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      {/* Action Buttons Skeleton */}
      <div className="flex space-x-4 pt-4">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
};

export default ChapterContentSkeleton;
