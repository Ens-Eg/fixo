"use server";

import { cookies } from "next/headers";
import { getApiKeyHeaders } from "@/lib/api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000/api";

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value || null;
}

async function serverRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const token = await getAccessToken();
    
    if (!token) {
      return { success: false, error: "Unauthorized" };
    }
    
    // Get API key headers
    const apiKeyHeaders = await getApiKeyHeaders();

    const headers: HeadersInit = new Headers({
      "Content-Type": "application/json",
      ...apiKeyHeaders,
      ...(options.headers as HeadersInit),
    });

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
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
      return { 
        success: false, 
        error: errorData.error || errorData.message || `HTTP ${response.status}` 
      };
    }

    const data = await response.json();
    
    return { success: true, data: data as T };
  } catch (error: any) {
    console.error("Server request error:", error);
    return { 
      success: false, 
      error: error.message || "حدث خطأ في الاتصال بالخادم" 
    };
  }
}

// Get all notifications
export async function getNotifications() {
  return await serverRequest<{ notifications: any[] }>("/notifications");
}

// Get unread notifications count
export async function getUnreadCount() {
  return await serverRequest<{ count: number }>("/notifications/unread-count");
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: number) {
  return await serverRequest(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  return await serverRequest("/notifications/read-all", {
    method: "PATCH",
  });
}

// Delete notification
export async function deleteNotification(notificationId: number) {
  return await serverRequest(`/notifications/${notificationId}`, {
    method: "DELETE",
  });
}
