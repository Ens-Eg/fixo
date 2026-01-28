"use server";

import { revalidatePath } from "next/cache";

import { serverRequestWithApiKey } from "@/lib/server-request";





// Get menu items
export async function getMenuItems(
  menuId: number,
  locale: string = "ar",
  category?: string
): Promise<any> {
  try {
    const params = new URLSearchParams({ locale });
    if (category) params.append("category", category);
    
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}/items?${params}`);
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return { items: data };
    }
    if (data && typeof data === 'object' && 'items' in data) {
      return data;
    }
    if (data && typeof data === 'object' && 'data' in data) {
      const items = data.data;
      if (Array.isArray(items?.items)) {
        return { items: items.items };
      }
      return { items: Array.isArray(items) ? items : [] };
    }
    
    return { items: [] };
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return { items: [] };
  }
}

// Get menu data (for currency, etc.)
export async function getMenuData(menuId: number, locale: string = "ar"): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}?locale=${locale}`);
    
    // Handle different response formats
    if (data && typeof data === 'object' && 'menu' in data) {
      return data;
    }
    if (data && typeof data === 'object' && 'data' in data && data.data?.menu) {
      return { menu: data.data.menu };
    }
    
    return { menu: data };
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return { menu: null };
  }
}

// Get single menu item
export async function getMenuItem(menuId: number, itemId: number): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}/items/${itemId}`);
    return data;
  } catch (error) {
    console.error("Error fetching menu item:", error);
    throw error;
  }
}

// Create menu item
export async function createMenuItem(menuId: number, itemData: any): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}/items`, {
      method: "POST",
      body: JSON.stringify(itemData),
    });
    
    // Revalidate the products page
    revalidatePath(`/dashboard/menus/${menuId}/products`);
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating menu item:", error);
    return { success: false, error: error.message || "Failed to create product" };
  }
}

// Update menu item
export async function updateMenuItem(
  menuId: number, 
  itemId: number, 
  itemData: any
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
    
    // Revalidate the products page
    revalidatePath(`/dashboard/menus/${menuId}/products`);
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating menu item:", error);
    return { success: false, error: error.message || "Failed to update product" };
  }
}

// Delete menu item
export async function deleteMenuItem(
  menuId: number, 
  itemId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await serverRequestWithApiKey<any>(`/menus/${menuId}/items/${itemId}`, {
      method: "DELETE",
    });
    
    // Revalidate the products page
    revalidatePath(`/dashboard/menus/${menuId}/products`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting menu item:", error);
    return { success: false, error: error.message || "Failed to delete product" };
  }
}
