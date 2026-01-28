"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { IoStarOutline, IoArrowUpOutline, IoCheckmarkCircle, IoRocketOutline } from "react-icons/io5";

interface UpgradePlanModalProps {
  onClose: () => void;
  currentMenuCount: number;
  maxMenus: number;
  planName: string;
}

export function UpgradePlanModal({
  onClose,
  currentMenuCount,
  maxMenus,
  planName,
}: UpgradePlanModalProps) {
  const locale = useLocale();
  const router = useRouter();

  const handleUpgrade = () => {
    router.push(`/${locale}/menus/profile/edit#subscription`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="ENS-card bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 rounded-full flex items-center justify-center shadow-lg">
            <IoStarOutline className="text-amber-600 dark:text-amber-400 !text-[48px]" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {locale === "ar" ? "وصلت للحد الأقصى!" : "Limit Reached!"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {locale === "ar"
              ? `لقد وصلت للحد الأقصى من القوائم المسموح بها في خطتك الحالية`
              : `You've reached the maximum number of menus allowed in your current plan`}
          </p>
        </div>

        {/* Current Status */}
        <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {locale === "ar" ? "الخطة الحالية" : "Current Plan"}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {planName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {locale === "ar" ? "القوائم" : "Menus"}
              </p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {currentMenuCount} / {maxMenus}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(currentMenuCount / maxMenus) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-6 space-y-3">
          <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <IoArrowUpOutline className="text-primary-600 !text-[20px]" />
            {locale === "ar" ? "قم بالترقية للحصول على:" : "Upgrade to get:"}
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
              <IoCheckmarkCircle className="text-green-600 dark:text-green-400 !text-[20px] mt-0.5" />
              <span>
                {locale === "ar"
                  ? "مزيد من القوائم (حتى 3 أو غير محدود)"
                  : "More menus (up to 3 or unlimited)"}
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
              <IoCheckmarkCircle className="text-green-600 dark:text-green-400 !text-[20px] mt-0.5" />
              <span>
                {locale === "ar"
                  ? "مزيد من المنتجات لكل قائمة"
                  : "More products per menu"}
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
              <IoCheckmarkCircle className="text-green-600 dark:text-green-400 !text-[20px] mt-0.5" />
              <span>
                {locale === "ar"
                  ? "تخصيص شامل وبدون إعلانات"
                  : "Full customization and no ads"}
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleUpgrade}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <IoRocketOutline className="!text-[20px]" />
            {locale === "ar" ? "ترقية الخطة" : "Upgrade Plan"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
          >
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

