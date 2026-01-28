import {
  MenuItem as BaseMenuItem,
  MenuData,
  MenuCustomizations,
} from "../../types";

export interface AdSpaceProps {
  position: "left" | "right";
  menuId: number;
  ownerPlanType?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface FoodItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BaseMenuItem | null;
  isProPlan?: boolean;
  currency?: string;
}

export interface TemplatesSectionProps {
  menuData: MenuData;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  customizations?: MenuCustomizations;
}

export interface NavbarProps {
  menuName: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  whatsapp?: string;
}

export interface FooterProps {
  menuName: string;
  branches: {
    id: number;
    name: string;
    address: string;
    phone: string;
    latitude: string;
    longitude: string;
  }[];
  primaryColor?: string;
  secondaryColor?: string;
  menuLogo?: string;
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
}

export interface QRCodeSectionProps {
  slug: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface GlobalAd {
  id: number;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  imageUrl: string | null;
  linkUrl: string | null;
  position: string;
  displayOrder: number;
  isActive: boolean;
}
