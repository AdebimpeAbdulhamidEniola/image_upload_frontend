// components/UploadArea.tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { createImage } from "@/lib/backendApi";
import UploadBox from "./UploadBox";
import { useState } from "react";
import UploadedImageDisplay from "./UploadedImageDisplay";
import { APIResponse, ImageUploadData } from "@/types";
import LoadingIndicator from "./LoadingIndicator";
import type { ApiError } from "@/lib/api";

const UploadArea = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: (payload: FormData) => {
      setIsLoading(true);
      setError(null);
      console.log("[MUTATION] createImage called with payload:", payload.get("image"));
      return createImage(payload);
    },
    onSuccess: (response: APIResponse<ImageUploadData>) => {
      setIsLoading(false);
      console.log("Upload successful:", response);
      setUploadedImageUrl(response.data.imageURL);
    },
    onError: (error: unknown) => {
      setIsLoading(false);
      setUploadedImageUrl(null);
      
      // Enhanced error handling
      let message = "Image upload failed";
      
      if (error instanceof Error) {
        const apiError = error as ApiError;
        message = apiError.message;
        
        // Check for network errors
        if (apiError.isNetworkError) {
          message = "Network error. Please check your connection and try again.";
        }
        
        // Check for specific status codes
        const status = apiError.status;
        if (status === 413) {
          message = "File too large. Maximum size is 2MB.";
        } else if (status === 415) {
          message = "Unsupported file type. Please use JPG, PNG, or GIF.";
        } else if (status === 400) {
          message = "Invalid file. Please try again.";
        } else if (status === 500) {
          message = "Server error. Please try again later.";
        } else if (status === 404) {
          message = "Upload endpoint not found. Please check configuration.";
        }
      } else if (error && typeof error === "object" && "message" in error) {
        message = (error as { message?: string }).message || message;
      }
      
      console.error("[UPLOAD] Error details:", error);
      setError(message);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
    },
    maxSize: 2 * 1024 * 1024,
    onDrop: (acceptedFiles: File[]) => {
      console.log("[DROPZONE] onDrop called", acceptedFiles);
      if (acceptedFiles.length === 0) {
        console.warn("[DROPZONE] No files accepted");
        return;
      }

      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("image", file);
      console.log("[DROPZONE] Calling mutate with formData", file);
      mutate(formData);
    },
    multiple: false,
    disabled: uploadedImageUrl !== null,
  });

  return (
    <div className="w-full flex flex-col items-center justify-center relative">
      {isLoading && <LoadingIndicator />}
      {error && (
        <div className="mb-4 w-full max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
      {uploadedImageUrl ? (
        <UploadedImageDisplay imageUrl={uploadedImageUrl} />
      ) : (
        <UploadBox
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />
      )}
    </div>
  );
};

export default UploadArea;