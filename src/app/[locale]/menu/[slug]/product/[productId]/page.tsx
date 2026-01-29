"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { getClientApiKeyHeaders } from "@/lib/api-helpers";
import { Icon } from "@/components/Templates/DefaultTemplate/components/Icon";
import { LanguageProvider, useLanguage } from "@/components/Templates/DefaultTemplate/context";
import { MenuItem } from "@/components/Templates/types";
import { globalStyles } from "@/components/Templates/DefaultTemplate/styles";

// Function to fetch menu data
async function fetchMenuData(slug: string, locale: string): Promise<any> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const fetchUrl = `${apiUrl}/public/menu/${slug}?locale=${locale}`;

  const apiKeyHeaders = await getClientApiKeyHeaders();

  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...apiKeyHeaders,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch menu: ${response.status}`);
  }

  const data = await response.json();
  return data?.data || data;
}

function ProductContent() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const { t, direction } = useLanguage();
  const slug = params.slug as string;
  const productId = parseInt(params.productId as string);

  // Fetch menu data
  const { data: menuData, isLoading } = useQuery({
    queryKey: ["menu", slug, locale],
    queryFn: () => fetchMenuData(slug, locale),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Find the product
  const product: MenuItem | undefined = menuData?.items?.find(
    (item: MenuItem) => item.id === productId
  );

  // Get translated name and description
  const itemName =
    locale === "ar"
      ? (product as any)?.nameAr || product?.name
      : (product as any)?.nameEn || product?.name;
  const itemDescription =
    locale === "ar"
      ? (product as any)?.descriptionAr || product?.description
      : (product as any)?.descriptionEn || product?.description;
  const itemCategoryName =
    locale === "ar"
      ? (product as any)?.categoryNameAr || product?.categoryName
      : (product as any)?.categoryNameEn || product?.categoryName;

  const currency = menuData?.menu?.currency || "AED";

  const getCurrency = () => {
    if (typeof t === "object" && t !== null && Object.prototype.hasOwnProperty.call(t, currency)) {
      // @ts-ignore
      return t[currency];
    }
    return currency;
  };

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {locale === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === "ar" ? "المنتج غير موجود" : "Product Not Found"}
          </h1>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {locale === "ar" ? "العودة" : "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleClose}
          className={`mb-6 flex items-center gap-2 text-[var(--bg-main)] hover:text-[var(--bg-main)]/80 transition-colors font-medium ${direction === "rtl" ? "ml-auto" : "mr-auto"}`}
        >
          <Icon name="arrow-left-line" className="text-xl" />
          <span>{locale === "ar" ? "العودة" : "Back"}</span>
        </button>

        {/* Product Card */}
        <div
          dir={direction}
          className="relative w-full bg-white rounded-[2.5rem] overflow-hidden border border-[var(--bg-main)]/20 shadow-2xl"
        >
          {/* Image Section */}
          <div className="relative h-80 sm:h-96 overflow-hidden">
            <img
              src={product.image}
              alt={itemName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

            {/* Category Badge */}
            {itemCategoryName && (
              <div
                className={`absolute top-6 bg-[var(--bg-main)]/90 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-full shadow-sm tracking-widest uppercase border border-white/20 ${direction === "rtl" ? "right-6" : "left-6"}`}
              >
                {itemCategoryName}
              </div>
            )}

            {/* Price Badge */}
            <div
              className={`absolute bottom-6 bg-[var(--bg-main)] text-white px-6 py-3 rounded-2xl shadow-xl border-4 border-white ${direction === "rtl" ? "right-6" : "left-6"}`}
            >
              <span className="text-2xl font-black tracking-tighter">
                {product.price} {getCurrency()}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-3xl font-black text-[var(--bg-main)] mb-3 tracking-tight">
                {itemName}
              </h2>
              <div className="w-12 h-1.5 bg-[var(--bg-main)] rounded-full" />
            </div>

            {/* Description */}
            <p className="text-[var(--bg-main)]/70 text-base leading-relaxed font-medium">
              {itemDescription}
            </p>

            {/* Divider */}
            <div className="h-px bg-[var(--bg-main)]/10" />

            {/* Additional Info */}
            {product.originalPrice && product.discountPercent && (
              <div className="flex items-center justify-between p-4 bg-[var(--bg-main)]/5 rounded-2xl">
                <span className="text-[var(--bg-main)]/70 font-medium">
                  {locale === "ar" ? "السعر الأصلي" : "Original Price"}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-lg text-[var(--bg-main)]/50 line-through font-medium">
                    {product.originalPrice} {getCurrency()}
                  </span>
                  <span className="text-sm font-black bg-[var(--bg-main)] text-white px-3 py-1 rounded-full">
                    -{product.discountPercent}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <LanguageProvider>
      <style jsx global>
        {globalStyles}
      </style>
      <ProductContent />
    </LanguageProvider>
  );
}
