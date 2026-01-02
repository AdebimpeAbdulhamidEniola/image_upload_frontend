import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the public ID from a Cloudinary image URL
 * @param imageUrl - The Cloudinary image URL
 * @returns The public ID extracted from the URL, or null if extraction fails
 * 
 * @example
 * extractPublicIdFromCloudinaryUrl("https://res.cloudinary.com/dfwdcjnyf/image/upload/v1767347869/image_uploader/file_aheis7.png")
 * // Returns: "image_uploader/file_aheis7"
 */
export function extractPublicIdFromCloudinaryUrl(imageUrl: string): string | null {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{public_id}.{format}
    const url = new URL(imageUrl);
    
    // Check if it's a Cloudinary URL
    if (!url.hostname.includes('cloudinary.com')) {
      return null;
    }
    
    // Extract path segments
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // Find the index of 'upload' in the path
    const uploadIndex = pathSegments.indexOf('upload');
    if (uploadIndex === -1) {
      return null;
    }
    
    // Get everything after 'upload' (version + folder + filename)
    const afterUpload = pathSegments.slice(uploadIndex + 1);
    
    if (afterUpload.length < 2) {
      return null;
    }
    
    // Remove the version (e.g., v1767347869) - first segment after upload
    const withoutVersion = afterUpload.slice(1);
    
    // The last segment is the filename with extension
    const filename = withoutVersion[withoutVersion.length - 1];
    if (!filename) {
      return null;
    }
    
    // Remove file extension to get the last part of public_id
    const filenamePart = filename.replace(/\.[^/.]+$/, '');
    
    // If there are multiple segments before the filename, include them as folder path
    if (withoutVersion.length > 1) {
      const folderPath = withoutVersion.slice(0, -1).join('/');
      return `${folderPath}/${filenamePart}`;
    }
    
    return filenamePart;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
}

/**
 * Generates a shareable URL for an image
 * @param publicId - The public ID of the image
 * @returns The full shareable URL
 */
export function generateShareUrl(publicId: string): string {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return `${baseUrl}/share/${encodeURIComponent(publicId)}`;
  }
  
  // Client-side: use current origin
  return `${window.location.origin}/share/${encodeURIComponent(publicId)}`;
}

/**
 * Downloads an image from a URL
 * @param imageUrl - The URL of the image to download
 * @param filename - Optional custom filename (defaults to extracted filename from URL)
 * @returns Promise that resolves when download starts
 */
export async function downloadImage(
  imageUrl: string,
  filename?: string
): Promise<void> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Convert to blob
    const blob = await response.blob();
    
    // Create object URL
    const blobUrl = URL.createObjectURL(blob);
    
    // Extract filename from URL if not provided
    let downloadFilename = filename;
    if (!downloadFilename) {
      try {
        const url = new URL(imageUrl);
        const pathname = url.pathname;
        const urlFilename = pathname.split('/').pop() || 'image';
        
        // Remove query parameters if any
        downloadFilename = urlFilename.split('?')[0];
        
        // If no extension, try to get it from blob type
        if (!downloadFilename.includes('.')) {
          const extension = blob.type.split('/')[1] || 'jpg';
          downloadFilename = `image.${extension}`;
        }
      } catch {
        // Fallback filename
        downloadFilename = `image-${Date.now()}.jpg`;
      }
    }
    
    // Create temporary anchor element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadFilename;
    link.style.display = 'none';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}
