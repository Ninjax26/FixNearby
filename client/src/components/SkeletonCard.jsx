import React from "react";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow p-4 space-y-3">
      <div className="bg-gray-200 rounded-full h-16 w-16 mx-auto" />
      <div className="bg-gray-200 rounded h-4 w-3/4 mx-auto" />
      <div className="bg-gray-200 rounded h-3 w-1/2 mx-auto" />
      <div className="bg-gray-200 rounded h-3 w-2/3 mx-auto" />
      <div className="bg-gray-100 rounded-lg h-8 w-full" />
    </div>
  );
};

export default SkeletonCard;
