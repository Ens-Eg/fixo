"use server";


import { revalidatePath } from "next/cache";

import { serverRequestWithApiKey } from "@/lib/server-request";



// Check slug availability
export async function checkSlugAvailability(slug: string): Promise<{ isAvailable: boolean; suggestions?: string[] }> {
  try {
    const result = await serverRequestWithApiKey<{ isAvailable: boolean; suggestions?: string[] }>(
      `/menus/check-slug?slug=${encodeURIComponent(slug)}`
    );
    
    // Handle different response formats
    if (typeof result === 'object' && 'isAvailable' in result) {
      return result;
    }
    if (typeof result === 'object' && 'available' in result) {
      return {
        isAvailable: (result as any).available,
        suggestions: (result as any).suggestions || [],
      };
    }
    
    return { isAvailable: false };
  } catch (error) {
    console.error("Error checking slug:", error);
    return { isAvailable: false };
  }
}

// Get user subscription
export async function getUserSubscription(): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>("/user/subscription");
    
    // Handle different response formats
    if (data && typeof data === 'object' && 'subscription' in data) {
      return data;
    }
    if (data && typeof data === 'object' && 'data' in data) {
      return { subscription: data.data };
    }
    
    return { subscription: data };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return { subscription: null };
  }
}

// Toggle menu status
export async function toggleMenuStatus(menuId: number, isActive: boolean): Promise<{ isActive: boolean }> {
  try {
    const result = await serverRequestWithApiKey<{ isActive: boolean }>(
      `/menus/${menuId}/status`,
      { 
        method: "PATCH",
        body: JSON.stringify({ isActive })
      }
    );
    
    // Revalidate the menus page
    revalidatePath("/menus");
    revalidatePath(`/dashboard/menus/${menuId}`);
    
    return result;
  } catch (error) {
    console.error("Error toggling menu status:", error);
    throw error;
  }
}

// Delete menu
export async function deleteMenu(menuId: number): Promise<{ message: string }> {
  try {
    const result = await serverRequestWithApiKey<{ message: string }>(
      `/menus/${menuId}`,
      { method: "DELETE" }
    );
    
    // Revalidate the menus page
    revalidatePath("/menus");
    revalidatePath(`/dashboard/menus/${menuId}`);
    
    return result;
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
}

// Create menu
export async function createMenu(data: {
  nameEn?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  slug: string;
  logo?: string;
  templateType?: string;
}): Promise<any> {
  try {
    const result = await serverRequestWithApiKey<any>("/menus", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    // Revalidate the menus page
    revalidatePath("/menus");
    
    // Handle different response formats
    if (result && typeof result === 'object' && 'menu' in result) {
      return result.menu;
    }
    if (result && typeof result === 'object' && 'data' in result) {
      return result.data;
    }
    
    return result;
  } catch (error) {
    console.error("Error creating menu:", error);
    throw error;
  }
}
