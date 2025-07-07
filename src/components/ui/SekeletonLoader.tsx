// components/ui/SkeletonLoader.tsx

import React from "react";

interface SkeletonLoaderProps {
  count?: number; // Number of skeleton items
  className?: string; // Custom styles for different layouts
}

/**
 * SkeletonLoader Component
 * Displays animated placeholder blocks for content loading.
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 3,
  className = "",
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-300 rounded-lg h-6 w-full ${className}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
