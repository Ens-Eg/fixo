"use client";

/**
 * Client Component للتفاعل فقط
 * البيانات تأتي من Server Component
 */

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { getMenuPublicUrl } from "@/lib/menuUrl";
import { QRCodeSVG } from "qrcode.react";
import { IoIosArrowBack, IoIosArrowForward, IoIosCheckmarkCircle, IoIosDownload, IoIosList, IoIosSettings, IoIosStats, IoIosTime } from "react-icons/io";
import { IoOpenOutline } from "react-icons/io5";

interface MenuDashboardClientProps {
  menu: any;
  stats: {
    totalItems: number;
    activeItems: number;
    categories: number;
  };
  recentItems: any[];
  locale: string;
}

export default function MenuDashboardClient({
  menu,
  stats,
  recentItems,
  locale,
}: MenuDashboardClientProps) {
  const router = useRouter();
  const t = useTranslations("MenuDashboard");
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const menuName =
    locale === "ar" ? menu?.nameAr || menu?.name || "" : menu?.nameEn || menu?.name || "";
  const menuSlug = menu?.slug || null;

  // Handle download QR code
  const handleDownloadQR = () => {
    if (!qrCodeRef.current || !menuSlug) return;

    const svg = qrCodeRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const scale = 2;
    canvas.width = 200 * scale;
    canvas.height = 200 * scale;

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `menu-qr-${menuSlug}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
          }
        }, "image/png");
      }
    };

    img.src = url;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push(`/${locale}/dashboard/menus`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <IoIosArrowBack className=" !text-[22px] md:!text-[24px] rotate-180" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {menuName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${locale}/dashboard/menus/${menu.id}`}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <IoIosStats className=" !text-[18px]" />
              {t("navigation.overview")}
            </Link>
            <Link
              href={`/${locale}/dashboard/menus/${menu.id}/categories`}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <IoIosList className=" !text-[18px]" />
              {t("navigation.categories")}
            </Link>
            <Link
              href={`/${locale}/dashboard/menus/${menu.id}/products`}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <IoOpenOutline className=" !text-[18px]" />
              {t("navigation.products")}
            </Link>
            <Link
              href={`/${locale}/dashboard/menus/${menu.id}/settings`}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <IoIosSettings className=" !text-[18px]" />
              {t("settings")}
            </Link>
            {menuSlug && (
              <a
                href={getMenuPublicUrl(menuSlug)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center gap-2"
              >
                <IoOpenOutline className=" !text-[18px]" />
                {t("viewPublic")}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t("stats.totalItems")}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalItems}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <IoOpenOutline className=" !text-[28px] text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t("stats.activeItems")}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.activeItems}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <IoIosCheckmarkCircle className=" !text-[28px] text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t("stats.categories")}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.categories}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <IoIosList className=" !text-[28px] text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      {menuSlug && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <div
                ref={qrCodeRef}
                className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <QRCodeSVG
                  value={getMenuPublicUrl(menuSlug)}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("qrCode.title") || "رمز QR للمنيو"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t("qrCode.description") ||
                  "شارك هذا الرمز مع عملائك للوصول السريع إلى المنيو"}
              </p>
              <button
                onClick={handleDownloadQR}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 mx-auto md:mx-0"
              >
                <IoIosDownload className=" !text-[18px]" />
                {t("qrCode.download") || "تحميل كصورة"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href={`/${locale}/dashboard/menus/${menu.id}/products`}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <IoOpenOutline className=" !text-[32px] text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {t("quickLinks.items")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("quickLinks.itemsDesc")}
              </p>
            </div>
            <IoIosArrowForward className=" !text-[28px] text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </Link>

        <Link
          href={`/${locale}/dashboard/menus/${menu.id}/settings`}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <IoIosSettings className=" !text-[32px] text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {t("quickLinks.settings")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("quickLinks.settingsDesc")}
              </p>
            </div>
            <IoIosArrowForward className=" !text-[28px] text-gray-400 group-hover:text-primary-500 transition-colors" />
          </div>
        </Link>

        {menuSlug && (
          <a
            href={getMenuPublicUrl(menuSlug)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <IoOpenOutline className=" !text-[32px] text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {t("quickLinks.preview")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("quickLinks.previewDesc")}
                </p>
              </div>
              <IoOpenOutline className=" !text-[28px] text-gray-400 group-hover:text-primary-500 transition-colors" />
            </div>
          </a>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t("recentActivity.title")}
        </h2>
        {recentItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700 text-center">
            <IoIosTime className=" !text-[48px] text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              {t("recentActivity.noActivity")}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {recentItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={locale === "ar" ? item.nameAr : item.nameEn}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.type === "product"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-purple-100 dark:bg-purple-900/30"
                          }`}
                      >
                        <IoOpenOutline className={` !text-[24px] ${item.type === "product"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-purple-600 dark:text-purple-400"
                          }`} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {locale === "ar" ? item.nameAr : item.nameEn}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${item.type === "product"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          }`}
                      >
                        {item.type === "product"
                          ? t("recentActivity.product")
                          : t("recentActivity.category")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("recentActivity.added")}{" "}
                      {new Date(item.createdAt).toLocaleDateString(
                        locale === "ar" ? "ar-SA" : "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/dashboard/menus/${menu.id}/${item.type === "product" ? "products" : "categories"
                      }`}
                    className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    {t("recentActivity.view")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
