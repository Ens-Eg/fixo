"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "react-hot-toast";
import {
  useCustomizations,
  useUpdateCustomizations,
  useDeleteCustomizations,
} from "@/hooks/queries/useCustomizationQuery";
import { useProAccess } from "@/hooks/useProAccess";

import { MenuCustomizations } from "@/services/customization.service";

const DEFAULT_CUSTOMIZATIONS: MenuCustomizations = {
  primaryColor: "#14b8a6",
  secondaryColor: "#06b6d4",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  heroTitleAr: "استكشف قائمتنا",
  heroSubtitleAr: "اختر من مجموعة متنوعة من الأطباق اللذيذة",
  heroTitleEn: "Explore Our Menu",
  heroSubtitleEn: "Choose from a variety of delicious dishes",
};

const COLOR_PRESETS = [
  { name: "Teal (افتراضي)", primary: "#14b8a6", secondary: "#06b6d4" },
  { name: "Purple", primary: "#a855f7", secondary: "#ec4899" },
  { name: "Blue", primary: "#3b82f6", secondary: "#06b6d4" },
  { name: "Green", primary: "#10b981", secondary: "#84cc16" },
  { name: "Orange", primary: "#f97316", secondary: "#fb923c" },
  { name: "Red", primary: "#ef4444", secondary: "#f43f5e" },
  { name: "Indigo", primary: "#6366f1", secondary: "#8b5cf6" },
  { name: "Pink", primary: "#ec4899", secondary: "#f472b6" },
];

export default function CustomizeMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const locale = useLocale();
  const router = useRouter();

  // Check Pro access
  const { isPro, isLoading: isCheckingAccess } = useProAccess();
  const searchParams = useSearchParams();
  const template = searchParams.get("template");
  // Fetch menu data to get template type
  const templateType = template || "default";
  const isSkyTemplate = templateType === "sky";
  console.log(templateType);




  // Fetch customizations
  const { data: fetchedCustomizations, isLoading: isLoadingCustomizations } = useCustomizations(id);

  // Mutations
  const updateMutation = useUpdateCustomizations();
  const deleteMutation = useDeleteCustomizations();

  // Get default primary color based on template type
  const getDefaultPrimaryColor = () => {
    return templateType === "sky" ? "#2196F3" : DEFAULT_CUSTOMIZATIONS.primaryColor;
  };

  // Local state - will be updated when template type is loaded
  const [customizations, setCustomizations] = useState<MenuCustomizations>(DEFAULT_CUSTOMIZATIONS);

  // Check Pro access on mount
  useEffect(() => {
    if (!isCheckingAccess && !isPro) {
      toast.error(
        locale === "ar"
          ? "هذه الميزة متاحة فقط للمشتركين في الخطة المدفوعة"
          : "This feature is only available for Pro users"
      );
      router.push(`/${locale}/dashboard/menus/${id}/settings`);
    }
  }, [isPro, isCheckingAccess, locale, router, id]);


  // Update local state when template type or customizations are fetched
  useEffect(() => {
    if (isLoadingCustomizations) return;


    const defaultPrimaryColor = getDefaultPrimaryColor();
    console.log(defaultPrimaryColor);

    console.log(fetchedCustomizations);

    if (fetchedCustomizations) {
      // If customizations exist, use them with fallback to defaults
      // For Sky template, ensure primaryColor defaults to #2196F3 if not set
      const primaryColor = fetchedCustomizations.primaryColor && fetchedCustomizations.primaryColor.trim()
        ? fetchedCustomizations.primaryColor
        : defaultPrimaryColor;

      console.log(primaryColor);

      setCustomizations({
        primaryColor,
        secondaryColor: fetchedCustomizations.secondaryColor || DEFAULT_CUSTOMIZATIONS.secondaryColor,
        backgroundColor: fetchedCustomizations.backgroundColor || DEFAULT_CUSTOMIZATIONS.backgroundColor,
        textColor: fetchedCustomizations.textColor || DEFAULT_CUSTOMIZATIONS.textColor,
        heroTitleAr: fetchedCustomizations.heroTitleAr || DEFAULT_CUSTOMIZATIONS.heroTitleAr,
        heroSubtitleAr: fetchedCustomizations.heroSubtitleAr || DEFAULT_CUSTOMIZATIONS.heroSubtitleAr,
        heroTitleEn: fetchedCustomizations.heroTitleEn || DEFAULT_CUSTOMIZATIONS.heroTitleEn,
        heroSubtitleEn: fetchedCustomizations.heroSubtitleEn || DEFAULT_CUSTOMIZATIONS.heroSubtitleEn,
      });
    } else {
      // If no customizations exist, use defaults based on template type
      setCustomizations({
        ...DEFAULT_CUSTOMIZATIONS,
        primaryColor: defaultPrimaryColor,
      });
    }
  }, [fetchedCustomizations, isLoadingCustomizations, isSkyTemplate]);

  // Handlers
  const handleSave = () => {
    updateMutation.mutate(
      { menuId: id, data: customizations },
      {
        onSuccess: () => {
          toast.success(
            locale === "ar"
              ? "تم حفظ التخصيصات بنجاح"
              : "Customizations saved successfully"
          );
          router.push(`/${locale}/dashboard/menus/${id}/settings`);
        },
        onError: (error: any) => {
          toast.error(
            error.message || (locale === "ar" ? "فشل الحفظ" : "Failed to save")
          );
        },
      }
    );
  };

  const handleReset = () => {
    if (
      !confirm(
        locale === "ar"
          ? "هل تريد إعادة تعيين التخصيصات إلى الإعدادات الافتراضية؟"
          : "Reset customizations to default?"
      )
    ) {
      return;
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        setCustomizations({
          ...DEFAULT_CUSTOMIZATIONS,
          primaryColor: getDefaultPrimaryColor(),
        });
        toast.success(
          locale === "ar" ? "تم إعادة التعيين بنجاح" : "Reset successfully"
        );
      },
      onError: () => {
        toast.error(
          locale === "ar" ? "فشل إعادة التعيين" : "Failed to reset"
        );
      },
    });
  };

  const applyColorPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    setCustomizations({
      ...customizations,
      primaryColor: preset.primary,
      // Only update secondary color if not Sky template
      ...(isSkyTemplate ? {} : { secondaryColor: preset.secondary }),
    });
  };

  if (isCheckingAccess || isLoadingCustomizations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium">
            {locale === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isPro) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mb-6 transition-colors"
          >
            <i className="material-symbols-outlined !text-[20px] group-hover:-translate-x-1 transition-transform">
              {locale === "ar" ? "arrow_forward" : "arrow_back"}
            </i>
            {locale === "ar" ? "رجوع للإعدادات" : "Back to Settings"}
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="material-symbols-outlined text-white !text-[32px]">
                palette
              </i>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {locale === "ar"
                  ? `تخصيص قالب ${templateType === "sky" ? "Sky" : "Neon"}`
                  : `Customize ${templateType === "sky" ? "Sky" : "Neon"} Template`}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {locale === "ar"
                  ? "قم بتخصيص الألوان والنصوص لقائمتك"
                  : "Customize colors and texts for your menu"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="xl:col-span-2 space-y-6">
            {/* Color Presets */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center">
                  <i className="material-symbols-outlined text-teal-600 dark:text-teal-400 !text-[24px]">
                    format_color_fill
                  </i>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {locale === "ar" ? "الألوان الجاهزة" : "Color Presets"}
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {COLOR_PRESETS.map((preset) => {
                  const isActive = customizations.primaryColor === preset.primary;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => applyColorPreset(preset)}
                      className={`group p-4 rounded-xl border-2 transition-all text-start relative ${isActive
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md"
                        }`}
                    >
                      {isActive && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                          <i className="material-symbols-outlined text-white !text-[16px]">
                            check
                          </i>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-lg shadow-md"
                          style={{ backgroundColor: preset.primary }}
                        />
                        {!isSkyTemplate && (
                          <div
                            className="w-8 h-8 rounded-lg shadow-md"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {preset.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center">
                  <i className="material-symbols-outlined text-purple-600 dark:text-purple-400 !text-[24px]">
                    colorize
                  </i>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {locale === "ar" ? "الألوان المخصصة" : "Custom Colors"}
                </h2>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <i className="material-symbols-outlined !text-[18px]">looks_one</i>
                    {locale === "ar" ? "اللون الأساسي" : "Primary Color"}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={customizations.primaryColor}
                        onChange={(e) =>
                          setCustomizations({
                            ...customizations,
                            primaryColor: e.target.value,
                          })
                        }
                        className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                      />
                    </div>
                    <input
                      type="text"
                      value={customizations.primaryColor}
                      onChange={(e) =>
                        setCustomizations({
                          ...customizations,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder={isSkyTemplate ? "#2196F3" : "#14b8a6"}
                    />
                  </div>
                </div>

                {!isSkyTemplate && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <i className="material-symbols-outlined !text-[18px]">looks_two</i>
                      {locale === "ar" ? "اللون الثانوي" : "Secondary Color"}
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={customizations.secondaryColor}
                          onChange={(e) =>
                            setCustomizations({
                              ...customizations,
                              secondaryColor: e.target.value,
                            })
                          }
                          className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                        />
                      </div>
                      <input
                        type="text"
                        value={customizations.secondaryColor}
                        onChange={(e) =>
                          setCustomizations({
                            ...customizations,
                            secondaryColor: e.target.value,
                          })
                        }
                        className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        placeholder="#06b6d4"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Text Customizations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center">
                  <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 !text-[24px]">
                    title
                  </i>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {locale === "ar" ? "النصوص" : "Texts"}
                </h2>
              </div>
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <span className="text-xl">🇸🇦</span>
                    {locale === "ar" ? "العنوان بالعربية" : "Title (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={customizations.heroTitleAr}
                    onChange={(e) =>
                      setCustomizations({
                        ...customizations,
                        heroTitleAr: e.target.value,
                      })
                    }
                    className="form-input"
                    dir="rtl"
                    placeholder="استكشف قائمتنا"
                  />
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <span className="text-xl">🇸🇦</span>
                    {locale === "ar" ? "الوصف بالعربية" : "Subtitle (Arabic)"}
                  </label>
                  <textarea
                    value={customizations.heroSubtitleAr}
                    onChange={(e) =>
                      setCustomizations({
                        ...customizations,
                        heroSubtitleAr: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    dir="rtl"
                    placeholder="اختر من مجموعة متنوعة من الأطباق اللذيذة"
                  />
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <span className="text-xl">🇺🇸</span>
                    {locale === "ar" ? "العنوان بالإنجليزية" : "Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={customizations.heroTitleEn}
                    onChange={(e) =>
                      setCustomizations({
                        ...customizations,
                        heroTitleEn: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="Explore Our Menu"
                  />
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <span className="text-xl">🇺🇸</span>
                    {locale === "ar" ? "الوصف بالإنجليزية" : "Subtitle (English)"}
                  </label>
                  <textarea
                    value={customizations.heroSubtitleEn}
                    onChange={(e) =>
                      setCustomizations({
                        ...customizations,
                        heroSubtitleEn: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    placeholder="Choose from a variety of delicious dishes"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border-2 border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl font-bold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                >
                  {updateMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      {locale === "ar" ? "جاري الحفظ..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <i className="material-symbols-outlined !text-[24px]">save</i>
                      {locale === "ar" ? "حفظ التغييرات" : "Save Changes"}
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={deleteMutation.isPending}
                  className="px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <i className="material-symbols-outlined !text-[20px]">restart_alt</i>
                  {locale === "ar" ? "إعادة تعيين" : "Reset"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="xl:sticky xl:top-8 xl:h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
                <div className="flex items-center gap-3">
                  <i className="material-symbols-outlined text-white !text-[28px]">
                    visibility
                  </i>
                  <h2 className="text-xl font-bold text-white">
                    {locale === "ar" ? "معاينة مباشرة" : "Live Preview"}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <div
                  className="rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-inner"
                  style={{ backgroundColor: customizations.backgroundColor }}
                >
                  <div className="p-8 md:p-12 text-center">
                    <div
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 shadow-md"
                      style={{
                        background: `${customizations.primaryColor}20`,
                        border: `2px solid ${customizations.primaryColor}40`,
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        style={{ color: customizations.primaryColor }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span
                        className="text-sm font-bold"
                        style={{ color: customizations.primaryColor }}
                      >
                        {locale === "ar" ? "قائمة الطعام" : "Menu Items"}
                      </span>
                    </div>

                    <h2
                      className="text-3xl md:text-4xl font-black mb-4 leading-tight"
                      style={{ color: customizations.textColor }}
                    >
                      {locale === "ar"
                        ? customizations.heroTitleAr
                        : customizations.heroTitleEn}
                    </h2>

                    <p
                      className="text-lg md:text-xl opacity-75 max-w-lg mx-auto mb-8"
                      style={{ color: customizations.textColor }}
                    >
                      {locale === "ar"
                        ? customizations.heroSubtitleAr
                        : customizations.heroSubtitleEn}
                    </p>

                    <button
                      className="px-8 py-4 rounded-2xl text-white font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
                      style={{
                        background: isSkyTemplate
                          ? customizations.primaryColor
                          : `linear-gradient(135deg, ${customizations.primaryColor}, ${customizations.secondaryColor})`,
                      }}
                    >
                      <i className="material-symbols-outlined !text-[20px]">
                        restaurant_menu
                      </i>
                      {locale === "ar" ? "عنصر من القائمة" : "Menu Item"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <i className="material-symbols-outlined text-blue-600 dark:text-blue-400 !text-[20px] mt-0.5">
                      info
                    </i>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {locale === "ar"
                        ? "المعاينة تحديثية فورية. احفظ التغييرات لتطبيقها على قائمتك."
                        : "Preview updates in real-time. Save to apply changes to your menu."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
