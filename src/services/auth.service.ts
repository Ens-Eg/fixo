/**
 * Authentication Service
 * API functions for authentication operations
 */

import { apiRequest } from "@/lib/api-client";
import { setTokens, clearTokens } from "@/lib/api-client";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    planType: string;
  };
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

// Login
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.accessToken && response.refreshToken) {
    setTokens(response.accessToken, response.refreshToken);
  }

  return response;
}

// Signup
export async function signup(data: SignupData): Promise<{ message: string }> {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Logout
export async function logout(refreshToken: string): Promise<void> {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  } catch (error) {
    // Silently ignore errors - api-client already handles this
  } finally {
    // Always clear tokens regardless of API response
    clearTokens();
  }
}

// Check availability
export async function checkAvailability(
  email?: string,
  phoneNumber?: string
): Promise<{ isAvailable: boolean }> {
  const params = new URLSearchParams();
  if (email) params.append("email", email);
  if (phoneNumber) params.append("phoneNumber", phoneNumber);

  return apiRequest(`/auth/check-availability?${params.toString()}`);
}

// Verify email
export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiRequest("/auth/verify-email", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Resend verification
export async function resendVerification(email: string): Promise<{ message: string }> {
  return apiRequest("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Forgot password
export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Reset password
export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
