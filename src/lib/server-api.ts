

import { decryptDataApi, encryptData, encryptDataApi } from "@/components/shared/encryption";
import { cookies } from "next/headers";
import { getApiKeyHeaders } from "@/lib/api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000/api";

/**
 * Get access token from cookies (server-side)
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value || null;
    if (!token) {
      console.warn("No access token found in cookies");
    }
    return token;
  } catch (error) {
    console.error("Error reading cookies:", error);
    return null;
  }
}

/**
 * Core fetch function for Server Components
 */
async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();
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

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      // Important: Server Components should use cache options
      cache: options.cache || "no-store", // Default to no-store for fresh data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
      console.error(`Server API Error [${response.status}]:`, errorMessage, "URL:", url);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Handle different response formats
    // API may return { data: T } or T directly
    if (data && typeof data === 'object' && 'data' in data && data.data !== undefined) {
      return data.data as T;
    }

    return data as T;
  } catch (error: any) {
    console.error("Server API Error:", error.message || error, "URL:", url);
    throw error;
  }
}

// ============================================================
// Authentication APIs
// ============================================================

export async function getCurrentUser() {
  const data = await serverFetch<any>("/auth/me");

  // Handle different response formats
  if (data && typeof data === 'object' && 'user' in data) {
    return { user: data.user };
  }
  if (data && typeof data === 'object' && 'data' in data && data.data?.user) {
    return { user: data.data.user };
  }

  return { user: data };
}

// ============================================================
// Menu APIs
// ============================================================

export async function getMenus(locale: string = "ar") {
  try {
    const data = await serverFetch<any>(`/menus?locale=${locale}`);



    // Handle different response formats
    if (Array.isArray(data)) {

      return data;
    }

    // If data is an object with menus property
    if (data && typeof data === 'object' && 'menus' in data) {
      const menus = (data as any).menus;

      return Array.isArray(menus) ? menus : [];
    }

    // If data is an object with data property
    if (data && typeof data === 'object' && 'data' in data) {
      const menus = (data as any).data;

      // Check if data.data has menus property
      if (menus && typeof menus === 'object' && 'menus' in menus) {
        return Array.isArray(menus.menus) ? menus.menus : [];
      }
      return Array.isArray(menus) ? menus : [];
    }

    console.warn("getMenus: unknown data format, returning empty array");
    return [];
  } catch (error) {
    console.error("getMenus error:", error);
    return [];
  }
}

export async function getMenu(id: string | number, locale: string = "ar") {
  const data = await serverFetch<any>(`/menus/${id}?locale=${locale}`);

  // Handle different response formats
  if (data && typeof data === 'object') {
    // If data has menu property
    if ('menu' in data) {
      return {
        menu: data.menu,
        itemsCount: data.itemsCount || 0,
        activeItemsCount: data.activeItemsCount || 0,
        categoriesCount: data.categoriesCount || 0,
      };
    }
    // If data has data property with menu
    if ('data' in data && data.data?.menu) {
      return {
        menu: data.data.menu,
        itemsCount: data.data.itemsCount || data.itemsCount || 0,
        activeItemsCount: data.data.activeItemsCount || data.activeItemsCount || 0,
        categoriesCount: data.data.categoriesCount || data.categoriesCount || 0,
      };
    }
  }

  // Fallback: assume data is the menu object
  return {
    menu: data,
    itemsCount: 0,
    activeItemsCount: 0,
    categoriesCount: 0,
  };
}

export async function getPublicMenu(slug: string, locale: string = "ar") {
  return serverFetch<any>(`/public/menu/${slug}?locale=${locale}`);
}

// ============================================================
// Menu Items APIs
// ============================================================

export async function getMenuItems(
  menuId: number,
  locale: string = "ar",
  category?: string
) {
  const params = new URLSearchParams({ locale });
  if (category) params.append("category", category);

  return serverFetch<any[]>(`/menus/${menuId}/items?${params}`);
}



// ============================================================
// User APIs
// ============================================================

export async function getUserProfile() {
  return serverFetch<any>("/user/profile");
}

export async function getUserSubscription() {
  try {
    const data = await serverFetch<any>("/user/subscription");

    // Handle different response formats
    if (data && typeof data === 'object' && 'subscription' in data) {
      return data.subscription;
    }
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }

    return data;
  } catch (error) {
    console.error("getUserSubscription error:", error);
    return null;
  }
}

// ============================================================
// Activity APIs
// ============================================================

export async function getRecentActivity(menuId: number) {
  try {
    // Fetch products and categories in parallel (same logic as activity.service.ts)
    const [productsData, categoriesData] = await Promise.all([
      serverFetch<{ items: any[] }>(`/menus/${menuId}/items`).catch(() => ({ items: [] })),
      serverFetch<{ categories: any[] }>(`/menus/${menuId}/categories`).catch(() => ({ categories: [] })),
    ]);

    const activities: any[] = [];

    // Add recent products
    const recentProducts = (productsData.items || [])
      .slice(0, 3)
      .map((item: any) => ({
        id: item.id,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        type: "product" as const,
        createdAt: item.createdAt || new Date().toISOString(),
        imageUrl: item.imageUrl,
      }));
    activities.push(...recentProducts);

    // Add recent categories
    const recentCategories = (categoriesData.categories || [])
      .slice(0, 3)
      .map((cat: any) => ({
        id: cat.id,
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        type: "category" as const,
        createdAt: cat.createdAt || new Date().toISOString(),
        imageUrl: cat.imageUrl,
      }));
    activities.push(...recentCategories);

    // Sort by date and return top 5
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
}

// ============================================================
// Ads APIs
// ============================================================

export async function getMenuAds(menuId: number | string) {
  try {
    const data = await serverFetch<any>(`/menus/${menuId}/ads`);
    
    // Handle different response formats
    if (data && typeof data === 'object' && 'ads' in data) {
      return Array.isArray(data.ads) ? data.ads : [];
    }
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error: any) {
    console.error("getMenuAds error:", error);
    // If 404, return empty array
    if (error.message?.includes("404") || error.message?.includes("not found")) {
      return [];
    }
    throw error;
  }
}

export async function getPublicAds(position: string = "banner", limit: number = 20) {
  try {
    const data = await serverFetch<any>(`/public/ads?position=${position}&limit=${limit}`);
    
    // Handle different response formats
    if (data && typeof data === 'object' && 'ads' in data) {
      return Array.isArray(data.ads) ? data.ads : [];
    }
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (error) {
    console.error("getPublicAds error:", error);
    return [];
  }
}

// ============================================================
// Generic fetch function (for custom endpoints)
// ============================================================

export { serverFetch };
