// components/UploadArea.tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { createImage } from "@/lib/backendApi";
import UploadBox from "./UploadBox";

const UploadArea = () => {
  const { mutate } = useMutation({
    mutationFn: (payload: FormData) => createImage(payload),
    onSuccess: (data) => {
      console.log("Upload successful:", data);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
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
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("image", file);

      mutate(formData);
    },
    multiple: false,
  });

  return (
    <UploadBox
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isDragActive={isDragActive}
    />
  );
};

export default UploadArea;