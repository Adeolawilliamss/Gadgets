/*eslint-disable*/
import React from 'react';
import './SkeletonItemDetails.css';

const SkeletonItemDetails = () => {
  return (
    <div className="container mx-auto px-4 mt-8 mb-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-5 md:gap-20 pb-8">
        {/* Image Skeleton */}
        <div className="w-full md:w-1/4 flex justify-center items-center">
          <div className="bg-gray-300 rounded-md h-96 w-80" />
        </div>

        {/* Text Skeletons */}
        <div className="w-full md:w-3/4 mt-8 md:mt-20 space-y-4">
          <div className="h-5 w-1/4 bg-gray-300 rounded" />
          <div className="h-8 w-3/4 bg-gray-300 rounded" />
          <div className="h-6 w-24 bg-gray-300 rounded" />
          <div className="h-4 w-full bg-gray-300 rounded" />
          <div className="flex gap-4 mt-4">
            <div className="h-12 w-60 bg-gray-300 rounded" />
            <div className="h-12 w-60 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 space-y-3">
        <div className="h-5 w-32 bg-gray-300 rounded" />
        <div className="h-20 w-full bg-gray-300 rounded" />
      </div>

      {/* Related Products */}
      <div className="mt-6">
        <div className="h-6 w-1/2 bg-gray-300 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-[500px] w-full bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonItemDetails;
