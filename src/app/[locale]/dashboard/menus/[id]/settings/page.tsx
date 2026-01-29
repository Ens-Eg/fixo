"use client";

import React, { use, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { templates } from "@/components/Templates";
import { useAuth } from "@/contexts/AuthContext";
import { uploadImage } from "@/services/upload.service";
import CurrencySelector from "@/components/CurrencySelector";
import { getMenuSettings, updateMenuSettings, deleteMenu } from "./actions";
import { IoArrowBack, IoSettings, IoColorPaletteOutline, IoGlobeOutline, IoInformationCircleOutline, IoLanguageOutline, IoDocumentTextOutline, IoNewspaperOutline, IoLinkOutline, IoLockClosedOutline, IoCashOutline, IoToggleOutline, IoCheckmarkCircle, IoCloseCircle, IoImageOutline, IoCloudUploadOutline, IoCloseOutline, IoTrashOutline, IoRestaurant, IoEyeOutline, IoCheckmarkOutline, IoWarningOutline, IoArrowUpOutline, IoStarOutline, IoBulbOutline, IoSparklesOutline, IoShareSocialOutline, IoAddOutline, IoRemoveOutline, IoSaveOutline, IoCallOutline, IoTimeOutline, IoArrowForwardOutline, IoMailOutline, IoHandLeftOutline, IoRefreshOutline, IoPauseCircleOutline } from "react-icons/io5";

export default function MenuSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("MenuSettings");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState<string | null>(null);
  const [menuName, setMenuName] = useState("");
  const [menuSlug, setMenuSlug] = useState<string | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "appearance" | "footer"
  >("general");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false);

  // دمج حالات الـ modals في object واحد لتحسين الأداء
  const [modalState, setModalState] = useState({
    deleteModal: { show: false, confirmText: "", isProcessing: false },
    deactivateModal: { show: false, confirmText: "", isProcessing: false },
  });

  // Template preview modal
  const [previewModal, setPreviewModal] = useState({
    show: false,
    templateId: "",
  });
  const [iframeLoading, setIframeLoading] = useState(true);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    slug: "",
    logo: "",
    theme: "default",
    currency: "AED",
    isActive: true,
    footerLogo: "",
    footerDescriptionEn: "",
    footerDescriptionAr: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
    socialWhatsapp: "",
    addressEn: "",
    addressAr: "",
    phone: "",
    workingHours: {
      sunday: { open: "", close: "", closed: false },
      monday: { open: "", close: "", closed: false },
      tuesday: { open: "", close: "", closed: false },
      wednesday: { open: "", close: "", closed: false },
      thursday: { open: "", close: "", closed: false },
      friday: { open: "", close: "", closed: false },
      saturday: { open: "", close: "", closed: false },
    },
  });
  const [originalData, setOriginalData] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    slug: "",
    logo: "",
    theme: "default",
    currency: "AED",
    isActive: true,
    footerLogo: "",
    footerDescriptionEn: "",
    footerDescriptionAr: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
    socialWhatsapp: "",
    addressEn: "",
    addressAr: "",
    phone: "",
    workingHours: {
      sunday: { open: "", close: "", closed: false },
      monday: { open: "", close: "", closed: false },
      tuesday: { open: "", close: "", closed: false },
      wednesday: { open: "", close: "", closed: false },
      thursday: { open: "", close: "", closed: false },
      friday: { open: "", close: "", closed: false },
      saturday: { open: "", close: "", closed: false },
    },
  });

  // Fetch menu settings (Server Action - لا يظهر في Network tab)
  const fetchMenuSettings = useCallback(
    async () => {
      try {
        const result = await getMenuSettings(id, locale);
        const menu = result?.menu;

        if (!menu || !menu.id) {
          setNotFoundError(true);
          return;
        }

        const displayName =
          locale === "ar"
            ? menu.nameAr || menu.name || ""
            : menu.nameEn || menu.name || "";
        setMenuName(displayName);
        setMenuSlug(menu.slug || null);

        // Parse working hours if exists
        let workingHours = {
          sunday: { open: "", close: "", closed: false },
          monday: { open: "", close: "", closed: false },
          tuesday: { open: "", close: "", closed: false },
          wednesday: { open: "", close: "", closed: false },
          thursday: { open: "", close: "", closed: false },
          friday: { open: "", close: "", closed: false },
          saturday: { open: "", close: "", closed: false },
        };
        if (menu.workingHours) {
          try {
            const parsed =
              typeof menu.workingHours === "string"
                ? JSON.parse(menu.workingHours)
                : menu.workingHours;
            workingHours = { ...workingHours, ...parsed };
          } catch (e) {
            console.error("Error parsing working hours:", e);
          }
        }

        const initialData = {
          nameEn: menu.nameEn || "",
          nameAr: menu.nameAr || "",
          descriptionEn: menu.descriptionEn || "",
          descriptionAr: menu.descriptionAr || "",
          slug: menu.slug || "",
          logo: menu.logo || "",
          theme: menu.theme || "default",
          currency: menu.currency || "AED",
          isActive: menu.isActive !== undefined ? menu.isActive : true,
          footerLogo: menu.footerLogo || "",
          footerDescriptionEn: menu.footerDescriptionEn || "",
          footerDescriptionAr: menu.footerDescriptionAr || "",
          socialFacebook: menu.socialFacebook || "",
          socialInstagram: menu.socialInstagram || "",
          socialTwitter: menu.socialTwitter || "",
          socialWhatsapp: menu.socialWhatsapp || "",
          addressEn: menu.addressEn || "",
          addressAr: menu.addressAr || "",
          phone: menu.phone || "",
          workingHours: workingHours,
        };
        setFormData(initialData);
        setOriginalData(initialData);
        setLogoPreview(menu.logo || null);
      } catch (error: any) {
        if (error.message?.includes("not found") || error.message?.includes("404")) {
          setNotFoundError(true);
        } else {
          toast.error("حدث خطأ في جلب إعدادات القائمة");
          setNotFoundError(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [id, locale]
  );

  // Trigger notFound() when error is detected
  if (notFoundError) {
    notFound();
  }

  useEffect(() => {
    fetchMenuSettings();
  }, [fetchMenuSettings]);

  // استخدام useMemo لحساب القيم المشتقة
  const isPremiumUser = useMemo(() => {
    return user?.planType === "monthly" || user?.planType === "yearly";
  }, [user?.planType]);

  const hasChanges = useMemo(() => {
    return Object.keys(formData).some(
      (key) =>
        formData[key as keyof typeof formData] !==
        originalData[key as keyof typeof originalData]
    );
  }, [formData, originalData]);

  const handleLogoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!isPremiumUser) {
        toast.error(
          locale === "ar"
            ? "هذه الميزة متاحة للمستخدمين المدفوعين فقط"
            : "This feature is only available for premium users"
        );
        return;
      }

      // Validate file type
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/x-icon",
        "image/vnd.microsoft.icon",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          locale === "ar"
            ? "يرجى رفع صورة بصيغة PNG, JPG أو ICO"
            : "Please upload an image in PNG, JPG or ICO format"
        );
        return;
      }

      // Validate file size (1MB max)
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(
          locale === "ar"
            ? "حجم الصورة يجب أن لا يتجاوز 1 ميجابايت"
            : "Image size must not exceed 1MB"
        );
        return;
      }

      setUploadingLogo(true);

      try {
        const uploadResponse = await uploadImage(file, "logos");
        const logoUrl = uploadResponse.url || "";

        if (!logoUrl) {
          throw new Error("فشل رفع الشعار: لم يتم الحصول على رابط الصورة");
        }

        // Update form data
        setFormData((prev) => ({ ...prev, logo: logoUrl }));
        setLogoPreview(logoUrl);

        // Save logo to database immediately
        try {
          await updateMenuSettings(id, { logo: logoUrl });
          setOriginalData((prev) => ({ ...prev, logo: logoUrl }));
          toast.success(t("messages.logoUploaded"));

          // Refresh to show updated data
          router.refresh();
        } catch (saveError: any) {
          console.error("Error saving logo:", saveError);
          toast.error(
            locale === "ar"
              ? "تم رفع الشعار لكن فشل حفظه. يرجى المحاولة مرة أخرى."
              : "Logo uploaded but failed to save. Please try again."
          );
        }
      } catch (error: any) {
        console.error("Error uploading logo:", error);
        const errorMessage = error?.message || error?.error || t("messages.logoUploadFailed");
        toast.error(
          locale === "ar"
            ? errorMessage || "فشل رفع الشعار"
            : errorMessage || "Failed to upload logo"
        );
      } finally {
        setUploadingLogo(false);
      }
    },
    [isPremiumUser, locale, id, router, t]
  );

  const handleRemoveLogo = useCallback(async () => {
    try {
      // Remove logo from database immediately
      await updateMenuSettings(id, { logo: "" });
      setFormData((prev) => ({ ...prev, logo: "" }));
      setOriginalData((prev) => ({ ...prev, logo: "" }));
      setLogoPreview(null);
      toast.success(t("messages.logoRemoved"));

      // Refresh to show updated data
      router.refresh();
    } catch (error: any) {
      console.error("Error removing logo:", error);
      toast.error(
        locale === "ar"
          ? "فشل حذف الشعار. يرجى المحاولة مرة أخرى."
          : "Failed to remove logo. Please try again."
      );
    }
  }, [id, locale, router, t]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Build update object with only changed fields
      const updates: any = {};
      const fields: (keyof typeof formData)[] = [
        "nameEn",
        "nameAr",
        "descriptionEn",
        "descriptionAr",
        "logo",
        "theme",
        "currency",
        "isActive",
        "addressEn",
        "addressAr",
        "phone",
        "footerLogo",
        "footerDescriptionEn",
        "footerDescriptionAr",
        "socialFacebook",
        "socialInstagram",
        "socialTwitter",
        "socialWhatsapp",
      ];

      fields.forEach((field) => {
        if (formData[field] !== originalData[field]) {
          updates[field] = formData[field];
        }
      });

      // Handle working hours separately (compare JSON strings)
      const workingHoursChanged =
        JSON.stringify(formData.workingHours) !==
        JSON.stringify(originalData.workingHours);
      if (workingHoursChanged) {
        updates.workingHours = formData.workingHours;
      }



      setSaving(true);

      try {
        await updateMenuSettings(id, updates);

        toast.success(t("saveSuccess"));
        setOriginalData({ ...formData });

        // إذا تغيرت الـ currency، invalidate الـ cache
        if (updates.currency) {
          queryClient.invalidateQueries({ queryKey: ["menu-data", Number(id)] });
        }

        router.refresh(); // Refresh to show updated data
        // Stay on settings page instead of redirecting
        // router.push(`/${locale}/dashboard/menus/${id}`);
      } catch (error: any) {
        console.error("❌ Error:", error);
        toast.error(error.message || t("saveError"));
      } finally {
        setSaving(false);
      }
    },
    [formData, originalData, id, locale, t, router, queryClient]
  );

  const handleIsActiveChange = useCallback(
    (checked: boolean) => {
      if (!checked && formData.isActive) {
        setModalState((prev) => ({
          ...prev,
          deactivateModal: { show: true, confirmText: "", isProcessing: false },
        }));
      } else {
        setFormData((prev) => ({ ...prev, isActive: checked }));
      }
    },
    [formData.isActive]
  );

  const handleDeactivateConfirm = useCallback(() => {
    if (modalState.deactivateModal.confirmText !== "DEACTIVATE") {
      toast.error(
        locale === "ar"
          ? 'يرجى كتابة "DEACTIVATE" للتأكيد'
          : 'Please type "DEACTIVATE" to confirm'
      );
      return;
    }

    setFormData((prev) => ({ ...prev, isActive: false }));
    setModalState((prev) => ({
      ...prev,
      deactivateModal: { show: false, confirmText: "", isProcessing: false },
    }));

    toast.success(
      locale === "ar"
        ? "تم تعطيل القائمة. لا تنسَ حفظ التغييرات."
        : "Menu deactivated. Don't forget to save changes."
    );
  }, [modalState.deactivateModal.confirmText, locale]);

  const handleDeleteClick = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      deleteModal: { show: true, confirmText: "", isProcessing: false },
    }));
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (modalState.deleteModal.confirmText !== "DELETE") {
      toast.error(
        locale === "ar"
          ? 'يرجى كتابة "DELETE" للتأكيد'
          : 'Please type "DELETE" to confirm'
      );
      return;
    }

    setModalState((prev) => ({
      ...prev,
      deleteModal: { ...prev.deleteModal, isProcessing: true },
    }));

    try {
      await deleteMenu(id);

      toast.success(t("deleteSuccess"));
      router.push(`/${locale}/dashboard/menus`);
      router.refresh(); // Refresh to show updated data
    } catch (error: any) {
      toast.error(error.message || t("deleteError"));
      setModalState((prev) => ({
        ...prev,
        deleteModal: { ...prev.deleteModal, isProcessing: false },
      }));
    }
  }, [modalState.deleteModal.confirmText, id, locale, t, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.push(`/${locale}/dashboard/menus`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <IoArrowBack />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {menuName || t("title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex-1 px-6 py-4 font-semibold text-base transition-all flex items-center justify-center gap-2 ${activeTab === "general"
                ? "bg-primary-500 text-white shadow-lg"
                : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <IoSettings className="!text-[24px]" />
            <span>
              {" "}
              {locale === "ar" ? "الإعدادات العامة" : "General Settings"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("appearance")}
            className={`flex-1 px-6 py-4 font-semibold text-base transition-all flex items-center justify-center gap-2 ${activeTab === "appearance"
                ? "bg-primary-500 text-white shadow-lg"
                : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <IoColorPaletteOutline className="!text-[24px]" />
            <span>{t("tabs.appearance")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("footer")}
            className={`flex-1 px-6 py-4 font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${activeTab === "footer"
                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-2xl scale-105 border-2 border-amber-400"
                : "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:from-amber-50 hover:via-orange-50 hover:to-amber-50 dark:hover:from-amber-900/20 dark:hover:via-orange-900/20 dark:hover:to-amber-900/20 hover:shadow-lg border-2 border-transparent hover:border-amber-300 dark:hover:border-amber-700"
              }`}
          >
            {/* Background Animation */}
            <div
              className={`absolute inset-0 ${activeTab === "footer" ? "opacity-20" : "opacity-0"
                } transition-opacity duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
            </div>

            {/* Icon with special effect */}
            <div
              className={`relative ${activeTab === "footer" ? "animate-bounce-slow" : ""
                }`}
            >

              <IoGlobeOutline className="!text-[28px]" />
              {activeTab === "footer" && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              )}
            </div>

            {/* Text with gradient on hover */}
            <span
              className={`relative ${activeTab === "footer" ? "drop-shadow-md" : ""
                }`}
            >
              {locale === "ar" ? "إعدادات الميديا" : "Media Settings"}
            </span>

            {/* Sparkle Effect */}
            {activeTab === "footer" && (
              <>
                <span className="absolute top-2 left-4 text-white text-xs opacity-80 animate-pulse">
                  ✨
                </span>
                <span className="absolute bottom-2 right-6 text-white text-xs opacity-60 animate-pulse delay-150">
                  ⭐
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Tab Content */}
        {activeTab === "general" && (
          <>
            {/* General Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IoInformationCircleOutline className="text-primary-500" />
                {t("sections.general")}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <IoLanguageOutline className="!text-[18px] text-primary-500" />
                      {t("fields.nameEn")}
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) =>
                        setFormData({ ...formData, nameEn: e.target.value })
                      }
                      className="form-input"
                      placeholder="Restaurant Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <IoLanguageOutline className="!text-[18px] text-primary-500" />
                      {t("fields.nameAr")}
                    </label>
                    <input
                      type="text"
                      value={formData.nameAr}
                      onChange={(e) =>
                        setFormData({ ...formData, nameAr: e.target.value })
                      }
                      className="form-input"
                      dir="rtl"
                      placeholder="اسم المطعم"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <IoDocumentTextOutline className="!text-[18px] text-primary-500" />
                    {t("fields.descriptionEn")}
                  </label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionEn: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none transition-colors"
                    placeholder="Describe your menu in English..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <IoNewspaperOutline className="!text-[18px] text-primary-500" />
                    {t("fields.descriptionAr")}
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionAr: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none transition-colors"
                    dir="rtl"
                    placeholder="صف قائمتك بالعربية..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <IoLinkOutline className="!text-[18px] text-blue-500" />
                    {t("fields.slug")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.slug}
                      className="form-input pl-12 cursor-not-allowed"
                      disabled
                    />
                    <IoLockClosedOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-[20px]" />
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <IoInformationCircleOutline className="!text-[16px]" />
                      {t("fields.slugHint")} - لا يمكن تغيير الرابط بعد الإنشاء
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IoCashOutline className="text-green-500" />
                {t("sections.currency")}
              </h2>

              <div className="max-w-2xl">
                <CurrencySelector
                  value={formData.currency}
                  onChange={(currency) => {
                    setFormData({ ...formData, currency });
                    toast.success(
                      locale === "ar"
                        ? `تم تغيير العملة إلى ${currency}`
                        : `Currency changed to ${currency}`,
                      {
                        icon: "💱",
                        duration: 3000,
                      }
                    );
                  }}
                  label={t("fields.currency")}
                  hint={t("fields.currencyHint")}
                  showArabOnly={false}
                />

                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <IoInformationCircleOutline className="text-blue-500 !text-[24px] mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                        {t("tips.note")}
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        {locale === "ar"
                          ? "العملة التي تختارها سيتم عرضها مع جميع الأسعار في قائمتك العامة."
                          : "The currency you select will be displayed with all prices in your public menu."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IoToggleOutline className="text-green-500" />
                {t("sections.status")}
              </h2>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleIsActiveChange(e.target.checked)}
                      className="w-6 h-6 text-green-500 rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="isActive"
                      className="text-base font-semibold text-gray-900 dark:text-white cursor-pointer flex items-center gap-2"
                    >
                      {formData.isActive ? (
                        <IoCheckmarkCircle className="!text-[20px] text-green-500" />
                      ) : (
                        <IoCloseCircle className="!text-[20px] text-green-500" />
                      )}
                      {t("fields.isActive")}
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t("fields.isActiveHint")}
                    </p>
                    {!formData.isActive && (
                      <div className="mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2">
                        <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <IoWarningOutline className="!text-[14px]" />
                          القائمة غير مرئية للعملاء حالياً
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Favicon/Logo Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IoImageOutline className="text-blue-500" />
                {locale === "ar"
                  ? "شعار القائمة (Favicon)"
                  : "Menu Logo (Favicon)"}
              </h2>

              {/* Premium Feature Check */}
              {!isPremiumUser ? (
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 border-2 border-amber-300 dark:border-amber-700">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IoLockClosedOutline className="text-white !text-[28px]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400 mb-2">
                        {locale === "ar"
                          ? "ميزة حصرية للمشتركين"
                          : "Premium Feature"}
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                        {locale === "ar"
                          ? "قم بالترقية إلى الخطة المدفوعة لتتمكن من تخصيص شعار قائمتك وإضافة Favicon مخصص"
                          : "Upgrade to a premium plan to customize your menu logo and add a custom favicon"}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/${locale}/dashboard/profile/user-profile`
                          )
                        }
                        className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold"
                      >
                        <IoArrowUpOutline className="!text-[20px]" />
                        {t("buttons.upgradePlan")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Logo Preview */}
                  {logoPreview && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {t("messages.currentLogo")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {locale === "ar"
                            ? "سيظهر كـ favicon في متصفح الزوار"
                            : "Will appear as favicon in visitors' browsers"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2 text-sm font-semibold"
                      >
                        <IoTrashOutline className="!text-[18px]" />
                        {t("buttons.remove")}
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="relative">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/png,image/jpeg,image/jpg,image/x-icon"
                      onChange={handleLogoChange}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className={`flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed rounded-xl transition-all cursor-pointer ${uploadingLogo
                          ? "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 cursor-not-allowed"
                          : "border-primary-300 dark:border-primary-700 hover:border-primary-500 dark:hover:border-primary-500 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                        }`}
                    >
                      {uploadingLogo ? (
                        <>
                          <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-600 dark:text-gray-400 font-semibold">
                            {t("buttons.uploading")}
                          </span>
                        </>
                      ) : (
                        <>
                          <IoCloudUploadOutline className="text-primary-500 !text-[28px]" />
                          <span className="text-primary-700 dark:text-primary-300 font-semibold">
                            {logoPreview
                              ? locale === "ar"
                                ? "تغيير الشعار"
                                : "Change Logo"
                              : locale === "ar"
                                ? "رفع شعار"
                                : "Upload Logo"}
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <IoInformationCircleOutline className="text-blue-500 !text-[24px] mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                          {t("tips.titlePlural")}
                        </h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                          <li>
                            {locale === "ar"
                              ? "الصيغ المدعومة: PNG, JPG, ICO"
                              : "Supported formats: PNG, JPG, ICO"}
                          </li>
                          <li>
                            {locale === "ar"
                              ? "الحجم الأقصى: 1 ميجابايت"
                              : "Maximum size: 1MB"}
                          </li>
                          <li>
                            {locale === "ar"
                              ? "يُنصح باستخدام صورة مربعة (مثل 512×512 بكسل)"
                              : "Recommended: Square image (e.g., 512×512 pixels)"}
                          </li>
                          <li>
                            {locale === "ar"
                              ? "سيظهر الشعار في علامة تبويب المتصفح"
                              : "Logo will appear in the browser tab"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border-2 border-red-300 dark:border-red-700 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IoWarningOutline className="text-white !text-[28px]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-red-900 dark:text-red-400 mb-2 flex items-center gap-2">
                    {t("dangerZone.title")}
                  </h2>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                    {t("dangerZone.description")}
                  </p>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold"
                  >
                    <IoTrashOutline className="!text-[20px]" />
                    {t("dangerZone.deleteButton")}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Appearance Tab Content */}
        {activeTab === "appearance" && (
          <div className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-800 dark:via-purple-900/10 dark:to-blue-900/10 rounded-2xl shadow-xl p-8 border border-purple-100 dark:border-gray-700">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <IoColorPaletteOutline className="text-white !text-[28px]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    {locale === "ar" ? "اختر تصميم القائمة" : "Select Menu Design"}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {locale === "ar" ? "اختر القالب المناسب لقائمتك" : "Choose the perfect template for your menu"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {templates.map((template) => {
                const isSelected = formData.theme === template.id;
                const isPremium = template.id === "neon" || template.id === "sky";

                return (
                  <div
                    key={template.id}
                    className={`relative group rounded-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 ${isSelected
                        ? "shadow-2xl shadow-primary-500/30 ring-4 ring-primary-500 scale-[1.02]"
                        : "shadow-lg hover:shadow-2xl"
                      }`}
                  >
                    {/* Main Card */}
                    <div className="bg-white dark:bg-gray-900 h-full flex flex-col">
                      {/* Preview Section */}
                      <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                        {/* Template Preview Mockup */}
                        <div className="absolute inset-0 p-5 flex flex-col">
                          {/* Mockup Header */}
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 shadow-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                            <div className="h-4 bg-gradient-to-r from-primary-300 to-primary-400 dark:from-primary-600 dark:to-primary-700 rounded-lg w-3/4 mb-2 animate-pulse"></div>
                            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>

                          {/* Mockup Content based on template */}
                          {template.id === "default" && (
                            <div className="grid grid-cols-3 gap-2.5 flex-1">
                              {[...Array(6)].map((_, i) => (
                                <div
                                  key={i}
                                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                                ></div>
                              ))}
                            </div>
                          )}
                          {template.id === "template2" && (
                            <div className="grid grid-cols-2 gap-2.5 flex-1">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                                ></div>
                              ))}
                            </div>
                          )}
                          {template.id === "template3" && (
                            <div className="space-y-2.5 flex-1">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow h-16 border border-gray-100 dark:border-gray-700"
                                ></div>
                              ))}
                            </div>
                          )}
                          {(template.id === "neon" || template.id === "sky") && (
                            <div className="grid grid-cols-2 gap-2.5 flex-1">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`rounded-lg shadow-lg transition-all ${template.id === "neon"
                                      ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30"
                                      : "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/30"
                                    }`}
                                ></div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          {/* Premium Badge */}
                          {isPremium && (
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                              <IoStarOutline className="!text-[14px]" />
                              {locale === "ar" ? "مميز" : "Premium"}
                            </div>
                          )}

                          {/* Selected Badge */}
                          {isSelected && (
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg ml-auto">
                              <IoCheckmarkCircle className="!text-[14px]" />
                              {locale === "ar" ? "محدد" : "Selected"}
                            </div>
                          )}
                        </div>

                        {/* Hover Overlay with Quick Actions */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent backdrop-blur-[2px] transition-all duration-300 flex items-end justify-center pb-6 ${isSelected
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                            }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!menuSlug) {
                                toast.error(
                                  locale === "ar"
                                    ? "جاري تحميل بيانات القائمة..."
                                    : "Loading menu data..."
                                );
                                return;
                              }
                              setIframeLoading(true);
                              setPreviewModal({
                                show: true,
                                templateId: template.id,
                              });
                            }}
                            className="px-6 py-2.5 bg-white/95 hover:bg-white text-gray-900 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 hover:scale-110 backdrop-blur-sm"
                          >
                            <IoEyeOutline className="!text-[20px]" />
                            {locale === "ar" ? "معاينة سريعة" : "Quick Preview"}
                          </button>
                        </div>
                      </div>

                      {/* Template Info Section */}
                      <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/50">
                        {/* Title & Description */}
                        <div className="mb-4">
                          <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            {locale === "ar" ? template.nameAr : template.name}
                            {isPremium && (
                              <IoStarOutline className="text-amber-500 !text-[18px]" />
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {locale === "ar"
                              ? template.descriptionAr
                              : template.description}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto space-y-2.5">
                          {/* Main Action Button */}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();

                              // If already selected, do nothing
                              if (isSelected) return;

                              // Set saving state
                              setSavingTemplate(template.id);

                              try {
                                // Save template immediately
                                await updateMenuSettings(id, { theme: template.id });

                                // Update form data and original data
                                setFormData((prev) => ({ ...prev, theme: template.id }));
                                setOriginalData((prev) => ({ ...prev, theme: template.id }));

                                // Show success message
                                toast.success(
                                  locale === "ar"
                                    ? "تم تطبيق القالب بنجاح ✓"
                                    : "Template applied successfully ✓",
                                  {
                                    icon: "✅",
                                    duration: 3000,
                                  }
                                );

                                // Refresh to show updated data
                                router.refresh();
                              } catch (error: any) {
                                console.error("Error saving template:", error);
                                toast.error(
                                  locale === "ar"
                                    ? "فشل تطبيق القالب. يرجى المحاولة مرة أخرى."
                                    : "Failed to apply template. Please try again.",
                                  {
                                    icon: "❌",
                                  }
                                );
                              } finally {
                                setSavingTemplate(null);
                              }
                            }}
                            disabled={isSelected || savingTemplate !== null}
                            className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${isSelected
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default"
                                : savingTemplate === template.id
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-wait"
                                  : "bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white"
                              }`}
                          >
                            {savingTemplate === template.id ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {locale === "ar" ? "جاري التطبيق..." : "Applying..."}
                              </>
                            ) : (
                              <>
                                {isSelected ? (
                                  <IoCheckmarkCircle className="!text-[22px]" />
                                ) : (
                                  <IoHandLeftOutline className="!text-[22px]" />
                                )}
                                {isSelected
                                  ? (locale === "ar" ? "محدد حالياً" : "Currently Selected")
                                  : (locale === "ar" ? "اختر هذا القالب" : "Select This Template")}
                              </>
                            )}
                          </button>

                          {/* Secondary Actions */}
                          <div className="flex gap-2">
                            {/* Preview Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!menuSlug) {
                                  toast.error(
                                    locale === "ar"
                                      ? "جاري تحميل بيانات القائمة..."
                                      : "Loading menu data..."
                                  );
                                  return;
                                }
                                setIframeLoading(true);
                                setPreviewModal({
                                  show: true,
                                  templateId: template.id,
                                });
                              }}
                              className="flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                            >
                              <IoEyeOutline className="!text-[18px]" />
                              {locale === "ar" ? "معاينة" : "Preview"}
                            </button>

                            {/* Edit/Customize Button for Premium Templates */}
                            {isPremium && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!user?.planType || user.planType === "free") {
                                    toast.error(
                                      locale === "ar"
                                        ? "هذه الميزة متاحة للمشتركين فقط. يرجى الترقية للنسخة المدفوعة."
                                        : "This feature is for premium subscribers only. Please upgrade.",
                                      {
                                        duration: 4000,
                                        icon: "🔒",
                                      }
                                    );
                                    return;
                                  }
                                  router.push(
                                    `/${locale}/dashboard/menus/${id}/customize?template=${template.id}`
                                  );
                                }}
                                className="flex-1 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 text-teal-600 dark:text-teal-400 hover:from-teal-100 hover:to-cyan-100 dark:hover:from-teal-900/30 dark:hover:to-cyan-900/30 border border-teal-200 dark:border-teal-800"
                              >
                                <IoSettings className="!text-[18px]" />
                                {locale === "ar" ? "تخصيص" : "Customize"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Helpful Tips Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shrink-0">
                  <IoBulbOutline className="text-white !text-[26px]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                    {locale === "ar" ? "نصائح مفيدة" : "Helpful Tips"}
                    <IoSparklesOutline className="text-yellow-500 !text-[20px]" />
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                    <li className="flex items-start gap-2">
                      <IoCheckmarkCircle className="!text-[18px] mt-0.5 text-blue-600 dark:text-blue-500" />
                      <span>
                        {locale === "ar"
                          ? "اضغط على 'معاينة سريعة' لرؤية القالب بشكل كامل قبل التطبيق"
                          : "Click 'Quick Preview' to see the template in full before applying"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <IoCheckmarkCircle className="!text-[18px] mt-0.5 text-blue-600 dark:text-blue-500" />
                      <span>
                        {locale === "ar"
                          ? "القوالب المميزة توفر خيارات تخصيص متقدمة للمشتركين"
                          : "Premium templates offer advanced customization options for subscribers"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <IoCheckmarkCircle className="!text-[18px] mt-0.5 text-blue-600 dark:text-blue-500" />
                      <span>
                        {locale === "ar"
                          ? "لا تنسَ حفظ التغييرات بعد اختيار القالب المناسب"
                          : "Don't forget to save changes after selecting your template"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Save Button for Appearance Changes */}
            {hasChanges && (
              <div className="mt-6 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(originalData);
                    toast.success(
                      locale === "ar"
                        ? "تم إلغاء التغييرات"
                        : "Changes cancelled"
                    );
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  {t("buttons.cancel")}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {locale === "ar" ? "جاري الحفظ..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <IoSaveOutline className="!text-[20px]" />
                      {t("buttons.saveChanges")}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Tab Content */}
        {activeTab === "footer" && (
          <>
            {/* Premium Feature Lock Overlay for Free Users */}
            {!isPremiumUser && (
              <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 rounded-2xl p-10 border-4 border-amber-400 dark:border-amber-600 mb-8 overflow-hidden shadow-2xl">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative flex flex-col items-center text-center ">
                  {/* Lock Icon with animation */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                      <IoLockClosedOutline className="text-white !text-[56px] drop-shadow-lg" />
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-50 animate-pulse"></div>

                    {/* Stars around lock */}
                    <span className="absolute -top-2 -left-2 text-3xl animate-pulse">
                      ✨
                    </span>
                    <span className="absolute -top-2 -right-2 text-3xl animate-pulse delay-500">
                      ⭐
                    </span>
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-3xl animate-pulse delay-1000">
                      💫
                    </span>
                  </div>

                  {/* Title with gradient */}
                  <h3 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-500 text-transparent bg-clip-text drop-shadow-sm">
                    {locale === "ar"
                      ? "✨ ميزة حصرية للمشتركين Pro ✨"
                      : "✨ Exclusive Pro Feature ✨"}
                  </h3>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-amber-800 dark:text-amber-200 mb-8 max-w-3xl leading-relaxed font-medium">
                    {locale === "ar"
                      ? "قم بالترقية إلى الخطة الاحترافية لتتمكن من تخصيص فوتر قائمتك بإضافة الشعار والوصف وروابط التواصل الاجتماعي الخاصة بك"
                      : "Upgrade to Pro plan to customize your menu footer with your logo, description, and social media links"}
                  </p>

                  {/* Features list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left max-w-2xl">
                    {[
                      {
                        icon: <IoImageOutline className="text-white !text-[20px]" />,
                        text:
                          locale === "ar"
                            ? "شعار مخصص للفوتر"
                            : "Custom Footer Logo",
                      },
                      {
                        icon: <IoDocumentTextOutline className="text-white !text-[20px]" />,
                        text:
                          locale === "ar"
                            ? "وصف متعدد اللغات"
                            : "Multi-language Description",
                      },
                      {
                        icon: <IoShareSocialOutline className="text-white !text-[20px]" />,
                        text:
                          locale === "ar"
                            ? "روابط السوشيال ميديا"
                            : "Social Media Links",
                      },
                      {
                        icon: <IoCheckmarkCircle className="text-white !text-[20px]" />,
                        text:
                          locale === "ar"
                            ? "مظهر احترافي"
                            : "Professional Appearance",
                      },
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 rounded-xl px-4 py-3 shadow-md backdrop-blur-sm border border-amber-200 dark:border-amber-700"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                          {feature.icon}
                        </div>
                        <span className="text-amber-900 dark:text-amber-100 font-semibold">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Upgrade Button */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/${locale}/menus/profile/edit#subscription`
                        )
                      }
                      className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 transition-all duration-300 shadow-2xl hover:shadow-amber-500/50 hover:scale-110 flex items-center gap-3 font-black text-xl overflow-hidden"
                    >
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                      <IoArrowUpOutline className="!text-[32px] relative z-10 animate-bounce-slow" />
                      <span className="relative z-10">
                        {locale === "ar" ? "ترقية الآن 🚀" : "Upgrade Now 🚀"}
                      </span>
                    </button>
                  </div>

                  {/* Small note */}
                  <p className="mt-6 text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                    <IoInformationCircleOutline className="!text-[16px]" />
                    {locale === "ar"
                      ? "ابدأ الآن بخطة Pro بأسعار تنافسية"
                      : "Start now with Pro plan at competitive prices"}
                  </p>
                </div>
              </div>
            )}

            <div
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 ${!isPremiumUser ? "opacity-60 pointer-events-none" : ""
                }`}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IoGlobeOutline className="text-primary-500" />
                {locale === "ar" ? "إعدادات الميديا" : "Media Settings"}
                <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-bold ml-2">
                  PRO
                </span>
              </h2>
            </div>

            {/* Social Media Links */}
            <div
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 ${!isPremiumUser ? "opacity-60 pointer-events-none" : ""
                }`}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IoShareSocialOutline className="text-blue-500" />
                {locale === "ar"
                  ? "روابط التواصل الاجتماعي"
                  : "Social Media Links"}
              </h2>

              <div className="space-y-4">
                {/* Facebook */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <i className="ri-facebook-fill text-[#1877F2] text-xl"></i>
                    {locale === "ar" ? "فيسبوك" : "Facebook"}
                  </label>
                  <input
                    type="url"
                    value={formData.socialFacebook}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialFacebook: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="https://facebook.com/yourpage"
                    disabled={!isPremiumUser}
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <i className="ri-instagram-fill text-[#E4405F] text-xl"></i>
                    {locale === "ar" ? "إنستغرام" : "Instagram"}
                  </label>
                  <input
                    type="url"
                    value={formData.socialInstagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialInstagram: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="https://instagram.com/yourprofile"
                    disabled={!isPremiumUser}
                  />
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <i className="ri-twitter-x-fill text-gray-900 dark:text-white text-xl"></i>
                    {locale === "ar" ? "تويتر (X)" : "Twitter (X)"}
                  </label>
                  <input
                    type="url"
                    value={formData.socialTwitter}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialTwitter: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="https://twitter.com/yourhandle"
                    disabled={!isPremiumUser}
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <i className="ri-whatsapp-fill text-[#25D366] text-xl"></i>
                    {locale === "ar" ? "واتساب" : "WhatsApp"}
                  </label>
                  <input
                    type="tel"
                    value={formData.socialWhatsapp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socialWhatsapp: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="+966501234567"
                    dir="ltr"
                    disabled={!isPremiumUser}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {locale === "ar"
                      ? "أدخل رقم الهاتف مع كود الدولة (مثال: +966501234567)"
                      : "Enter phone number with country code (e.g., +966501234567)"}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <IoInformationCircleOutline className="text-blue-500 !text-[24px] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      {locale === "ar" ? "ملاحظة" : "Note"}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      {locale === "ar"
                        ? "سيتم عرض هذه الروابط في فوتر قائمتك. يمكنك ترك أي حقل فارغاً إذا لم تكن تستخدم تلك المنصة."
                        : "These links will be displayed in your menu footer. You can leave any field empty if you don't use that platform."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 ${!isPremiumUser ? "opacity-60 pointer-events-none" : ""
                }`}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IoMailOutline className="text-blue-500" />
                {locale === "ar" ? "معلومات التواصل" : "Contact Information"}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <IoLanguageOutline className="!text-[18px] text-primary-500" />
                      {locale === "ar"
                        ? "العنوان (إنجليزي)"
                        : "Address (English)"}
                    </label>
                    <input
                      type="text"
                      value={formData.addressEn}
                      onChange={(e) =>
                        setFormData({ ...formData, addressEn: e.target.value })
                      }
                      className="form-input"
                      placeholder="Restaurant Address"
                      disabled={!isPremiumUser}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <IoLanguageOutline className="!text-[18px] text-primary-500" />
                      {locale === "ar" ? "العنوان (عربي)" : "Address (Arabic)"}
                    </label>
                    <input
                      type="text"
                      value={formData.addressAr}
                      onChange={(e) =>
                        setFormData({ ...formData, addressAr: e.target.value })
                      }
                      className="form-input"
                      dir="rtl"
                      placeholder="عنوان المطعم"
                      disabled={!isPremiumUser}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <IoCallOutline className="!text-[18px] text-primary-500" />
                    {locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="form-input"
                    placeholder="+966501234567"
                    dir="ltr"
                    disabled={!isPremiumUser}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {locale === "ar"
                      ? "أدخل رقم الهاتف مع كود الدولة (مثال: +966501234567)"
                      : "Enter phone number with country code (e.g., +966501234567)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 ${!isPremiumUser ? "opacity-60 pointer-events-none" : ""
                }`}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <IoTimeOutline className="text-purple-500" />
                {locale === "ar" ? "مواعيد العمل" : "Working Hours"}
              </h2>

              <div className="space-y-4">
                {[
                  {
                    key: "sunday",
                    label: locale === "ar" ? "الأحد" : "Sunday",
                  },
                  {
                    key: "monday",
                    label: locale === "ar" ? "الإثنين" : "Monday",
                  },
                  {
                    key: "tuesday",
                    label: locale === "ar" ? "الثلاثاء" : "Tuesday",
                  },
                  {
                    key: "wednesday",
                    label: locale === "ar" ? "الأربعاء" : "Wednesday",
                  },
                  {
                    key: "thursday",
                    label: locale === "ar" ? "الخميس" : "Thursday",
                  },
                  {
                    key: "friday",
                    label: locale === "ar" ? "الجمعة" : "Friday",
                  },
                  {
                    key: "saturday",
                    label: locale === "ar" ? "السبت" : "Saturday",
                  },
                ].map((day) => (
                  <div
                    key={day.key}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <input
                        type="checkbox"
                        checked={
                          !formData.workingHours[
                            day.key as keyof typeof formData.workingHours
                          ].closed
                        }
                        onChange={(e) => {
                          const newWorkingHours = { ...formData.workingHours };
                          newWorkingHours[
                            day.key as keyof typeof formData.workingHours
                          ] = {
                            ...newWorkingHours[
                            day.key as keyof typeof formData.workingHours
                            ],
                            closed: !e.target.checked,
                          };
                          setFormData({
                            ...formData,
                            workingHours: newWorkingHours,
                          });
                        }}
                        className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
                        disabled={!isPremiumUser}
                      />
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                        {day.label}
                      </label>
                    </div>
                    {!formData.workingHours[
                      day.key as keyof typeof formData.workingHours
                    ].closed ? (
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1">
                          <input
                            type="time"
                            value={
                              formData.workingHours[
                                day.key as keyof typeof formData.workingHours
                              ].open
                            }
                            onChange={(e) => {
                              const newWorkingHours = {
                                ...formData.workingHours,
                              };
                              newWorkingHours[
                                day.key as keyof typeof formData.workingHours
                              ] = {
                                ...newWorkingHours[
                                day.key as keyof typeof formData.workingHours
                                ],
                                open: e.target.value,
                              };
                              setFormData({
                                ...formData,
                                workingHours: newWorkingHours,
                              });
                            }}
                            className="form-input"
                            disabled={!isPremiumUser}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {locale === "ar" ? "من" : "From"}
                          </p>
                        </div>
                        <IoArrowForwardOutline className="text-gray-400" />
                        <div className="flex-1">
                          <input
                            type="time"
                            value={
                              formData.workingHours[
                                day.key as keyof typeof formData.workingHours
                              ].close
                            }
                            onChange={(e) => {
                              const newWorkingHours = {
                                ...formData.workingHours,
                              };
                              newWorkingHours[
                                day.key as keyof typeof formData.workingHours
                              ] = {
                                ...newWorkingHours[
                                day.key as keyof typeof formData.workingHours
                                ],
                                close: e.target.value,
                              };
                              setFormData({
                                ...formData,
                                workingHours: newWorkingHours,
                              });
                            }}
                            className="form-input"
                            disabled={!isPremiumUser}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {locale === "ar" ? "إلى" : "To"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-sm text-gray-500 dark:text-gray-400 italic">
                        {locale === "ar" ? "مغلق" : "Closed"}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <IoInformationCircleOutline className="text-blue-500 !text-[24px] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      {locale === "ar" ? "ملاحظة" : "Note"}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      {locale === "ar"
                        ? "حدد مواعيد العمل لكل يوم من أيام الأسبوع. يمكنك تحديد يوم كـ مغلق بإلغاء تحديده."
                        : "Set working hours for each day of the week. You can mark a day as closed by unchecking it."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons - Hide in Appearance tab */}
        {activeTab !== "appearance" && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-lg"
            >
              {saving ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("buttons.saving")}
                </>
              ) : (
                <>
                  <IoSaveOutline className="!text-[24px]" />
                  {t("buttons.save")}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${locale}/dashboard/menus/${id}`)}
              className="px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              <IoCloseOutline className="!text-[24px]" />
              {t("buttons.cancel")}
            </button>
          </div>
        )}
      </form>

      {/* Delete Confirmation Modal */}
      {modalState.deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-red-200 dark:border-red-800">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoWarningOutline className="text-red-600 dark:text-red-400 !text-[32px]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {locale === "ar"
                    ? "تأكيد حذف القائمة"
                    : "Confirm Menu Deletion"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {locale === "ar"
                    ? "هذا الإجراء لا يمكن التراجع عنه"
                    : "This action cannot be undone"}
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 dark:text-red-300 mb-3">
                {locale === "ar" ? (
                  <>
                    سيتم حذف <strong>{menuName}</strong> وجميع المنتجات والفئات
                    والإعلانات المرتبطة بها نهائياً.
                  </>
                ) : (
                  <>
                    <strong>{menuName}</strong> and all associated products,
                    categories, and ads will be permanently deleted.
                  </>
                )}
              </p>
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                {locale === "ar" ? (
                  <>
                    اكتب{" "}
                    <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      DELETE
                    </span>{" "}
                    للتأكيد
                  </>
                ) : (
                  <>
                    Type{" "}
                    <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      DELETE
                    </span>{" "}
                    to confirm
                  </>
                )}
              </p>
            </div>

            {/* Input Field */}
            <div className="mb-6">
              <input
                type="text"
                value={modalState.deleteModal.confirmText}
                onChange={(e) =>
                  setModalState((prev) => ({
                    ...prev,
                    deleteModal: {
                      ...prev.deleteModal,
                      confirmText: e.target.value,
                    },
                  }))
                }
                placeholder="DELETE"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-red-500 dark:bg-gray-700 dark:text-white font-mono text-center text-lg"
                disabled={modalState.deleteModal.isProcessing}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setModalState((prev) => ({
                    ...prev,
                    deleteModal: {
                      show: false,
                      confirmText: "",
                      isProcessing: false,
                    },
                  }))
                }
                disabled={modalState.deleteModal.isProcessing}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("buttons.cancel")}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={
                  modalState.deleteModal.isProcessing ||
                  modalState.deleteModal.confirmText !== "DELETE"
                }
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {modalState.deleteModal.isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("buttons.deleting")}
                  </>
                ) : (
                  <>
                    <IoTrashOutline className="!text-[20px]" />
                    {t("buttons.deleteForever")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewModal.show && menuSlug && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md flex items-center justify-center z-50 p-2 md:p-6 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-7xl w-full h-[95vh] overflow-hidden flex flex-col animate-slideUp border border-gray-200/50 dark:border-gray-700/50">
            {/* Modal Header - Enhanced */}
            <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <IoEyeOutline className="text-white !text-[32px]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-1 drop-shadow-lg">
                      {locale === "ar" ? "معاينة القالب" : "Template Preview"}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                        {locale === "ar"
                          ? templates.find(
                            (t) => t.id === previewModal.templateId
                          )?.nameAr
                          : templates.find(
                            (t) => t.id === previewModal.templateId
                          )?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIframeLoading(true);
                          // Force reload by changing key
                          setPreviewModal({
                            ...previewModal,
                            templateId: previewModal.templateId,
                          });
                        }}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold hover:bg-white/30 transition-all flex items-center gap-1"
                        title={locale === "ar" ? "إعادة تحميل" : "Reload"}
                      >
                        <IoRefreshOutline className="!text-[16px]" />
                        {locale === "ar" ? "تحديث" : "Reload"}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewModal({ show: false, templateId: "" });
                    setIframeLoading(true);
                  }}
                  className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                >
                  <IoCloseOutline className="text-white !text-[24px]" />
                </button>
              </div>
            </div>

            {/* Modal Body - iframe with shadow */}
            <div className="flex-1 overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {/* Loading State - Enhanced */}
              {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10">
                  <div className="text-center">
                    {/* Animated loader */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                      <div
                        className="absolute inset-2 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"
                        style={{
                          animationDirection: "reverse",
                          animationDuration: "0.8s",
                        }}
                      ></div>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {locale === "ar"
                        ? "جاري تحميل المعاينة..."
                        : "Loading preview..."}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {locale === "ar"
                        ? "الرجاء الانتظار قليلاً"
                        : "Please wait a moment"}
                    </p>
                  </div>
                </div>
              )}

              {/* Iframe with border */}
              <div className="w-full h-full p-3">
                {(() => {
                  // Use same origin (including subdomain) to avoid redirect issues
                  const origin =
                    typeof window !== "undefined" ? window.location.origin : "";

                  // Build URL with current host to maintain subdomain
                  const iframeUrl = `${origin}/${locale}/menu/${menuSlug}?preview=true&theme=${previewModal.templateId
                    }&_t=${Date.now()}`;

                  return (
                    <iframe
                      key={`preview-${previewModal.templateId}-${Date.now()}`}
                      src={iframeUrl}
                      className="w-full h-full border-0 rounded-2xl shadow-2xl bg-white dark:bg-gray-800"
                      title="Template Preview"
                      onLoad={() => {
                        setTimeout(() => setIframeLoading(false), 500);
                      }}
                    />
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer - Enhanced */}
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="p-6">
                {/* Info Note - Enhanced */}
                <div className="mb-5 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoInformationCircleOutline className="text-white !text-[20px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      {locale === "ar"
                        ? "المعاينة تعرض قائمتك الفعلية بالقالب المختار. قد تستغرق بضع ثوان للتحميل."
                        : "Preview shows your actual menu with the selected template. May take a few seconds to load."}
                    </p>
                  </div>
                </div>

                {/* Action Buttons - Enhanced */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      setPreviewModal({ show: false, templateId: "" });
                      setIframeLoading(true);
                    }}
                    className="px-8 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all transform hover:scale-105 flex items-center gap-2"
                  >
                    <IoCloseOutline className="!text-[20px]" />
                    {locale === "ar" ? "إلغاء" : "Cancel"}
                  </button>

                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        theme: previewModal.templateId,
                      });
                      setPreviewModal({ show: false, templateId: "" });
                      setIframeLoading(true);
                      toast.success(
                        locale === "ar"
                          ? "تم تغيير القالب بنجاح"
                          : "Template changed successfully"
                      );
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 transform hover:scale-105"
                  >
                    <IoCheckmarkCircle className="!text-[24px]" />
                    <span className="text-lg">
                      {locale === "ar" ? "تأكيد واستخدام" : "Confirm & Apply"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {modalState.deactivateModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-amber-200 dark:border-amber-800">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <IoPauseCircleOutline className="text-amber-600 dark:text-amber-400 !text-[32px]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {locale === "ar"
                    ? "تأكيد تعطيل القائمة"
                    : "Confirm Menu Deactivation"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {locale === "ar"
                    ? "ستصبح القائمة غير مرئية للعملاء"
                    : "The menu will become invisible to customers"}
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                {locale === "ar" ? (
                  <>
                    عند تعطيل القائمة <strong>{menuName}</strong>، لن يتمكن
                    العملاء من الوصول إليها أو مشاهدة المنتجات. يمكنك إعادة
                    تفعيلها في أي وقت.
                  </>
                ) : (
                  <>
                    When deactivating <strong>{menuName}</strong>, customers
                    will not be able to access it or view products. You can
                    reactivate it at any time.
                  </>
                )}
              </p>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                {locale === "ar" ? (
                  <>
                    اكتب{" "}
                    <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      DEACTIVATE
                    </span>{" "}
                    للتأكيد
                  </>
                ) : (
                  <>
                    Type{" "}
                    <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">
                      DEACTIVATE
                    </span>{" "}
                    to confirm
                  </>
                )}
              </p>
            </div>

            {/* Input Field */}
            <div className="mb-6">
              <input
                type="text"
                value={modalState.deactivateModal.confirmText}
                onChange={(e) =>
                  setModalState((prev) => ({
                    ...prev,
                    deactivateModal: {
                      ...prev.deactivateModal,
                      confirmText: e.target.value,
                    },
                  }))
                }
                placeholder="DEACTIVATE"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-amber-500 dark:bg-gray-700 dark:text-white font-mono text-center text-lg"
                disabled={modalState.deactivateModal.isProcessing}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setModalState((prev) => ({
                    ...prev,
                    deactivateModal: {
                      show: false,
                      confirmText: "",
                      isProcessing: false,
                    },
                  }))
                }
                disabled={modalState.deactivateModal.isProcessing}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("buttons.cancel")}
              </button>
              <button
                type="button"
                onClick={handleDeactivateConfirm}
                disabled={
                  modalState.deactivateModal.isProcessing ||
                  modalState.deactivateModal.confirmText !== "DEACTIVATE"
                }
                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {modalState.deactivateModal.isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("buttons.deactivating")}
                  </>
                ) : (
                  <>
                    <IoToggleOutline className="!text-[20px]" />
                    {t("buttons.deactivateMenu")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
