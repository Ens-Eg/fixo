/**
 * API Types & Interfaces
 */

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  errorType?: string;
  isLocked?: boolean;
  isSuspended?: boolean;
  lockedUntil?: string;
  remainingAttempts?: number;
  suspendedReason?: string;
}

// Auth Types
export interface SignupData {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  role: "user" | "admin";
  plan: "free" | "monthly" | "yearly";
  menusLimit: number;
  createdAt: string;
  updatedAt: string;
}

// Menu Types
export interface MenuData {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  logo?: string;
  theme?: string;
}

export interface Menu {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  slug: string;
  logo?: string;
  theme: string;
  isActive: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Menu Item Types
export interface MenuItemData {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  categoryAr: string;
  categoryEn: string;
  image?: string;
  isAvailable?: boolean;
  sortOrder?: number;
}

export interface MenuItem {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  categoryId?: number;
  categoryAr: string;
  categoryEn: string;
  image?: string;
  isAvailable: boolean;
  sortOrder: number;
  menuId: number;
  createdAt: string;
  updatedAt: string;
}

// Branch Types
export interface BranchData {
  nameAr: string;
  nameEn: string;
  addressAr?: string;
  addressEn?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export interface Branch {
  id: number;
  nameAr: string;
  nameEn: string;
  addressAr?: string;
  addressEn?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  menuId: number;
  createdAt: string;
  updatedAt: string;
}

// Plan Types
export interface Plan {
  id: string;
  nameAr: string;
  nameEn: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  menusLimit: number;
  isPopular?: boolean;
}

// Subscription Types
export interface Subscription {
  plan: string;
  status: string;
  billingCycle?: string;
  maxMenus: number;
  currentMenus: number;
  startDate?: string;
  endDate?: string;
}

// Statistics Types
export interface UserStatistics {
  menusCount: number;
  itemsCount: number;
  viewsCount: number;
  ratingsAverage: number;
  plan: string;
}

export interface SystemStatistics {
  totalUsers: number;
  totalMenus: number;
  totalItems: number;
  activeUsers: number;
  activeMenus: number;
  revenueThisMonth: number;
}
