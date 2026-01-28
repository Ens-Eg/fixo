"use client";

/**
 * Cookie Management Utility
 * Secure cookie handling for authentication tokens
 */

interface CookieOptions {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
}

class CookieManager {
  /**
   * Set a cookie with secure options
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof window === "undefined") return;

    const {
      days = 7,
      path = "/",
      secure = window.location.protocol === "https:",
      sameSite = "lax",
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    }

    cookieString += `; path=${path}`;

    if (secure) {
      cookieString += "; secure";
    }

    cookieString += `; SameSite=${sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value by name
   */
  getCookie(name: string): string | null {
    if (typeof window === "undefined") return null;

    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        const value = cookie.substring(nameEQ.length);
        return decodeURIComponent(value);
      }
    }

    return null;
  }

  /**
   * Delete a cookie by name
   */
  deleteCookie(name: string, path: string = "/"): void {
    if (typeof window === "undefined") return;

    // Delete cookie with all possible attribute combinations to ensure removal
    const baseDelete = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    
    // Try with different combinations
    document.cookie = baseDelete;
    document.cookie = `${baseDelete}; secure`;
    document.cookie = `${baseDelete}; SameSite=Lax`;
    document.cookie = `${baseDelete}; secure; SameSite=Lax`;
  }

  /**
   * Check if a cookie exists
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Get all cookies as an object
   */
  getAllCookies(): Record<string, string> {
    if (typeof window === "undefined") return {};

    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(";");

    for (const cookie of cookieArray) {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  }

  /**
   * Clear all cookies (use with caution)
   */
  clearAllCookies(): void {
    if (typeof window === "undefined") return;

    const cookies = this.getAllCookies();
    for (const name of Object.keys(cookies)) {
      this.deleteCookie(name);
    }
  }
}

// Export singleton instance
export const cookieManager = new CookieManager();

// Token-specific helpers
export const tokenCookies = {
  // Access token - shorter expiry (7 days)
  setAccessToken: (token: string) => {
    cookieManager.setCookie("access_token", token, {
      days: 7,
      secure: false, // Allow in development
      sameSite: "lax",
    });
  },

  getAccessToken: (): string | null => {
    return cookieManager.getCookie("access_token");
  },

  // Refresh token - longer expiry (30 days)
  setRefreshToken: (token: string) => {
    cookieManager.setCookie("refresh_token", token, {
      days: 30,
      secure: false, // Allow in development
      sameSite: "lax",
    });
  },

  getRefreshToken: (): string | null => {
    return cookieManager.getCookie("refresh_token");
  },

  // Clear all authentication tokens
  clearTokens: () => {
    cookieManager.deleteCookie("access_token");
    cookieManager.deleteCookie("refresh_token");

    // Also clear old localStorage tokens for migration
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refresh_token");
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return cookieManager.hasCookie("access_token");
  },
};

export default cookieManager;
