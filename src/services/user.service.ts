/**
 * User Service
 * API functions for user operations
 */

import { apiRequest } from "@/lib/api-client";

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  role: "user" | "admin";
  planType: "free" | "monthly" | "yearly";
  menusLimit: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get current user
export async function getCurrentUser(): Promise<{ user: User }> {
  return apiRequest("/auth/me");
}

// Get user profile
export async function getUserProfile(): Promise<User> {
  return apiRequest("/user/profile");
}

// Update profile
export async function updateProfile(data: {
  name?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  country?: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string;
}): Promise<User> {
  return apiRequest("/user/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Change password
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  return apiRequest("/user/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// Get user subscription
export async function getUserSubscription(): Promise<{ subscription: any }> {
  return apiRequest("/user/subscription");
}
