/*eslint-disable*/
import React from 'react';

const SkeletonCard = () => (
  <div className="shop-product animate-pulse group relative">
    <div className="overflow-hidden bg-gray-300 h-60 w-full rounded-md relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
    </div>
    <div className="mt-3 h-4 bg-gray-300 rounded w-3/4 mx-auto" />
    <div className="mt-2 h-4 bg-gray-300 rounded w-5/6 mx-auto" />
    <div className="mt-3 flex items-center justify-center gap-10">
      <div className="h-4 w-16 bg-gray-300 rounded" />
      <div className="h-4 w-16 bg-gray-300 rounded" />
    </div>
  </div>
);

function Skeleton() {
  return (
    <div className="min-h-screen px-4">
      <div className="grid grid-cols-1 gap-6 mt-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
