"use server";

/**
 * Server Actions for Admin Operations
 */

import { serverRequestWithApiKey } from "@/lib/server-request";
import { revalidatePath } from "next/cache";





// ============================================================
// Admin Stats
// ============================================================

export async function getAdminStats(): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>("/admin/stats");
    return { stats: data.stats || data };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { stats: null };
  }
}

// ============================================================
// Users Management
// ============================================================

export async function getAdminUsers(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<any> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const data = await serverRequestWithApiKey<any>(`/admin/users?${params.toString()}`);
    
    return {
      users: data.users || [],
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limit,
      },
      stats: data.stats || {
        totalUsers: 0,
        activeUsers: 0,
        suspendedUsers: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return {
      users: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limit,
      },
      stats: {
        totalUsers: 0,
        activeUsers: 0,
        suspendedUsers: 0,
      },
    };
  }
}

export async function getUserDetails(userId: number | string): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>(`/admin/users/${userId}`);
    return { 
      user: data.user || data,
      menus: data.menus || []
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return { user: null, menus: [] };
  }
}

export async function getSubscriptionPlans(): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>("/admin/plans/subscription");
    return { plans: data.plans || [] };
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return { plans: [] };
  }
}

// ============================================================
// Ads Management
// ============================================================

export async function getAdminAds(): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>("/admin/ads");
    return { ads: data.ads || [] };
  } catch (error) {
    console.error("Error fetching admin ads:", error);
    return { ads: [] };
  }
}

export async function createAdminAd(adData: any): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>("/admin/ads", {
      method: "POST",
      body: JSON.stringify(adData),
    });

    revalidatePath("/admin/ads");

    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating ad:", error);
    return {
      success: false,
      error: error.message || "Failed to create ad",
    };
  }
}

export async function updateAdminAd(adId: number, adData: any): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/admin/ads/${adId}`, {
      method: "PUT",
      body: JSON.stringify(adData),
    });

    revalidatePath("/admin/ads");

    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating ad:", error);
    return {
      success: false,
      error: error.message || "Failed to update ad",
    };
  }
}

export async function deleteAdminAd(adId: number): Promise<{ success: boolean; error?: string }> {
  try {
    await serverRequestWithApiKey<any>(`/admin/ads/${adId}`, {
      method: "DELETE",
    });

    revalidatePath("/admin/ads");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting ad:", error);
    return {
      success: false,
      error: error.message || "Failed to delete ad",
    };
  }
}

// ============================================================
// Plans Management
// ============================================================

export async function getAdminPlans(): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>("/admin/plans");
    return { plans: data.plans || [] };
  } catch (error) {
    console.error("Error fetching admin plans:", error);
    return { plans: [] };
  }
}

export async function updateAdminPlan(planId: number, planData: any): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/admin/plans/${planId}`, {
      method: "PUT",
      body: JSON.stringify(planData),
    });

    revalidatePath("/admin/plans");

    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating plan:", error);
    return {
      success: false,
      error: error.message || "Failed to update plan",
    };
  }
}

// ============================================================
// Admins Management
// ============================================================

export async function getAdminList(
  page: number = 1,
  limit: number = 10
): Promise<any> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const data = await serverRequestWithApiKey<any>(`/admin/admins?${params.toString()}`);
    
    return {
      admins: data.admins || [],
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    console.error("Error fetching admins:", error);
    return {
      admins: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limit,
      },
    };
  }
}

export async function createAdmin(adminData: { email: string; password: string; name: string }): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>("/admin/admins", {
      method: "POST",
      body: JSON.stringify(adminData),
    });

    revalidatePath("/admin/admins");

    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return {
      success: false,
      error: error.message || "Failed to create admin",
    };
  }
}
