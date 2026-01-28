

import { apiRequest } from "@/lib/api-client";

export interface MenuCustomizations {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  heroTitleAr: string;
  heroSubtitleAr: string;
  heroTitleEn: string;
  heroSubtitleEn: string;
}

// Get customizations
export async function getCustomizations(menuId: string | number): Promise<MenuCustomizations> {
  return apiRequest(`/menus/${menuId}/customizations`);
}

// Update customizations
export async function updateCustomizations(
  menuId: string | number,
  data: MenuCustomizations
): Promise<MenuCustomizations> {
  return apiRequest(`/menus/${menuId}/customizations`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Delete customizations (reset to default)
export async function deleteCustomizations(menuId: string | number): Promise<{ message: string }> {
  return apiRequest(`/menus/${menuId}/customizations`, {
    method: "DELETE",
  });
}
