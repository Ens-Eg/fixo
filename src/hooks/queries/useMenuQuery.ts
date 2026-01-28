/**
 * Menu React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as menuService from "@/services/menu.service";

// Query Keys Factory
export const menuKeys = {
  all: ["menus"] as const,
  lists: () => [...menuKeys.all, "list"] as const,
  list: (locale: string) => [...menuKeys.lists(), locale] as const,
  details: () => [...menuKeys.all, "detail"] as const,
  detail: (id: string | number, locale?: string) => [...menuKeys.details(), id, locale] as const,
};

// Get single menu
export function useMenu(id: string | number, locale: string = "ar") {
  return useQuery({
    queryKey: menuKeys.detail(id, locale),
    queryFn: () => menuService.getMenu(id, locale),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get all menus
export function useMenus(locale: string = "ar") {
  return useQuery({
    queryKey: menuKeys.list(locale),
    queryFn: () => menuService.getMenus(locale),
    staleTime: 5 * 60 * 1000,
  });
}

// Create menu
export function useCreateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}

// Update menu
export function useUpdateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Parameters<typeof menuService.updateMenu>[1] }) =>
      menuService.updateMenu(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}

// Delete menu
export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}

// Toggle menu status
export function useToggleMenuStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.toggleMenuStatus,
    onSuccess: (_, menuId) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.detail(menuId) });
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}
