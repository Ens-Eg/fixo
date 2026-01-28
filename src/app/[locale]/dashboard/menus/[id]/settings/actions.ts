"use server";



import { revalidatePath } from "next/cache";

import { serverRequestWithApiKey } from "@/lib/server-request";



// Get menu settings
export async function getMenuSettings(menuId: string | number, locale: string = "ar"): Promise<any> {
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
    console.error("Error fetching menu settings:", error);
    throw error;
  }
}

// Update menu settings
export async function updateMenuSettings(
  menuId: string | number,
  updates: any
): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    
    // Revalidate relevant paths
    revalidatePath(`/dashboard/menus/${menuId}`);
    revalidatePath(`/dashboard/menus/${menuId}/settings`);
    revalidatePath("/dashboard/menus");
    revalidatePath(`/menus/${menuId}`);
    
    return data;
  } catch (error) {
    console.error("Error updating menu settings:", error);
    throw error;
  }
}

// Delete menu
export async function deleteMenu(menuId: string | number): Promise<{ message: string }> {
  try {
    const data = await serverRequestWithApiKey<{ message: string }>(`/menus/${menuId}`, {
      method: "DELETE",
    });
    
    // Revalidate relevant paths
    revalidatePath("/dashboard/menus");
    revalidatePath("/menus");
    
    return data;
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
}
