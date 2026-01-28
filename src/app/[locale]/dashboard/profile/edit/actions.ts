"use server";

import { revalidatePath } from "next/cache";
import { serverRequestWithApiKey } from "@/lib/server-request";

export interface UpdateProfileData {
  name?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  country?: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Get user profile
export async function getUserProfile(): Promise<any> {
  try {
    const data = await serverRequestWithApiKey<any>("/user/profile");
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Update user profile
export async function updateProfile(
  profileData: UpdateProfileData
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });

    // Revalidate profile pages
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/profile/edit");
    revalidatePath("/dashboard/profile/user-profile");

    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}

// Change password
export async function changePassword(
  passwordData: ChangePasswordData
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const data = await serverRequestWithApiKey<any>("/user/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("Error changing password:", error);
    return {
      success: false,
      error: error.message || "Failed to change password",
    };
  }
}

// Upload profile image
export async function uploadProfileImage(
  formData: FormData
): Promise<{ success: boolean; error?: string; url?: string }> {
  try {
    const data = await serverRequestWithApiKey<any>("/upload", {
      method: "POST",
      body: formData,
    });

    return { success: true, url: data.url };
  } catch (error: any) {
    console.error("Error uploading profile image:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image",
    };
  }
}
