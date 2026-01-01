import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Type definitions for error responses
interface ErrorResponseData {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

// Extended Error type with additional properties
interface ApiError extends Error {
  status?: number;
  response?: AxiosResponse<ErrorResponseData>;
  isNetworkError?: boolean;
}

// Create axios instance with standard configuration
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_LINK || "",
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true if your backend requires cookies
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Don't set Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        data: config.data instanceof FormData ? "FormData" : config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] Response:`, {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError<ErrorResponseData>) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const responseData = error.response.data;
      const message = 
        responseData?.message || 
        responseData?.error ||
        error.message || 
        "An error occurred";

      console.error(`[API] Error ${status}:`, {
        url: error.config?.url,
        message,
        data: error.response.data,
      });

      // Create a standardized error object
      const apiError: ApiError = new Error(message);
      apiError.status = status;
      apiError.response = error.response;
      return Promise.reject(apiError);
    } else if (error.request) {
      // Request was made but no response received
      console.error("[API] No response received:", error.request);
      const networkError: ApiError = new Error(
        "Network error. Please check your connection and try again."
      );
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    } else {
      // Something else happened
      console.error("[API] Error setting up request:", error.message);
      return Promise.reject(error);
    }
  }
);

// Export types for use in other files
export type { AxiosError, AxiosRequestConfig, AxiosResponse };
export type { ApiError, ErrorResponseData };
