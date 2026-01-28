/**
 * Menu Service
 * API functions for menu operations
 */

import { apiRequest } from "@/lib/api-client";

export interface Menu {
  id: number;
  name: string;
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  slug: string;
  isActive: boolean;
  userId?: number;
  itemsCount?: number;
  activeItemsCount?: number;
  categoriesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuStats {
  totalItems: number;
  activeItems: number;
  categories: number;
}

// Get single menu
export async function getMenu(id: string | number, locale: string = "ar"): Promise<{ menu: Menu; itemsCount: number; activeItemsCount: number; categoriesCount: number }> {
  return apiRequest(`/menus/${id}?locale=${locale}`);
}

// Get all menus
export async function getMenus(locale: string = "ar"): Promise<Menu[]> {
  return apiRequest(`/menus?locale=${locale}`);
}

// Create menu
export async function createMenu(data: {
  name?: string;
  nameAr?: string;
  nameEn?: string;
  slug: string;
  templateType?: string;
}): Promise<Menu> {
  return apiRequest("/menus", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update menu
export async function updateMenu(
  id: string | number,
  data: Partial<{
    name?: string;
    nameAr?: string;
    nameEn?: string;
    slug: string;
    isActive: boolean;
  }>
): Promise<Menu> {
  return apiRequest(`/menus/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Delete menu
export async function deleteMenu(id: string | number): Promise<{ message: string }> {
  return apiRequest(`/menus/${id}`, {
    method: "DELETE",
  });
}

// Toggle menu status
export async function toggleMenuStatus(id: string | number): Promise<{ isActive: boolean }> {
  return apiRequest(`/menus/${id}/status`, {
    method: "PATCH",
  });
}

// Check slug availability
export async function checkSlugAvailability(slug: string): Promise<{ isAvailable: boolean }> {
  return apiRequest(`/menus/check-slug?slug=${encodeURIComponent(slug)}`);
}
