"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import toast from "react-hot-toast";
import { getAdminPlans, updateAdminPlan } from "../actions";

interface Plan {
  id: number;
  name: string;
  nameAr?: string;
  description?: string;
  priceMonthly: number;
  priceYearly?: number;
  durationInDays?: number;
  maxMenus: number;
  maxProductsPerMenu: number;
  hasAds: boolean;
  allowCustomDomain: boolean;
  features?: string;
  isActive: boolean;
}

interface PlansManagementContentProps {
  initialPlans: Plan[];
}

export default function PlansManagementContent({
  initialPlans,
}: PlansManagementContentProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("AdminPlans");
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getAdminPlans();
      setPlans(data.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("فشل تحميل الخطط");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setShowEditModal(true);
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    try {
      const response = await updateAdminPlan(editingPlan.id, {
        priceMonthly: editingPlan.priceMonthly,
        priceYearly: editingPlan.priceYearly,
        maxMenus: editingPlan.maxMenus,
        maxProductsPerMenu: editingPlan.maxProductsPerMenu,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to update plan");
      }

      setShowEditModal(false);
      setEditingPlan(null);
      fetchPlans(); // Refresh list
      toast.success(t("editModal.updateSuccess"));
    } catch (error: any) {
      console.error("Error updating plan:", error);
      toast.error(error.message || t("editModal.updateError"));
    }
  };

  return (
    <div className="py-5 px-5 sm:px-5 md:px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-[25px] md:flex items-center justify-between">
          <div>
            <h5 className="!mb-2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t("title")}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("subtitle")}
            </p>
          </div>
          <button
            onClick={() => router.push(`/${locale}/admin`)}
            className="mt-4 md:mt-0 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {locale === "ar" ? "← " : "→ "}
            {t("backButton")}
          </button>
        </div>

        {/* Plans Grid */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[25px] mb-[25px]">
            {plans.map((plan, index) => {
              const isFree = plan.priceMonthly === 0;
              const isComingSoon = !plan.isActive;

              return (
                <div
                  key={plan.id}
                  className={`ENS-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md text-center ${
                    isComingSoon ? "opacity-75" : ""
                  }`}
                >
                  <div className="ENS-card-content relative md:py-[10px] md:px-[10px]">
                    <span className="inline-block text-gray-700 dark:text-gray-300 rounded-md py-[6.5px] px-[17.3px] border border-gray-300 dark:border-[#172036]">
                      {plan.name}
                    </span>

                    {plan.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {plan.description}
                      </p>
                    )}

                    <div className="leading-none text-4xl text-gray-900 dark:text-white my-[15px] md:my-[17px] font-medium -tracking-[1px]">
                      {isFree ? (
                        <span className="text-2xl">
                          {locale === "ar" ? "مجاني" : "Free"}
                        </span>
                      ) : isComingSoon ? (
                        <span className="text-2xl text-purple-600 dark:text-purple-400">
                          {locale === "ar" ? "قريباً" : "Coming Soon"}
                        </span>
                      ) : (
                        <>
                          {plan.priceMonthly} درهم
                          <span className="text-md text-gray-600 dark:text-gray-400 font-normal tracking-normal">
                            {locale === "ar" ? "/شهرياً" : "/month"}
                          </span>
                        </>
                      )}
                    </div>

                    {plan.priceYearly !== undefined &&
                      !isFree &&
                      !isComingSoon && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {locale === "ar" ? "أو" : "or"} {plan.priceYearly} درهم{" "}
                          {locale === "ar" ? "/سنوياً" : "/year"}
                        </p>
                      )}

                    <ul className="mt-[20px] md:mt-[28px] ltr:text-left rtl:text-right">
                      <li className="relative ltr:pl-[30px] ltr:md:pl-[38px] rtl:pr-[30px] rtl:md:pr-[38px] mb-[15px]">
                        <i className="material-symbols-outlined text-success-600 absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                          check
                        </i>
                        {plan.maxMenus === -1
                          ? t("features.unlimitedMenus")
                          : `${plan.maxMenus} ${
                              plan.maxMenus === 1
                                ? t("features.menus")
                                : t("features.menusPlural")
                            }`}
                      </li>
                      <li className="relative ltr:pl-[30px] ltr:md:pl-[38px] rtl:pr-[30px] rtl:md:pr-[38px] mb-[15px]">
                        <i className="material-symbols-outlined text-success-600 absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                          check
                        </i>
                        {plan.maxProductsPerMenu === -1
                          ? t("features.unlimitedProducts")
                          : `${plan.maxProductsPerMenu} ${t(
                              "features.productsPlural"
                            )}`}
                      </li>
                      <li className="relative ltr:pl-[30px] ltr:md:pl-[38px] rtl:pr-[30px] rtl:md:pr-[38px] mb-[15px]">
                        <i
                          className={`material-symbols-outlined ${
                            plan.allowCustomDomain
                              ? "text-success-600"
                              : "text-red-500"
                          } absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2`}
                        >
                          {plan.allowCustomDomain ? "check" : "close"}
                        </i>
                        {t("features.customDomain")}
                      </li>
                      <li className="relative ltr:pl-[30px] ltr:md:pl-[38px] rtl:pr-[30px] rtl:md:pr-[38px] mb-[15px] last:mb-0">
                        <i
                          className={`material-symbols-outlined ${
                            !plan.hasAds ? "text-success-600" : "text-red-500"
                          } absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2`}
                        >
                          {!plan.hasAds ? "check" : "close"}
                        </i>
                        {t("features.noAds")}
                      </li>
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleEditPlan(plan)}
                      className="block w-full rounded-md font-medium transition-all md:text-md mt-[20px] md:mt-[20px] py-[12px] px-[20px] text-white bg-primary-500 hover:bg-primary-400"
                    >
                      <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                        <i className="material-symbols-outlined !text-md absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                          edit
                        </i>
                        {t("actions.edit")}
                      </span>
                    </button>

                    {/* Status Badge */}
                    <div className="absolute -top-[9px] ltr:-right-[17px] rtl:-left-[17px]">
                      {plan.isActive ? (
                        <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {t("status.active")}
                        </div>
                      ) : (
                        <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {locale === "ar" ? "قريباً" : "Coming Soon"}
                        </div>
                      )}
                    </div>

                    {/* Popular Badge for middle plan */}
                    {index === 1 && plan.isActive && (
                      <div className="absolute -top-[9px] ltr:left-[10px] rtl:right-[10px]">
                        <Image
                          src="/images/icons/star-popular.svg"
                          alt="popular"
                          width={80}
                          height={80}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Plan Modal */}
        {showEditModal && editingPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#0c1427] rounded-md p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("editModal.title")}: {editingPlan.name}
              </h2>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <i className="material-symbols-outlined !text-[16px] align-middle">
                    info
                  </i>{" "}
                  {locale === "ar"
                    ? "يمكنك تعديل الأسعار وعدد القوائم والمنتجات فقط"
                    : "You can only edit prices, menus count, and products count"}
                </p>
              </div>

              <div className="space-y-4">
                {/* Monthly Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("editModal.price")} ({locale === "ar" ? "شهري" : "Monthly"})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.priceMonthly ?? 0}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        priceMonthly: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                {/* Yearly Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {locale === "ar" ? "السعر السنوي" : "Yearly Price"} (
                    {locale === "ar" ? "اختياري" : "Optional"})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.priceYearly ?? 0}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        priceYearly: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                {/* Max Menus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("editModal.maxMenus")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingPlan.maxMenus ?? 0}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        maxMenus: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {locale === "ar"
                      ? "استخدم -1 للقوائم غير المحدودة"
                      : "Use -1 for unlimited menus"}
                  </p>
                </div>

                {/* Max Products Per Menu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("editModal.maxProducts")}
                  </label>
                  <input
                    type="number"
                    value={editingPlan.maxProductsPerMenu ?? 0}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        maxProductsPerMenu: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {locale === "ar"
                      ? "استخدم -1 للمنتجات غير المحدودة"
                      : "Use -1 for unlimited products"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSavePlan}
                  className="flex-1 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  {t("editModal.save")}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPlan(null);
                  }}
                  className="flex-1 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  {t("editModal.cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
