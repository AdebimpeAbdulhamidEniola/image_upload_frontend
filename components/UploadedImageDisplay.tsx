// components/UploadedImageDisplay.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

const UploadedImageDisplay = ({ imageUrl }: { imageUrl: string }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!imageUrl || imageUrl.trim() === "") {
    console.error("Invalid imageUrl prop:", imageUrl);
    return null;
  }

  // Handle image load error
  const handleImageError = () => {
    console.error("Failed to load image from URL:", imageUrl);
    setImageError(true);
    setIsLoading(false);
  };

  // Handle successful image load
  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  return (
    <div
      className={`
    w-[95%] max-w-[500px] 
    sm:w-[85%] sm:max-w-[600px] 
    md:w-[700px] lg:w-[800px] xl:w-[900px]
    h-[350px] 
    sm:h-[400px] 
    md:h-[500px] 
    lg:h-[550px]
    bg-white dark:bg-gray-800 rounded-2xl shadow-xl 
    px-8 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24 lg:px-20 lg:py-28
    flex items-center justify-center`}
    >
      {imageError ? (
        // Fallback UI when image fails to load
        <div className="flex flex-col items-center justify-center text-center p-8">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
            Failed to load image
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm break-all">
            {imageUrl}
          </p>
          <button
            onClick={() => {
              setImageError(false);
              setIsLoading(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
          <Image
            src={imageUrl}
            alt="Uploaded image"
            className="object-cover"
            fill
            onError={handleImageError}
            onLoad={handleImageLoad}
            unoptimized={imageUrl.startsWith("http://") || !imageUrl.includes("cloudinary")}
            // Add priority if it's above the fold
            priority={false}
            // Handle external images that might not be optimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
          />
        </div>
      )}
    </div>
  );
};

export default UploadedImageDisplay;