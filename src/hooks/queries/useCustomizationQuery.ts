/**
 * Customization React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as customizationService from "@/services/customization.service";

// Query Keys Factory
export const customizationKeys = {
  all: ["customizations"] as const,
  details: () => [...customizationKeys.all, "detail"] as const,
  detail: (menuId: string | number) => [...customizationKeys.details(), menuId] as const,
};

// Get customizations
export function useCustomizations(menuId: string | number) {
  return useQuery({
    queryKey: customizationKeys.detail(menuId),
    queryFn: () => customizationService.getCustomizations(menuId),
    enabled: !!menuId,
    retry: 1,
  });
}

// Update customizations
export function useUpdateCustomizations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ menuId, data }: { menuId: string | number; data: customizationService.MenuCustomizations }) =>
      customizationService.updateCustomizations(menuId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customizationKeys.detail(variables.menuId) });
    },
  });
}

// Delete customizations (reset)
export function useDeleteCustomizations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customizationService.deleteCustomizations,
    onSuccess: (_, menuId) => {
      queryClient.invalidateQueries({ queryKey: customizationKeys.detail(menuId) });
    },
  });
}
