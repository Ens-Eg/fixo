"use server";

import { revalidatePath } from "next/cache";
import { serverRequestWithApiKey } from "@/lib/server-request";

export interface Ad {
  id: number;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  imageUrl: string | null;
  linkUrl: string | null;
  position: string;
  displayOrder: number;
  isActive: boolean;
  adType: "global" | "menu";
  menuId: number | null;
  impressionCount: number;
  clickCount: number;
  createdAt: string;
}

export interface AdFormData {
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
}

/**
 * Get ads for a menu
 * @param menuId - Menu ID
 * @param isFreePlan - Whether the user is on free plan (shows global ads) or pro plan (shows menu-specific ads)
 */
export async function getAds(
  menuId: string | number,
  isFreePlan: boolean = false
): Promise<{ success: boolean; error?: string; data?: { ads: Ad[] } }> {
  try {
    let data;
    
    if (isFreePlan) {
      // Free users: show only global ads
      data = await serverRequestWithApiKey<any>(
        "/public/ads?position=banner&limit=20"
      );
    } else {
      // Pro users: show only menu-specific ads
      data = await serverRequestWithApiKey<any>(`/menus/${menuId}/ads`);
    }

    // Handle different response formats
    const ads = data?.data?.ads || data?.ads || [];
    
    return { success: true, data: { ads } };
  } catch (error: any) {
    console.error("Error fetching ads:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch ads",
      data: { ads: [] },
    };
  }
}

/**
 * Create a new ad for a menu
 * @param menuId - Menu ID
 * @param adData - Ad data
 */
export async function createAd(
  menuId: string | number,
  adData: AdFormData
): Promise<{ success: boolean; error?: string; data?: Ad }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}/ads`, {
      method: "POST",
      body: JSON.stringify(adData),
    });

    // Revalidate the ads page
    revalidatePath(`/dashboard/menus/${menuId}/ads`);

    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating ad:", error);
    return {
      success: false,
      error: error.message || "Failed to create ad",
    };
  }
}

/**
 * Update an existing ad
 * @param adId - Ad ID
 * @param adData - Updated ad data
 * @param menuId - Menu ID (for revalidation)
 */
export async function updateAd(
  adId: number,
  adData: AdFormData,
  menuId: string | number
): Promise<{ success: boolean; error?: string; data?: Ad }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/ads/${adId}`, {
      method: "PUT",
      body: JSON.stringify(adData),
    });

    // Revalidate the ads page
    revalidatePath(`/dashboard/menus/${menuId}/ads`);

    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating ad:", error);
    return {
      success: false,
      error: error.message || "Failed to update ad",
    };
  }
}

/**
 * Delete an ad
 * @param adId - Ad ID
 * @param menuId - Menu ID (for revalidation)
 */
export async function deleteAd(
  adId: number,
  menuId: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    await serverRequestWithApiKey<any>(`/ads/${adId}`, {
      method: "DELETE",
    });

    // Revalidate the ads page
    revalidatePath(`/dashboard/menus/${menuId}/ads`);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting ad:", error);
    return {
      success: false,
      error: error.message || "Failed to delete ad",
    };
  }
}

/**
 * Toggle ad active status
 * @param adId - Ad ID
 * @param isActive - New active status
 * @param menuId - Menu ID (for revalidation)
 */
export async function toggleAdStatus(
  adId: number,
  isActive: boolean,
  menuId: string | number
): Promise<{ success: boolean; error?: string; data?: Ad }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/ads/${adId}`, {
      method: "PUT",
      body: JSON.stringify({ isActive }),
    });

    // Revalidate the ads page
    revalidatePath(`/dashboard/menus/${menuId}/ads`);

    return { success: true, data };
  } catch (error: any) {
    console.error("Error toggling ad status:", error);
    return {
      success: false,
      error: error.message || "Failed to toggle ad status",
    };
  }
}
