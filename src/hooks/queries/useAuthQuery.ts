/**
 * Authentication React Query Hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/auth.service";
import { userKeys } from "./useUserQuery";

// Login
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(userKeys.current(), { user: data.user });
    },
  });
}

// Signup
export function useSignup() {
  return useMutation({
    mutationFn: authService.signup,
  });
}

// Logout
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authService.logout(refreshToken),
    onSettled: () => {
      // Always clear cache whether logout succeeds or fails
      // This ensures user is logged out locally even if server request fails
      queryClient.clear();
    },
  });
}

// Check availability
export function useCheckAvailability() {
  return useMutation({
    mutationFn: ({ email, phoneNumber }: { email?: string; phoneNumber?: string }) =>
      authService.checkAvailability(email, phoneNumber),
  });
}

// Verify email
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
}

// Resend verification
export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
  });
}

// Forgot password
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

// Reset password
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
  });
}
