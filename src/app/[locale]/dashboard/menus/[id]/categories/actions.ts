"use server";


import { revalidatePath } from "next/cache";
import { serverRequestWithApiKey } from "@/lib/server-request";





// Get categories
export async function getCategories(menuId: number): Promise<any[]> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}/categories`);
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && 'categories' in data) {
      return Array.isArray(data.categories) ? data.categories : [];
    }
    if (data && typeof data === 'object' && 'data' in data) {
      const items = data.data;
      if (Array.isArray(items?.categories)) {
        return items.categories;
      }
      return Array.isArray(items) ? items : [];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Get single category
export async function getCategory(menuId: number, categoryId: number): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}/categories/${categoryId}`);
    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

// Create category
export async function createCategory(
  menuId: number, 
  categoryData: any
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}/categories`, {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    
    // Revalidate the categories page
    revalidatePath(`/dashboard/menus/${menuId}/categories`);
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating category:", error);
    return { success: false, error: error.message || "Failed to create category" };
  }
}

// Update category
export async function updateCategory(
  menuId: number, 
  categoryId: number, 
  categoryData: any
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/menus/${menuId}/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
    
    // Revalidate the categories page
    revalidatePath(`/dashboard/menus/${menuId}/categories`);
    
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating category:", error);
    return { success: false, error: error.message || "Failed to update category" };
  }
}

// Delete category
export async function deleteCategory(
  menuId: number, 
  categoryId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await serverRequestWithApiKey<any>(`/menus/${menuId}/categories/${categoryId}`, {
      method: "DELETE",
    });
    
    // Revalidate the categories page
    revalidatePath(`/dashboard/menus/${menuId}/categories`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return { success: false, error: error.message || "Failed to delete category" };
  }
}
