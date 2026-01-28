"use server";

import { serverRequestWithApiKey } from "@/lib/server-request";
import { revalidatePath } from "next/cache";


interface Menu {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  itemsCount?: number;
}

interface UserDetails {
  id: number;
  email: string;
  name: string;
  role: string;
  planType: string;
  isSuspended: boolean;
  phoneNumber?: string;
  country?: string;
  createdAt: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  menusCount?: number;
  planName?: string;
  subscriptionStatus?: string;
  startDate?: string;
  endDate?: string;
  billingCycle?: string;
}

interface Plan {
  id: number;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  maxMenus: number;
  maxProductsPerMenu: number;
}

/**
 * Get user details from server
 */
export async function getUserDetails(userId: string): Promise<{ user: UserDetails; menus: Menu[] }> {
  try {
    const data = await serverRequestWithApiKey<any>(`/admin/users/${userId}`);
    
    return {
      user: data.user || data,
      menus: data.menus || [],
    };
  } catch (error: any) {
    console.error("Error fetching user details:", error);
    throw new Error(error.message || "فشل تحميل بيانات المستخدم");
  }
}

/**
 * Get subscription plans from server
 */
export async function getSubscriptionPlans(): Promise<{ plans: Plan[] }> {
  try {
    const data = await serverRequestWithApiKey<any>("/admin/plans/subscription");
    
    return {
      plans: data.plans || data || [],
    };
  } catch (error: any) {
    console.error("Error fetching subscription plans:", error);
    throw new Error(error.message || "فشل تحميل الخطط");
  }
}

/**
 * Update user subscription
 */
export async function updateUserSubscription(
  userId: string,
  subscriptionData: {
    planId: number;
    billingCycle: string;
    startDate: string;
    endDate: string | null;
  }
): Promise<{ success: boolean; message?: string }> {
  try {
    await serverRequestWithApiKey<any>(`/admin/users/${userId}/subscription`, {
      method: "PUT",
      body: JSON.stringify(subscriptionData),
    });

    revalidatePath(`/admin/users/${userId}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    return {
      success: false,
      message: error.message || "حدث خطأ أثناء تحديث الاشتراك",
    };
  }
}

/**
 * Apply free plan limits to user
 */
export async function applyFreeLimits(userId: string): Promise<{
  success: boolean;
  changes?: { menusDeactivated: number; productsDeleted: number };
  message?: string;
}> {
  try {
    const result = await serverRequestWithApiKey<any>(
      `/admin/users/${userId}/apply-free-limits`,
      { method: "POST" }
    );

    revalidatePath(`/admin/users/${userId}`);

    return {
      success: true,
      changes: result.changes,
    };
  } catch (error: any) {
    console.error("Error applying free limits:", error);
    return {
      success: false,
      message: error.message || "حدث خطأ أثناء تطبيق القيود",
    };
  }
}

/**
 * Toggle menu status (active/inactive)
 */
export async function toggleMenuStatus(
  menuId: number,
  isActive: boolean
): Promise<{ success: boolean; message?: string }> {
  try {
    await serverRequestWithApiKey<any>(`/menus/${menuId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error toggling menu status:", error);
    return {
      success: false,
      message: error.message || "حدث خطأ أثناء تحديث حالة القائمة",
    };
  }
}

/**
 * Toggle user suspend status
 */
export async function toggleUserSuspend(
  userId: number,
  isSuspended: boolean,
  locale: string
): Promise<void> {
  try {
    await serverRequestWithApiKey(`/admin/users/${userId}/suspend`, {
      method: "PUT",
      body: JSON.stringify({ isSuspended }),
    });

    revalidatePath(`/${locale}/admin/users`);
  } catch (error: any) {
    console.error("Error toggling user suspend:", error);
    throw new Error(error.message || "حدث خطأ أثناء تحديث حالة المستخدم");
  }
}
