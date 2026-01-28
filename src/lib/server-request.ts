"use server";

import { cookies } from "next/headers";
import { getApiKeyHeaders } from "@/lib/api-helpers";

/**
 * Shared serverRequest function with API key support
 * Use this in all server action files instead of creating your own serverRequest
 * 
 * Example:
 * import { serverRequestWithApiKey } from "@/lib/server-request";
 * const data = await serverRequestWithApiKey<any>("/endpoint");
 */
export async function serverRequestWithApiKey<T>(
  endpoint: string,
  options: RequestInit = {},
  apiBaseUrl?: string
): Promise<T> {
  const API_BASE_URL = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000/api";
  
  // Get access token
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || null;
  
  // Get API key headers
  const apiKeyHeaders = await getApiKeyHeaders();
  
  // Check if body is FormData - don't set Content-Type for FormData (browser sets it with boundary)
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    ...(!isFormData && { "Content-Type": "application/json" }), // Only set Content-Type if not FormData
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



