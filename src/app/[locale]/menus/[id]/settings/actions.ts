"use server";

/**
 * Server Actions for Menu Settings Operations
 * هذه الـ Actions تعمل على السيرفر فقط ولا تظهر في Network tab
 */

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getApiKeyHeaders } from "@/lib/api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000/api";

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value || null;
}

async function serverRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();
  
  // Get API key headers
  const apiKeyHeaders = await getApiKeyHeaders();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...apiKeyHeaders,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") 
    ? endpoint 
    : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  
  // Handle different response formats
  if (data && typeof data === 'object' && 'data' in data && data.data !== undefined) {
    return data.data as T;
  }
  
  return data as T;
}

// Get menu settings
export async function getMenuSettings(menuId: string | number, locale: string = "ar"): Promise<any> {
  try {
    const data = await serverRequest<any>(`/menus/${menuId}?locale=${locale}`);
    
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
  updates: {
    nameEn?: string;
    nameAr?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    theme?: string;
    isActive?: boolean;
  }
): Promise<any> {
  try {
    const data = await serverRequest<any>(`/menus/${menuId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    
    // Revalidate relevant paths
    revalidatePath(`/menus/${menuId}`);
    revalidatePath(`/menus/${menuId}/settings`);
    revalidatePath("/menus");
    
    return data;
  } catch (error) {
    console.error("Error updating menu settings:", error);
    throw error;
  }
}

// Delete menu
export async function deleteMenu(menuId: string | number): Promise<{ message: string }> {
  try {
    const data = await serverRequest<{ message: string }>(`/menus/${menuId}`, {
      method: "DELETE",
    });
    
    // Revalidate relevant paths
    revalidatePath("/menus");
    
    return data;
  } catch (error) {
    console.error("Error deleting menu:", error);
    throw error;
  }
}
