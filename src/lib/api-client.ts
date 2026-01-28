

import { tokenCookies } from "@/lib/cookies";
import { getClientApiKeyHeaders } from "@/lib/api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  isRefreshing: boolean;
  refreshSubscribers: Array<(token: string) => void>;
}

const tokenState: TokenState = {
  accessToken: null,
  refreshToken: null,
  isRefreshing: false,
  refreshSubscribers: [],
};

// Initialize tokens from cookies (client-side only)
if (typeof window !== "undefined") {
  tokenState.accessToken = tokenCookies.getAccessToken();
  tokenState.refreshToken = tokenCookies.getRefreshToken();
}

// Token Management
function syncTokens(): void {
  if (typeof window === "undefined") return;
  
  const storedAccessToken = tokenCookies.getAccessToken();
  const storedRefreshToken = tokenCookies.getRefreshToken();
  
  if (storedAccessToken !== tokenState.accessToken) {
    tokenState.accessToken = storedAccessToken;
  }
  if (storedRefreshToken !== tokenState.refreshToken) {
    tokenState.refreshToken = storedRefreshToken;
  }
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  console.log("🔑 Setting tokens in api-client:", { 
    hasAccessToken: !!accessToken, 
    hasRefreshToken: !!refreshToken 
  });
  
  tokenState.accessToken = accessToken;
  
  if (typeof window !== "undefined") {
    tokenCookies.setAccessToken(accessToken);
    
    if (refreshToken) {
      tokenState.refreshToken = refreshToken;
      tokenCookies.setRefreshToken(refreshToken);
    }
    
    // Verify tokens were saved
    const savedAccessToken = tokenCookies.getAccessToken();
    console.log("✅ Tokens saved. Verification:", {
      tokenSaved: !!savedAccessToken,
      tokensMatch: savedAccessToken === accessToken
    });
  }
}

export function clearTokens(): void {
  tokenState.accessToken = null;
  tokenState.refreshToken = null;
  
  if (typeof window !== "undefined") {
    tokenCookies.clearTokens();
  }
}

export function getAccessToken(): string | null {
  syncTokens();
  return tokenState.accessToken;
}

// Token Refresh Logic
function onTokenRefreshed(callback: (token: string) => void): void {
  tokenState.refreshSubscribers.push(callback);
}

function notifyRefreshSubscribers(token: string): void {
  tokenState.refreshSubscribers.forEach((callback) => callback(token));
  tokenState.refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string | null> {
  if (!tokenState.refreshToken) {
    return null;
  }

  try {
    // Get API key headers for refresh request
    const apiKeyHeaders = await getClientApiKeyHeaders();
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...apiKeyHeaders,
      },
      body: JSON.stringify({ refreshToken: tokenState.refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    }

    return null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    clearTokens();
    return null;
  }
}

// Core API Request Function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  syncTokens();

  // Get API key headers
  const apiKeyHeaders = await getClientApiKeyHeaders();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...apiKeyHeaders,
    ...(options.headers as Record<string, string>),
  };

  if (tokenState.accessToken) {
    headers["Authorization"] = `Bearer ${tokenState.accessToken}`;
  } else {
    console.warn("⚠️ No access token found for request to:", endpoint);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Special handling for logout endpoint - always succeed locally
    if (endpoint.includes("/auth/logout")) {
      // For logout, we don't care if the server request fails
      // Just return success to allow local cleanup
      if (!response.ok) {
        return {} as T; // Return empty success response (silently ignore errors)
      }
      const data = await response.json();
      return data;
    }

    // Handle 401 - Token Expired
    if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
      // If already refreshing, wait for it
      if (tokenState.isRefreshing) {
        return new Promise((resolve, reject) => {
          onTokenRefreshed(async (newToken) => {
            try {
              // Regenerate API key for retry
              const retryApiKeyHeaders = await getClientApiKeyHeaders();
              headers["Authorization"] = `Bearer ${newToken}`;
              Object.assign(headers, retryApiKeyHeaders);
              const retryResponse = await fetch(url, { ...options, headers });
              const data = await retryResponse.json();
              
              if (!retryResponse.ok) {
                reject(new Error(data.error || `HTTP ${retryResponse.status}`));
              } else {
                resolve(data);
              }
            } catch (error) {
              reject(error);
            }
          });
        });
      }

      // Try to refresh token
      tokenState.isRefreshing = true;
      const newToken = await refreshAccessToken();
      tokenState.isRefreshing = false;

      if (newToken) {
        notifyRefreshSubscribers(newToken);
        // Regenerate API key for retry
        const retryApiKeyHeaders = await getClientApiKeyHeaders();
        headers["Authorization"] = `Bearer ${newToken}`;
        Object.assign(headers, retryApiKeyHeaders);
        const retryResponse = await fetch(url, { ...options, headers });
        const data = await retryResponse.json();
        
        if (!retryResponse.ok) {
          throw new Error(data.error || `HTTP ${retryResponse.status}`);
        }
        
        return data;
      } else {
        throw new Error("Session expired. Please login again.");
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error: any) {
    // Network errors
    if (error.message?.includes("Failed to fetch") || error.name === "TypeError") {
      throw new Error("Unable to connect to server. Please check your connection.");
    }
    
    throw error;
  }
}

// Upload Helper (for multipart/form-data)
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  syncTokens();

  // Get API key headers
  const apiKeyHeaders = await getClientApiKeyHeaders();

  const headers: Record<string, string> = {
    ...apiKeyHeaders,
  };
  
  if (tokenState.accessToken) {
    headers["Authorization"] = `Bearer ${tokenState.accessToken}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Upload failed: HTTP ${response.status}`);
    }

    return data;
  } catch (error: any) {
    if (error.message?.includes("Failed to fetch")) {
      throw new Error("Unable to connect to server. Please check your connection.");
    }
    throw error;
  }
}
