"use client";

import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      {/* Modern backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 pointer-events-none transition-opacity duration-300"
        style={{ borderRadius: 'inherit' }}
      />
      
      {/* Loading content */}
      <div className="relative z-20 flex flex-col items-center gap-4">
        {/* Modern spinner with gradient */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 rounded-full animate-spin border-t-blue-500 dark:border-t-blue-400" />
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse opacity-75" />
          </div>
          
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 animate-pulse">
            Uploading...
          </p>
          
          {/* Progress dots */}
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) rotate(45deg);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator;
