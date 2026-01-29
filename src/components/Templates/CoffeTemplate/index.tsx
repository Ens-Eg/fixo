import React, { useMemo } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import PromoBanner from "./components/PromoBanner";
import MenuCategory from "./components/MenuCategory";
import Footer from "./components/Footer";
import { TemplateProps } from "../types";

function index({ menuData }: TemplateProps) {
  // Convert menuData to categories format
  const categories = useMemo(() => {
    if (!menuData?.categories || !menuData?.itemsByCategory) {
      return [];
    }

    return menuData.categories
      .filter((cat) => cat.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => {
        // Try different category keys to find items
        const categoryKey = category.id
          ? `category_${category.id}`
          : category.name;
        const items =
          menuData.itemsByCategory[categoryKey] ||
          menuData.itemsByCategory[category.name] ||
          [];

        return {
          id: category.id,
          title: category.name,
          titleAr: (category as any).nameAr || category.name,
          description: "",
          descriptionAr: "",
          items: items.map((item: any) => ({
            id: item.id,
            name: item.nameEn || item.name || "",
            nameAr: item.nameAr || item.name || "",
            description: item.descriptionEn || item.description || "",
            descriptionAr: item.descriptionAr || item.description || "",
            price: `${menuData.menu.currency || "AED"} ${item.price || 0}`,
            image: item.image || "",
            tag: item.tag || "",
            tagAr: item.tagAr || "",
            originalPrice: item.originalPrice,
            discountPercent: item.discountPercent,
          })),
        };
      });
  }, [menuData]);

  return (
    <div className="min-h-screen bg-[#17120F]">
      <Navbar
        menuName={menuData?.menu?.name}
        menuLogo={menuData?.menu?.logo}
        categories={categories}
      />

      <main>
        <HeroSection
          menuName={menuData?.menu?.name}
          menuDescription={menuData?.menu?.description}
        />

        <div className="container mx-auto px-6 pb-20" id="menu">
          <PromoBanner
            menuId={menuData?.menu?.id}
            ownerPlanType={menuData?.menu?.ownerPlanType}
          />

          {/* Menu Categories */}
          {categories.length > 0 ? (
            categories.map((category, index) => {
              const categoryId = category.id
                ? `category-${category.id}`
                : `category-${category.title
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`;
              return (
                <div key={category.id || category.title} id={categoryId}>
                  <MenuCategory
                    title={category.title}
                    titleAr={category.titleAr}
                    description={category.description}
                    descriptionAr={category.descriptionAr}
                    items={category.items}
                  />
                  {/* Insert another banner after the second category */}
                  {index === 1 && <PromoBanner />}
                </div>
              );
            })
          ) : (
            <div className="text-center py-20">
              <p className="text-[#B6AA99] text-lg">
                {menuData?.menu?.name || "Menu"} - No items available
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer
        menuName={menuData?.menu?.name}
        menuLogo={menuData?.menu?.logo}
        footerLogo={menuData?.menu?.footerLogo}
        footerDescriptionEn={menuData?.menu?.footerDescriptionEn}
        footerDescriptionAr={menuData?.menu?.footerDescriptionAr}
        socialFacebook={menuData?.menu?.socialFacebook}
        socialInstagram={menuData?.menu?.socialInstagram}
        socialTwitter={menuData?.menu?.socialTwitter}
        socialWhatsapp={menuData?.menu?.socialWhatsapp}
        addressEn={menuData?.menu?.addressEn}
        addressAr={menuData?.menu?.addressAr}
        phone={menuData?.menu?.phone}
        workingHours={menuData?.menu?.workingHours}
      />
    </div>
  );
}

export default index;
