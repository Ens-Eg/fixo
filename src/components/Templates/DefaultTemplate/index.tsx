"use client";

import React from "react";
import { LanguageProvider } from "./context";
import {
  Navbar,
  MenuSection,
  Footer,
  ENSFixedBanner,
  AdBanner,
} from "./components";
import { globalStyles } from "./styles";
import { TemplateProps } from "../types";
import HeroSection from "../SkyTemplate/Components/HeroSection";
import { useLocale } from "next-intl";
import AdVBanner from "../SkyTemplate/Components/AdVBanner";

// ============================
// Main App Component
// ============================

export default function DefaultTemplate({
  menuData,
  slug,
  selectedCategory,
  onCategoryChange,
  onShowRatingModal,
}: TemplateProps) {
  // Get discounted items for ads
  const discountedItems = menuData.items.filter(
    (item) => item.discountPercent && item.discountPercent > 0
  );

  const locale = useLocale();
  const customizationsHeroTitle = locale === "ar" ? menuData?.customizations?.heroTitleAr : menuData?.customizations?.heroTitleEn;
  const customizationsHeroSubtitle = locale === "ar" ? menuData?.customizations?.heroSubtitleAr : menuData?.customizations?.heroSubtitleEn;
  const title = customizationsHeroTitle || menuData?.menu?.name;
  const subtitle = customizationsHeroSubtitle || menuData?.menu?.description;


  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <style jsx global>
          {globalStyles}
        </style>

        {/* Layout */}
        <Navbar menuName={menuData.menu.name} logo={menuData.menu.logo} whatsapp={menuData.menu.socialWhatsapp} />
        {/* <HeroSection
          menuName={menuData.menu.name}
          description={menuData.menu.description}
          logo={menuData.menu.logo}
          rating={menuData.rating}
        /> */}


        {menuData?.customizations ?
          <HeroSection
            menuName={title}
            menuDescription={subtitle}

          />
          : <div className="mt-20"></div>}
        <AdVBanner
          ads={menuData.ads || []}
        />
        <MenuSection
          categories={menuData.categories || []}
          items={menuData.items}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          currency={menuData.menu.currency || "SAR"}
        />

        {/*
      
        <OffersSection items={discountedItems} /> */}
        {/* <ENSServicesSection /> */}
        {/* */}
        <Footer
          menuName={menuData.menu.name}
          branches={menuData.branches}
          menuLogo={menuData.menu.logo}
          footerLogo={menuData.menu.footerLogo}
          footerDescriptionEn={menuData.menu.footerDescriptionEn}
          footerDescriptionAr={menuData.menu.footerDescriptionAr}
          socialFacebook={menuData.menu.socialFacebook}
          socialInstagram={menuData.menu.socialInstagram}
          socialTwitter={menuData.menu.socialTwitter}
          socialWhatsapp={menuData.menu.socialWhatsapp}
          addressEn={menuData.menu.addressEn}
          addressAr={menuData.menu.addressAr}
          phone={menuData.menu.phone}
          workingHours={menuData.menu.workingHours}
        />
        {/* Show ENS Banner only for free users */}
        {menuData.menu.ownerPlanType === "free" && <ENSFixedBanner />}
      </div>
    </LanguageProvider>
  );
}
