/**
 * Custom hook for accessing authentication tokens from cookies
 */

import { useCallback } from "react";
import { tokenCookies } from "@/lib/cookies";

export const useToken = () => {
  // Get access token from cookies
  const getAccessToken = useCallback((): string | null => {
    return tokenCookies.getAccessToken();
  }, []);

  // Get refresh token from cookies
  const getRefreshToken = useCallback((): string | null => {
    return tokenCookies.getRefreshToken();
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback((): boolean => {
    return tokenCookies.isAuthenticated();
  }, []);

  // Set tokens (usually done by api client, but available if needed)
  const setTokens = useCallback(
    (accessToken: string, refreshToken?: string) => {
      tokenCookies.setAccessToken(accessToken);
      if (refreshToken) {
        tokenCookies.setRefreshToken(refreshToken);
      }
    },
    []
  );

  // Clear tokens
  const clearTokens = useCallback(() => {
    tokenCookies.clearTokens();
  }, []);

  return {
    getAccessToken,
    getRefreshToken,
    isAuthenticated,
    setTokens,
    clearTokens,
  };
};

export default useToken;
