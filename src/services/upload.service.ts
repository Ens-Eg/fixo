/**
 * Upload Service
 * API functions for file upload operations
 */

import { tokenCookies } from "@/lib/cookies";
import { getClientApiKeyHeaders } from "@/lib/api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface UploadResponse {
  success: boolean;
  filename: string;
  url: string;
  path: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Upload image file
 * @param file - File to upload
 * @param type - Image type (logos, menu-items, ads, profile-images)
 * @returns Upload response with image URL
 */
export async function uploadImage(
  file: File,
  type: "logos" | "menu-items" | "ads" | "profile-images" = "menu-items"
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  // Get token from cookies (preferred) or localStorage (fallback)
  const token = tokenCookies.getAccessToken() || 
                (typeof window !== "undefined" ? localStorage.getItem("accessToken") || localStorage.getItem("auth_token") : null);
  
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }
  
  console.log("Uploading file:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadType: type,
    apiUrl: `${API_BASE_URL}/upload`,
  });
  
  // Get API key headers
  const apiKeyHeaders = await getClientApiKeyHeaders();
  
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...apiKeyHeaders,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to upload image";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      console.error("Upload error response:", errorData);
    } catch (e) {
      // If response is not JSON, try to get text
      try {
        const text = await response.text();
        if (text) errorMessage = text;
        console.error("Upload error text:", text);
      } catch (e2) {
        console.error("Failed to parse error response:", e2);
        // Use default error message
      }
    }
    console.error("Upload failed:", {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
    });
    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.error = errorMessage;
    throw error;
  }

  const data = await response.json();
  
  // Handle different response formats
  if (data.error) {
    throw new Error(data.error);
  }
  
  // Map backend response to expected format
  return {
    success: true,
    filename: data.filename || "",
    url: data.url || "",
    path: data.path || data.url || "",
    size: data.size || 0,
    dimensions: data.dimensions,
  };
}

/**
 * Delete image file
 * @param filename - Image filename to delete
 * @param type - Image type (logos, menu-items, ads)
 */
export async function deleteImage(
  filename: string,
  type?: "logos" | "menu-items" | "ads"
): Promise<{ success: boolean; message: string }> {
  const token = tokenCookies.getAccessToken() || 
                (typeof window !== "undefined" ? localStorage.getItem("accessToken") || localStorage.getItem("auth_token") : null);
  
  const url = new URL(`${API_BASE_URL}/upload/${filename}`);
  if (type) {
    url.searchParams.append("type", type);
  }

  // Get API key headers
  const apiKeyHeaders = await getClientApiKeyHeaders();

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...apiKeyHeaders,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete image");
  }

  return response.json();
}

/**
 * Get image info
 * @param filename - Image filename
 * @param type - Image type (logos, menu-items, ads)
 */
export async function getImageInfo(
  filename: string,
  type?: "logos" | "menu-items" | "ads"
): Promise<{
  success: boolean;
  filename: string;
  size: number;
  dimensions?: { width: number; height: number };
  createdAt: string;
}> {
  const token = tokenCookies.getAccessToken() || 
                (typeof window !== "undefined" ? localStorage.getItem("accessToken") || localStorage.getItem("auth_token") : null);
  
  const url = new URL(`${API_BASE_URL}/upload/${filename}/info`);
  if (type) {
    url.searchParams.append("type", type);
  }

  // Get API key headers
  const apiKeyHeaders = await getClientApiKeyHeaders();

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...apiKeyHeaders,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to get image info");
  }

  return response.json();
}
