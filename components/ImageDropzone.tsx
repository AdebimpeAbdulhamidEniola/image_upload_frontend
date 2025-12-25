"use client";
import { UploadedFile } from "@/types";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

// Custom hook - only LOGIC, no UI
export const useImageDropzone = () => {
  // Holds uploaded images
  const [uploadedFile, setUploadedFile] = useState<UploadedFile[]>([]);

  // File drop handler - runs when user drops files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedFile((prev) => [...prev, ...newFiles]);
  }, []);

  // Configure the dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  // Remove a file from the list
  const removeFile = (index: number) => {
    setUploadedFile((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Return all the logic needed
  return {
    uploadedFile,
    setUploadedFile,
    getRootProps,
    getInputProps,
    isDragActive,
    removeFile,
  };
};
