"use server";

import { serverRequestWithApiKey } from "@/lib/server-request";

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
 * Upload image file (Server Action)
 * @param formData - FormData containing file and type
 * @returns Upload response with image URL
 */
export async function uploadImage(
  formData: FormData
): Promise<{ success: boolean; error?: string; data?: UploadResponse }> {
  try {
    const data = await serverRequestWithApiKey<UploadResponse>("/upload", {
      method: "POST",
      body: formData,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image",
    };
  }
}

/**
 * Delete image file (Server Action)
 * @param filename - Image filename to delete
 * @param type - Image type (logos, menu-items, ads, profile-images, categories)
 */
export async function deleteImage(
  filename: string,
  type?: "logos" | "menu-items" | "ads" | "profile-images" | "categories"
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    let endpoint = `/upload/${filename}`;
    if (type) {
      endpoint += `?type=${type}`;
    }

    const data = await serverRequestWithApiKey<{ success: boolean; message: string }>(
      endpoint,
      {
        method: "DELETE",
      }
    );

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error.message || "Failed to delete image",
    };
  }
}

/**
 * Get image info (Server Action)
 * @param filename - Image filename
 * @param type - Image type (logos, menu-items, ads, profile-images, categories)
 */
export async function getImageInfo(
  filename: string,
  type?: "logos" | "menu-items" | "ads" | "profile-images" | "categories"
): Promise<{
  success: boolean;
  error?: string;
  data?: {
    filename: string;
    size: number;
    dimensions?: { width: number; height: number };
    createdAt: string;
  };
}> {
  try {
    let endpoint = `/upload/${filename}/info`;
    if (type) {
      endpoint += `?type=${type}`;
    }

    const data = await serverRequestWithApiKey<{
      success: boolean;
      filename: string;
      size: number;
      dimensions?: { width: number; height: number };
      createdAt: string;
    }>(endpoint, {
      method: "GET",
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("Error getting image info:", error);
    return {
      success: false,
      error: error.message || "Failed to get image info",
    };
  }
}
