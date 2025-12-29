// components/UploadBox.tsx
"use client";

import { UploadBoxProps } from "@/types";
import Image from "next/image";


const UploadBox = ({ getRootProps, getInputProps, isDragActive }: UploadBoxProps) => {
  return (
    <div
      {...getRootProps()}
      className={`
        w-[95%] sm:w-[85%] md:w-[700px] lg:w-[800px]
        min-h-[400px] sm:min-h-[450px] md:min-h-[500px]
        bg-white rounded-2xl shadow-xl
        px-8 py-16 sm:px-12 sm:py-20 md:px-16 md:py-24
        cursor-pointer
        transition-all duration-200
        flex flex-col items-center justify-center
        ${
          isDragActive
            ? "border-2 border-dashed border-blue-500 bg-blue-50"
            : ""
        }
        hover:bg-gray-50
      `}
    >
      <input {...getInputProps()} />

      <Image src="/exit.svg" alt="exit-icon" width={32} height={32} />

      <div className="flex flex-col items-center justify-center text-center space-y-3">
        {isDragActive ? (
          <div>Drop in the box</div>
        ) : (
          <div>
            <p className="text-base sm:text-lg md:text-xl text-gray-800">
              Drag & drop a file or{" "}
              <span className="text-blue-500 font-medium hover:underline">
                browse files
              </span>
            </p>

            <p className="text-sm sm:text-base text-gray-500">
              JPG, PNG or GIF - Max file size 2MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadBox;