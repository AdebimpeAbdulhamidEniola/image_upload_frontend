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