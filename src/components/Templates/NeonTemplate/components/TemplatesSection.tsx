"use client";

import React, { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { Star } from "@/components/icons/Icons";
import { MenuItem } from "../../types";
import { FoodItemModal } from "./FoodItemModal";
import { TemplatesSectionProps } from "./types";

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  menuData,
  selectedCategory,
  onCategoryChange,
  customizations = {},
}) => {
  const locale = useLocale();
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(
    null
  );

  const currency = menuData.menu.currency || "AED";
  const isProPlan =
    menuData.menu.ownerPlanType !== "free" && !!menuData.menu.ownerPlanType;

  // Default customization values
  const primaryColor = customizations.primaryColor || "#14b8a6";
  const secondaryColor = customizations.secondaryColor || "#06b6d4";
  const heroTitle =
    locale === "ar"
      ? customizations.heroTitleAr || "استكشف قائمتنا"
      : customizations.heroTitleEn || "Explore Our Menu";
  const heroSubtitle =
    locale === "ar"
      ? customizations.heroSubtitleAr ||
        "اختر من مجموعة متنوعة من الأطباق اللذيذة"
      : customizations.heroSubtitleEn ||
        "Choose from a variety of delicious dishes";

  // Build categories from menuData with "all" option
  const categories = useMemo(() => {
    const allCategory = {
      id: "all",
      name: locale === "ar" ? "الكل" : "All",
      icon: "🍽️",
    };

    const dbCategories = (menuData.categories || [])
      .filter((cat) => cat.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((cat) => ({
        id: cat.id.toString(),
        name: cat.name,
        icon: "🍽️",
      }));

    return [allCategory, ...dbCategories];
  }, [menuData.categories, locale]);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") {
      return menuData.items;
    }
    return menuData.items.filter(
      (item) => item.categoryId?.toString() === selectedCategory
    );
  }, [menuData.items, selectedCategory]);

  return (
    <section
      id="templates"
      className="py-24 md:py-32 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: `${primaryColor}15`,
              border: `1px solid ${primaryColor}40`,
            }}
          >
            <Star className="w-4 h-4" color={primaryColor} />
            <span
              className="text-sm font-semibold"
              style={{ color: primaryColor }}
            >
              {locale === "ar" ? "قائمة الطعام" : "Menu Items"}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6">
            {heroTitle}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
            {heroSubtitle}
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-16">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold text-base transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "text-white shadow-lg scale-105"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:scale-105"
                }`}
                style={
                  selectedCategory === category.id
                    ? {
                        background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                        boxShadow: `0 10px 15px -3px ${primaryColor}50`,
                      }
                    : {
                        borderColor:
                          selectedCategory !== category.id
                            ? undefined
                            : `${primaryColor}40`,
                      }
                }
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.borderColor = `${primaryColor}60`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.borderColor = "";
                  }
                }}
              >
                <span className="text-2xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {locale === "ar"
                  ? "لا توجد عناصر في هذه الفئة"
                  : "No items in this category"}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              // Get translated values based on locale
              const itemName = locale === "ar" 
                ? (item as any).nameAr || item.name 
                : (item as any).nameEn || item.name;
              const itemDescription = locale === "ar" 
                ? (item as any).descriptionAr || item.description 
                : (item as any).descriptionEn || item.description;
              const itemCategoryName = locale === "ar"
                ? (item as any).categoryNameAr || item.categoryName
                : (item as any).categoryNameEn || item.categoryName;

              const categoryName =
                categories.find((cat) => cat.id === item.categoryId?.toString())
                  ?.name ||
                itemCategoryName ||
                "";

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFoodItem(item)}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-2"
                  style={{
                    borderColor: undefined,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${primaryColor}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={itemName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {item.discountPercent && item.discountPercent > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{item.discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                      {itemName}
                    </h3>
                    {/* Show description only for Pro plan users */}
                    {isProPlan && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">
                        {itemDescription}
                      </p>
                    )}
                    <div
                      className={`${
                        isProPlan ? "mt-4" : "mt-2"
                      } flex items-center justify-between`}
                    >
                      <span
                        className="text-xs px-3 py-1 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor,
                        }}
                      >
                        {categoryName}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="text-slate-400 line-through text-sm">
                              {item.originalPrice} {currency}
                            </span>
                          )}
                        <span
                          className="font-bold text-lg"
                          style={{ color: primaryColor }}
                        >
                          {item.price} {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Food Item Modal */}
      <FoodItemModal
        isOpen={selectedFoodItem !== null}
        onClose={() => setSelectedFoodItem(null)}
        item={selectedFoodItem}
        isProPlan={isProPlan}
        currency={currency}
      />
    </section>
  );
};
