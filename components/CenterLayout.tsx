"use client";

import Image from "next/image";
import Link from "next/link";
import { useImageDropzone } from "./ImageDropzone";

const CenterLayout = () => {
  // Get all logic from ImageDropzone hook
  const {
    uploadedFile,
    getRootProps,
    getInputProps,
    isDragActive,
    removeFile,
  } = useImageDropzone();

  return (
    <div className="flex items-center justify-center py-12">
      {/* Main dropzone container */}
      <div
        {...getRootProps()}
        className={`w-full max-w-2xl h-100 rounded-lg border-2 border-dashed shadow-lg p-8 flex items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-white hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />

        <div className="inner-content flex flex-col items-center gap-4">
          <Image src="/exit.svg" alt="exit_icon" width={32} height={32} />
          <div className="text-center">
            <div className="font-semibold text-gray-700">
              {isDragActive
                ? "Drop your images here!"
                : "Drag & drop a file or click to browse "}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              JPG, PNG or GIF - Max file size 5MB
            </div>
          </div>
        </div>
      </div>

      {/* Preview grid - only show if files uploaded */}
      {uploadedFile.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Uploaded Images ({uploadedFile.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {uploadedFile.map((item, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden bg-gray-200"
              >
                <Image
                  src={item.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                <p className="text-xs text-gray-600 p-2 truncate">
                  {item.file.name}
                </p>
              </div>
            ))}
          </div>

          {/* Upload button */}
          <button
            onClick={() => {
              console.log("Ready to upload:", uploadedFile.map((f) => f.file));
              // TODO: Add server upload logic here
            }}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Upload Files
          </button>
        </div>
      )}
    </div>
  );
};

export default CenterLayout;
