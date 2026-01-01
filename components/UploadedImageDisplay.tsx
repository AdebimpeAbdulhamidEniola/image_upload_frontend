// components/UploadedImageDisplay.tsx
"use client";

import Image from "next/image";

const UploadedImageDisplay = ({ imageUrl }: { imageUrl: string }) => {
  if (!imageUrl || imageUrl.trim() === "") {
    console.error("Invalid imageUrl prop:", imageUrl);
    return null;
  }

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
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt="Uploaded image"
          className="object-cover"
          fill
        />
      </div>
    </div>
  );
};

export default UploadedImageDisplay;