/**
 * Product/Item Service
 * API functions for menu item operations
 */

import { apiRequest } from "@/lib/api-client";

export interface MenuItem {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemData {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  isActive?: boolean;
  sortOrder?: number;
}

// Get all items
export async function getMenuItems(
  menuId: string | number,
  locale: string = "ar",
  category?: string
): Promise<{ items: MenuItem[] }> {
  const params = new URLSearchParams({ locale });
  if (category) params.append("category", category);

  return apiRequest(`/menus/${menuId}/items?${params}`);
}

// Get single item
export async function getMenuItem(menuId: string | number, itemId: number): Promise<MenuItem> {
  return apiRequest(`/menus/${menuId}/items/${itemId}`);
}

// Create item
export async function createMenuItem(menuId: string | number, data: MenuItemData): Promise<MenuItem> {
  return apiRequest(`/menus/${menuId}/items`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update item
export async function updateMenuItem(
  menuId: string | number,
  itemId: number,
  data: Partial<MenuItemData>
): Promise<MenuItem> {
  return apiRequest(`/menus/${menuId}/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Delete item
export async function deleteMenuItem(menuId: string | number, itemId: number): Promise<{ message: string }> {
  return apiRequest(`/menus/${menuId}/items/${itemId}`, {
    method: "DELETE",
  });
}

// Reorder items
export async function reorderMenuItems(
  menuId: string | number,
  items: Array<{ id: number; sortOrder: number }>
): Promise<{ message: string }> {
  return apiRequest(`/menus/${menuId}/items/reorder`, {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

// Toggle item status
export async function toggleItemStatus(menuId: string | number, itemId: number): Promise<{ isActive: boolean }> {
  return apiRequest(`/menus/${menuId}/items/${itemId}/status`, {
    method: "PATCH",
  });
}
