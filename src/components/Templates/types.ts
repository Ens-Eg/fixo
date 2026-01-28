import { ComponentType } from "react";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  categoryId?: number;
  categoryName?: string;
  originalPrice?: number;
  discountPercent?: number;
}

export interface Category {
  icon: string;
  id: number;
  name: string;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
}

export interface MenuCustomizations {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  heroTitleAr?: string;
  heroSubtitleAr?: string;
  heroTitleEn?: string;
  heroSubtitleEn?: string;
}

export interface MenuData {
  menu: {
    id: number;
    name: string;
    description: string;
    logo: string;
    theme: string;
    slug: string;
    currency: string;
    isActive: boolean;
    ownerPlanType?: string;
    footerLogo?: string;
    footerDescriptionEn?: string;
    footerDescriptionAr?: string;
    socialFacebook?: string;
    socialInstagram?: string;
    socialTwitter?: string;
    socialWhatsapp?: string;
    addressEn?: string;
    addressAr?: string;
    phone?: string;
    workingHours?: {
      sunday?: { open?: string; close?: string; closed?: boolean };
      monday?: { open?: string; close?: string; closed?: boolean };
      tuesday?: { open?: string; close?: string; closed?: boolean };
      wednesday?: { open?: string; close?: string; closed?: boolean };
      thursday?: { open?: string; close?: string; closed?: boolean };
      friday?: { open?: string; close?: string; closed?: boolean };
      saturday?: { open?: string; close?: string; closed?: boolean };
    };
  };
  categories?: Category[];
  items: MenuItem[];
  itemsByCategory: Record<string, MenuItem[]>;
  branches: Branch[];
  rating: {
    average: number;
    total: number;
  };
  customizations?: MenuCustomizations;
  ads?: MenuItem[];
}

export interface TemplateProps {
  menuData: MenuData;
  slug: string;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onShowRatingModal: () => void;
}

export interface TemplateInfo {
  id: string;
  name: string;
  nameAr: string;
  component: ComponentType<TemplateProps>;
  description?: string;
  descriptionAr?: string;
}
