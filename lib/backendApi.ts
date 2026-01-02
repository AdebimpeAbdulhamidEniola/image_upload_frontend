import { APIResponse } from "@/types";
import { api } from "./api";
import { ImageUploadData } from "@/types";

/**
 * Uploads an image to the backend
 * @param payload - FormData containing the image file
 * @returns Promise with API response containing image URL
 * @throws Error if upload fails
 */
export const createImage = async (
  payload: FormData
): Promise<APIResponse<ImageUploadData>> => {
  try {
    // Don't set Content-Type header - axios interceptor handles it
    // Browser will set it automatically with the correct boundary for FormData
    const response = await api.post<APIResponse<ImageUploadData>>(
      "/upload",
      payload
    );

    // Validate response structure
    if (!response.data || !response.data.data || !response.data.data.imageURL) {
      throw new Error("Invalid response format from server");
    }

    return response.data;
  } catch (error) {
    // Error is already processed by axios interceptor
    // Re-throw with additional context if needed
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred during image upload");
  }
};

/**
 * Retrieves an image from the backend by public ID
 * @param publicId - The public ID of the image to retrieve
 * @returns Promise with API response containing image URL
 * @throws Error if image retrieval fails
 */
export const getImage = async (
  publicId: string
): Promise<APIResponse<ImageUploadData>> => {
  try {
    // Validate publicId is provided
    if (!publicId || publicId.trim() === "") {
      throw new Error("Public ID is required");
    }

    // Encode the publicId to handle special characters in URL
    const encodedPublicId = encodeURIComponent(publicId);

    console.log("=== BACKEND API DEBUG (getImage) ===");
    console.log("1. Raw publicId received:", publicId);
    console.log("2. Encoded publicId:", encodedPublicId);
    console.log("3. Request URL:", `/download/${encodedPublicId}`);

    // Make GET request to download endpoint
    const response = await api.get<APIResponse<ImageUploadData>>(
      `/download/${encodedPublicId}`
    );

    console.log("4. Response status:", response.status);
    console.log("5. Response data:", response.data);

    // Validate response structure
    if (!response.data || !response.data.data || !response.data.data.imageURL) {
      throw new Error("Invalid response format from server");
    }

    return response.data;
  } catch (error) {
    // Error is already processed by axios interceptor
    // Re-throw with additional context if needed
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred during image retrieval");
  }
};