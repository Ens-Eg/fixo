"use server";

import { cookies } from "next/headers";

import { serverRequestWithApiKey } from "@/lib/server-request";


async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value || null;
}


// Get current user
export async function getCurrentUser(): Promise<{ user: any }> {
  try {
    // Check if token exists before making request
    const token = await getAccessToken();
    if (!token) {
      // No token means user is not logged in - this is normal, not an error
      return { user: null };
    }
    
    const data = await serverRequestWithApiKey<any>("/auth/me");
    
    // Handle different response formats
    if (data && typeof data === 'object' && 'user' in data) {
      return { user: data.user };
    }
    if (data && typeof data === 'object' && 'data' in data && data.data?.user) {
      return { user: data.data.user };
    }
    
    return { user: data };
  } catch (error: any) {
    // Only log errors that are not authentication-related
    if (!error?.message?.includes("token") && !error?.message?.includes("401")) {
      console.error("Error fetching current user:", error);
    }
    return { user: null };
  }
}

// Get public plans (no authentication required)
export async function getPublicPlans(): Promise<{ success: boolean; plans?: any[] }> {
  try {
    const data = await serverRequestWithApiKey<any>("/public/plans");
    
    // Handle different response formats
    if (data && typeof data === 'object' && 'success' in data && data.success) {
      return { success: true, plans: data.plans || [] };
    }
    if (data && typeof data === 'object' && 'plans' in data) {
      return { success: true, plans: Array.isArray(data.plans) ? data.plans : [] };
    }
    if (Array.isArray(data)) {
      return { success: true, plans: data };
    }
    
    return { success: false, plans: [] };
  } catch (error) {
    console.error("Error fetching public plans:", error);
    return { success: false, plans: [] };
  }
}

// Login (Server Action - لا يظهر في Network tab)
export async function loginAction(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user: any }> {
  try {
    const data = await serverRequestWithApiKey<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    // Set tokens in cookies (both httpOnly for server-side and non-httpOnly for client-side)
    if (data.accessToken && data.refreshToken) {
      const cookieStore = await cookies();
      
      // Client-accessible cookies (for api-client.ts)
      cookieStore.set("access_token", data.accessToken, {
        httpOnly: false, // Changed to false so client can read it
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      cookieStore.set("refresh_token", data.refreshToken, {
        httpOnly: false, // Changed to false so client can read it
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }
    
    // Handle different response formats
    if (data && typeof data === 'object' && 'user' in data) {
      return {
        accessToken: data.accessToken || data.access_token,
        refreshToken: data.refreshToken || data.refresh_token,
        user: data.user,
      };
    }
    
    return {
      accessToken: data.accessToken || data.access_token,
      refreshToken: data.refreshToken || data.refresh_token,
      user: data,
    };
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw error;
  }
}

// Signup (Server Action - لا يظهر في Network tab)
export async function signupAction(data: {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}): Promise<{ message: string }> {
  try {
    const result = await serverRequestWithApiKey<any>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    return { message: result.message || "تم إنشاء الحساب بنجاح" };
  } catch (error: any) {
    console.error("Error signing up:", error);
    throw error;
  }
}

// Logout (Server Action - لا يظهر في Network tab)
export async function logoutAction(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    
    // Call logout API if we have a refresh token
    if (refreshToken) {
      try {
        await serverRequestWithApiKey("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        // Ignore API errors during logout
        console.error("Logout API error (ignored):", error);
      }
    }
    
    // Always clear cookies regardless of API response
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
  } catch (error) {
    console.error("Error during logout:", error);
    // Still try to clear cookies
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
  }
}
