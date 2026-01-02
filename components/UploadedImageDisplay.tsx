"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import ShareDialog from "./ShareDialog";
import {
  extractPublicIdFromCloudinaryUrl,
  generateShareUrl,
  downloadImage,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

const UploadedImageDisplay = ({ imageUrl }: { imageUrl: string }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const shareUrl = useMemo(() => {
    const publicId = extractPublicIdFromCloudinaryUrl(imageUrl);
    return publicId ? generateShareUrl(publicId) : imageUrl;
  }, [imageUrl]);

  if (!imageUrl || imageUrl.trim() === "") {
    console.error("Invalid imageUrl prop:", imageUrl);
    return null;
  }

  const handleImageError = () => {
    console.error("Failed to load image from URL:", imageUrl);
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      const publicId = extractPublicIdFromCloudinaryUrl(imageUrl);
      const filename = publicId
        ? `${publicId.split("/").pop() || "image"}.jpg`
        : `image-${Date.now()}.jpg`;

      await downloadImage(imageUrl, filename);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Failed to download image. Please try again."
      );

      setTimeout(() => setDownloadError(null), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="
        w-[95%] max-w-[500px]
        sm:w-[85%] sm:max-w-[600px]
        md:w-[700px] lg:w-[800px] xl:w-[900px]
        h-[350px] sm:h-[400px] md:h-[500px] lg:h-[550px]
        bg-white dark:bg-gray-800
        rounded-2xl shadow-xl
        relative
      "
    >
      {imageError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
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
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        /* ✅ Padding wrapper (THIS fixes uneven padding) */
        <div className="absolute inset-0 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
              </div>
            )}

            <Image
              src={imageUrl}
              alt="Uploaded image"
              fill
              className="object-contain"
              onError={handleImageError}
              onLoad={handleImageLoad}
              unoptimized={
                imageUrl.startsWith("http://") ||
                !imageUrl.includes("cloudinary")
              }
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute bottom-4 right-4 sm:right-6 md:right-8 z-10 flex gap-3">
        <Button
          onClick={handleDownload}
          disabled={isDownloading || imageError}
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-md rounded-lg"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Downloading…
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download
            </>
          )}
        </Button>

        <ShareDialog pageUrl={shareUrl} />
      </div>

      {downloadError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg text-sm shadow-lg">
          {downloadError}
        </div>
      )}
    </div>
  );
};

export default UploadedImageDisplay;
