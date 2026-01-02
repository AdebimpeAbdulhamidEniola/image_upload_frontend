// components/UploadedImageDisplay.tsx
"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import ShareDialog from "./ShareDialog";
import { extractPublicIdFromCloudinaryUrl, generateShareUrl, downloadImage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

const UploadedImageDisplay = ({ imageUrl }: { imageUrl: string }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Generate share URL from image URL
  const shareUrl = useMemo(() => {
    const publicId = extractPublicIdFromCloudinaryUrl(imageUrl);
    if (publicId) {
      return generateShareUrl(publicId);
    }
    // Fallback: if we can't extract publicId, use the image URL directly
    // (This would be for non-Cloudinary URLs or if backend returns publicId separately)
    return imageUrl;
  }, [imageUrl]);

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

  // Handle download
  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    
    try {
      // Extract filename from URL or use default
      const publicId = extractPublicIdFromCloudinaryUrl(imageUrl);
      const filename = publicId 
        ? `${publicId.split('/').pop() || 'image'}.jpg`
        : `image-${Date.now()}.jpg`;
      
      await downloadImage(imageUrl, filename);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadError(
        error instanceof Error 
          ? error.message 
          : "Failed to download image. Please try again."
      );
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setDownloadError(null);
      }, 3000);
    } finally {
      setIsDownloading(false);
    }
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
    flex flex-col items-center justify-center relative`}
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
      
      {/* Action Buttons - positioned in bottom right corner */}
      <div className="absolute bottom-4 right-6 sm:right-8 md:right-16 lg:right-20 z-10 flex gap-3 items-center">
        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={isDownloading || imageError}
          variant="default"
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-md rounded-lg px-4 py-2"
          aria-label="Download image"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 text-white" />
              Download
            </>
          )}
        </Button>
        
        {/* Share Button */}
        <ShareDialog pageUrl={shareUrl} />
      </div>
      
      {/* Download Error Message */}
      {downloadError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg text-sm shadow-lg">
          {downloadError}
        </div>
      )}
    </div>
  );
};

export default UploadedImageDisplay;