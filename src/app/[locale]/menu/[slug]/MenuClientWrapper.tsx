"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getTemplateById, getDefaultTemplate } from "@/components/Templates";
import { MenuData } from "@/components/Templates/types";
import { useLocale } from "next-intl";
import { getClientApiKeyHeaders } from "@/lib/api-helpers";
import { IoCloseCircleOutline, IoConstructOutline } from "react-icons/io5";

interface MenuClientWrapperProps {
  slug: string;
  locale: string;
  initialPreviewTheme?: string | null;
}

// Function to fetch menu data
async function fetchMenuData(slug: string, locale: string): Promise<MenuData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const fetchUrl = `${apiUrl}/public/menu/${slug}?locale=${locale}`;

  // Get API key headers
  const apiKeyHeaders = await getClientApiKeyHeaders();

  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...apiKeyHeaders,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Menu not found");
    }
    throw new Error(`Failed to fetch menu: ${response.status}`);
  }

  const data = await response.json();
  const menuData = data?.data || data;

  if (!menuData || !menuData.menu) {
    throw new Error("Menu not found");
  }

  return menuData as MenuData;
}

export default function MenuClientWrapper({
  slug,
  initialPreviewTheme = null,
}: MenuClientWrapperProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(
    initialPreviewTheme
  );


  const locale = useLocale();
  // Fetch menu data using React Query
  const { data: menuData, isLoading, error } = useQuery({
    queryKey: ["menu", slug, locale],
    queryFn: () => fetchMenuData(slug, locale),
    
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });


  // Get preview theme from URL - check on mount and URL changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get("theme");
    const isPreview = urlParams.get("preview") === "true";

    const newTheme = isPreview && themeParam ? themeParam : null;

    if (newTheme !== previewTheme) {
      setPreviewTheme(newTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {locale === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state or not found
  if (error || !menuData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#0c1427] rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <IoCloseCircleOutline className="text-red-600 dark:text-red-400 !text-[48px]" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? "القائمة غير موجودة" : "Menu Not Found"}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {locale === "ar"
              ? "عذراً، لم نتمكن من العثور على القائمة المطلوبة."
              : "Sorry, we couldn't find the requested menu."}
          </p>

          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {locale === "ar" ? "العودة للرئيسية" : "Go Home"}
          </button>
        </div>
      </div>
    );
  }

  // صفحة الصيانة - إذا كانت القائمة متوقفة (isActive = false)
  if (!menuData.menu.isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#0c1427] rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <IoConstructOutline className="text-yellow-600 dark:text-yellow-400 !text-[48px]" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {locale === "ar" ? "تحت الصيانة" : "Under Maintenance"}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {locale === "ar"
              ? "نعتذر، القائمة غير متاحة حالياً. نحن نعمل على تحسينها وسنعود قريباً!"
              : "Sorry, this menu is currently unavailable. We are working on improvements and will be back soon!"}
          </p>

          {menuData.menu.logo && (
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
              <Image
                src={menuData.menu.logo}
                alt={menuData.menu.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {menuData.menu.name}
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {locale === "ar"
                ? "شكراً لتفهمكم"
                : "Thank you for your understanding"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Determine which template to use based on preview theme or menu theme
  const theme = previewTheme || menuData.menu.theme || "default";

  const templateInfo = getTemplateById(theme) || getDefaultTemplate();
  const TemplateComponent = templateInfo.component;

  return (
    <div style={previewTheme ? { marginTop: "52px" } : undefined}>
      <TemplateComponent
        menuData={menuData}
        slug={slug}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onShowRatingModal={() => setShowRatingModal(true)}
      />
    </div>
  );
}
