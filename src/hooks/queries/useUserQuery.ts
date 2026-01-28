/**
 * User React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userService from "@/services/user.service";
import { getCurrentUser as getCurrentUserAction } from "@/app/[locale]/actions";

// Query Keys Factory
export const userKeys = {
  all: ["user"] as const,
  current: () => [...userKeys.all, "current"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
};


export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: getCurrentUserAction,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Get user profile
export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userService.getUserProfile,
    staleTime: 5 * 60 * 1000,
  });
}

// Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      userService.changePassword(currentPassword, newPassword),
  });
}
