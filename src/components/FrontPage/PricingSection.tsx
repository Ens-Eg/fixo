"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Star, Sparkles } from "@/components/icons/Icons";
import { useState, useEffect } from "react";
import { getPublicPlans } from "@/app/[locale]/actions";
import { IoCheckmarkOutline, IoChatbubbleOutline } from "react-icons/io5";

interface Plan {
  id: number;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  maxMenus: number;
  maxProductsPerMenu: number;
  allowCustomDomain: boolean;
  hasAds: boolean;
  features: string[];
}

const PricingSection = () => {
  const t = useTranslations("Landing.pricing");
  const locale = useLocale();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to generate features from plan data
  const generateFeatures = (plan: Plan): string[] => {
    const features: string[] = [];

    // Add menus feature
    if (plan.maxMenus === -1) {
      features.push(locale === "ar" ? "منيو غير محدود" : "Unlimited Menus");
    } else {
      features.push(
        locale === "ar"
          ? `${plan.maxMenus} ${plan.maxMenus === 1 ? "منيو" : "منيو"}`
          : `${plan.maxMenus} ${plan.maxMenus === 1 ? "Menu" : "Menus"}`,
      );
    }

    // Add products feature
    if (plan.maxProductsPerMenu === -1) {
      features.push(
        locale === "ar"
          ? "منتجات غير محدودة لكل منيو"
          : "Unlimited Products per Menu",
      );
    } else {
      features.push(
        locale === "ar"
          ? `${plan.maxProductsPerMenu} منتج لكل منيو`
          : `${plan.maxProductsPerMenu} Products per Menu`,
      );
    }

    // Add ads feature
    if (!plan.hasAds) {
      features.push(locale === "ar" ? "بدون إعلانات" : "No Ads");
    }

    return features;
  };

  // Fetch plans (Server Action - لا يظهر في Network tab)
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const result = await getPublicPlans();
        if (result.success && result.plans) {
          setPlans(result.plans);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Generate plans with dynamic features from maxMenus and maxProductsPerMenu
  const activePlans =
    plans.length > 0
      ? plans.map((plan, index) => ({
          name: plan.name,
          originalPrice: "",
          price: plan.priceMonthly.toString(),
          isFree: plan.priceMonthly === 0 && plan.priceYearly === 0,
          features: generateFeatures(plan),
          enterpriseCta: t("packages.0.enterpriseCta"),
          isEnterprise: false,
          isComingSoon: false,
        }))
      : Array.from({ length: 2 }).map((_, i) => ({
          name: t(`packages.${i}.name`),
          originalPrice: t(`packages.${i}.originalPrice`),
          price: t(`packages.${i}.price`),
          isFree: i === 0,
          features: Array.from({ length: 5 }).map((_, f) =>
            t(`packages.${i}.features.${f}`),
          ),
          enterpriseCta: t(`packages.${i}.enterpriseCta`),
          isEnterprise: false,
          isComingSoon: false,
        }));

  // Add Customize card
  const customizeCard = {
    name: locale === "ar" ? "مُخصّص" : "Customize",
    originalPrice: "",
    price: "",
    isFree: false,
    features:
      plans.length > 2
        ? generateFeatures(plans[2])
        : Array.from({ length: 6 }).map((_, f) =>
            t(`packages.2.features.${f}`),
          ),
    enterpriseCta:
      t("packages.2.enterpriseCta") ||
      (locale === "ar" ? "اطلب عرض سعر" : "Request Quote"),
    isEnterprise: true,
    isComingSoon: false,
  };

  const packages = [...activePlans, customizeCard];

  return (
    <section
      id="packages"
      className="relative py-20 md:py-32 overflow-hidden
      bg-gray-50 dark:bg-[#0d1117]"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-24 left-1/4 w-[420px] h-[420px]
          bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[140px]"
        />
        <div
          className="absolute bottom-0 right-1/4 w-[420px] h-[420px]
          bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[140px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold
            text-gray-900 dark:text-gray-50"
          >
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300">
            {t("description")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {loading ? (
            <div className="col-span-3 text-center py-20">
              <div className="inline-block rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {t("loading") || "جاري التحميل..."}
              </p>
            </div>
          ) : (
            packages.map((pkg, index) => {
              const isPopular = index === 1;
              const isEnterprise = pkg.isEnterprise || false;
              const isComingSoon = pkg.isComingSoon || false;
              const isFree = pkg.isFree || false;

              return (
                <div
                  key={index}
                  className={`relative rounded-3xl p-8
                backdrop-blur-xl transition-all duration-500
                border
                ${
                  isComingSoon
                    ? "bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-900/10 dark:to-purple-800/10 border-purple-300/50 dark:border-purple-500/30"
                    : isPopular
                      ? "bg-white/80 dark:bg-[#0d1117]/80 border-purple-500/60 shadow-2xl shadow-purple-500/30 scale-[1.06] z-10"
                      : isEnterprise
                        ? "bg-gradient-to-br from-purple-50/90 to-white/90 dark:from-purple-900/20 dark:to-[#0d1117]/90 border-purple-400/60 dark:border-purple-400/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30"
                        : "bg-white/70 dark:bg-[#0d1117]/70 border-purple-200/40 dark:border-purple-500/20 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20"
                }`}
                >
                  {/* Popular badge */}
                  {isPopular && !isComingSoon && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <div
                        className="flex items-center gap-2 px-5 py-2
                      rounded-full text-sm font-bold text-white
                      bg-gradient-to-r from-purple-600 to-purple-700
                      shadow-lg shadow-purple-500/40"
                      >
                        <Star className="w-4 h-4 fill-current" />
                        {t("mostPopular")}
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {/* Enterprise badge */}
                  {isEnterprise && !isPopular && !isComingSoon && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <div
                        className="flex items-center gap-2 px-5 py-2
                      rounded-full text-sm font-bold text-purple-700 dark:text-purple-300
                      bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700
                      shadow-lg shadow-purple-500/30"
                      >
                        <Sparkles className="w-4 h-4" />
                        {locale === "ar" ? "الحل الشامل" : "Complete Solution"}
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {/* Coming Soon badge */}
                  {isComingSoon && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <div
                        className="flex items-center gap-2 px-5 py-2
                      rounded-full text-sm font-bold text-purple-700 dark:text-purple-300
                      bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700
                      shadow-lg shadow-purple-500/30"
                      >
                        <Sparkles className="w-4 h-4" />
                        {locale === "ar" ? "قريباً" : "Coming Soon"}
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {/* Name */}
                  <h3
                    className={`mt-4 text-2xl font-bold
                  ${
                    isComingSoon
                      ? "text-purple-600 dark:text-purple-400"
                      : isEnterprise
                        ? "bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
                        : "text-purple-800 dark:text-purple-300"
                  }`}
                  >
                    {pkg.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-6 mb-8">
                    {pkg.originalPrice && !isEnterprise && (
                      <span className="block text-gray-400 line-through text-lg">
                        {pkg.originalPrice} درهم
                      </span>
                    )}

                    <div className="flex items-end gap-2">
                      <span
                        className={`text-5xl font-extrabold
                      ${
                        isComingSoon
                          ? "text-purple-400 dark:text-purple-500"
                          : "bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent"
                      }`}
                      >
                        {isComingSoon
                          ? "- -"
                          : isEnterprise
                            ? t("contactUs")
                            : isFree
                              ? locale === "ar"
                                ? "مجاني"
                                : "Free"
                              : pkg.price}
                      </span>

                      {!isEnterprise && !isComingSoon && !isFree && (
                        <span className="text-gray-500 dark:text-gray-400">
                          درهم / {locale === "ar" ? "شهرياً" : "monthly"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-10">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 min-w-[24px] rounded-full
                        bg-purple-100 dark:bg-purple-500/20
                        inline-flex items-center justify-center leading-none"
                        >
                          <IoCheckmarkOutline className="text-purple-600 dark:text-purple-400 !text-[14px] !leading-none" />
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    size="lg"
                    className={`w-full font-semibold transition-all duration-300
                  ${
                    isComingSoon
                      ? "bg-purple-200/50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 cursor-not-allowed opacity-75"
                      : isPopular
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:scale-105 shadow-lg shadow-purple-500/40"
                        : isEnterprise
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:scale-105 shadow-lg shadow-purple-500/40"
                          : "border border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                  }`}
                    asChild={!isComingSoon}
                    disabled={isComingSoon}
                  >
                    {isComingSoon ? (
                      <span>{pkg.enterpriseCta}</span>
                    ) : isEnterprise ? (
                      <a
                        href="https://wa.me/201xxxxxxxxx?text=أريد%20الاستفسار%20عن%20الباقة%20المخصصة"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <IoChatbubbleOutline className="!text-[20px]" />
                        {pkg.enterpriseCta}
                      </a>
                    ) : (
                      <a href={`/${locale}/authentication/sign-in`}>
                        {pkg.enterpriseCta}
                      </a>
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
