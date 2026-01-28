"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ArrowLeft } from "@/components/icons/Icons";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FrontPage/Footer";

export default function PrivacyPolicyPage() {
  const t = useTranslations("TermsAndConditions.privacyPolicy");
  const t2 = useTranslations("TermsAndConditions");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-20 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-[#0a0e19] dark:via-[#0d1117] dark:to-[#0a0e1a]">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("lastUpdated")}: {t("updateDate")}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-8 md:p-12">
            {/* Introduction */}
            <div className="mb-10">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {t("intro")}
              </p>
            </div>

            {/* Privacy Policy Sections */}
            <div className="space-y-8">
              <div>
                <h2
                  className={`text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3 `}
                >
                  <span className="w-1 h-8 bg-gradient-to-b from-purple-600 to-purple-400 rounded-full"></span>
                  {t("section1.title")}
                </h2>
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-6 border border-gray-200/50 dark:border-gray-800/50">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {t("section1.subsectionA.title")}
                    </h3>
                    <ul
                      className={`list-disc list-inside space-y-2 ${isRTL ? "mr-4 ml-0" : "ml-4"}`}
                    >
                      {["name", "email", "phone", "loginData"].map((key) => (
                        <li key={key}>{t(`section1.subsectionA.${key}`)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-6 border border-gray-200/50 dark:border-gray-800/50">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {t("section1.subsectionB.title")}
                    </h3>
                    <ul
                      className={`list-disc list-inside space-y-2 ${isRTL ? "mr-4 ml-0" : "ml-4"}`}
                    >
                      {["menuData", "visits", "settings"].map((key) => (
                        <li key={key}>{t(`section1.subsectionB.${key}`)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-6 border border-gray-200/50 dark:border-gray-800/50">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {t("section1.subsectionC.title")}
                    </h3>
                    <ul
                      className={`list-disc list-inside space-y-2 ${isRTL ? "mr-4 ml-0" : "ml-4"}`}
                    >
                      {["subscriptionType", "paymentStatus"].map((key) => (
                        <li key={key}>{t(`section1.subsectionC.${key}`)}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-lg p-6 border border-gray-200/50 dark:border-gray-800/50">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {t("section1.subsectionD.title")}
                    </h3>
                    <p className="leading-relaxed">
                      {t("section1.subsectionD.content")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {t("contact.title")}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {t("contact.description")}
              </p>
              <a
                href="mailto:support@ensmenu.com"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                support@ensmenu.com
              </a>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-gray-500 dark:text-gray-500 text-sm">
            <p>{t("footerNote")}</p>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
