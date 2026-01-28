"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { ArrowRight, Sparkles } from "@/components/icons/Icons";
import { QRCodeSectionProps } from "./types";

export const QRCodeSection: React.FC<QRCodeSectionProps> = ({ 
  slug,
  primaryColor = "#14b8a6",
  secondaryColor = "#06b6d4"
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [menuUrl, setMenuUrl] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Generate QR code URL for the menu (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/${locale}/menu/${slug}`;
      setMenuUrl(url);
      setQrCodeUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
      );
    }
  }, [locale, slug]);

  // Don't render until we have the URLs
  if (!menuUrl || !qrCodeUrl) {
    return null;
  }

  return (
    <section
      id="qr-code"
      className="py-24 md:py-32 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" 
          style={{
            backgroundColor: `${primaryColor}1A`
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: `${secondaryColor}1A`
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`flex flex-col ${
            isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-center gap-12 lg:gap-20`}
        >
          {/* Content */}
          <div
            className={`flex-1 text-center ${
              isRTL ? "lg:text-right" : "lg:text-left"
            }`}
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: `linear-gradient(to right, ${primaryColor}1A, ${secondaryColor}1A)`,
                border: `1px solid ${primaryColor}33`
              }}
            >
              <Sparkles className="w-4 h-4" color={primaryColor} />
              <span className="text-sm font-semibold" style={{ color: primaryColor }}>
                {locale === "ar" ? "تابعنا" : "Follow Us"}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6">
              {locale === "ar"
                ? "امسح رمز QR للوصول إلى قائمتنا"
                : "Scan QR Code to Access Our Menu"}
            </h2>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {locale === "ar"
                ? "شارك قائمتنا مع أصدقائك عن طريق مسح رمز QR هذا"
                : "Share our menu with your friends by scanning this QR code"}
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <a
                href={menuUrl}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span className="text-2xl">📱</span>
                <span>{locale === "ar" ? "عرض القائمة" : "View Menu"}</span>
                <ArrowRight
                  className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`}
                />
              </a>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div 
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-50 animate-pulse" 
                style={{
                  background: `linear-gradient(to right, ${primaryColor}66, ${secondaryColor}66, ${primaryColor}66)`
                }}
              />

              {/* QR Code Card */}
              <div 
                className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border-2"
                style={{
                  borderColor: `${primaryColor}33`
                }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    {locale === "ar" ? "امسح الكود" : "Scan Code"}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {locale === "ar"
                      ? "استخدم كاميرا هاتفك"
                      : "Use your phone camera"}
                  </p>
                </div>

                {/* QR Code Image */}
                <div className="relative bg-white p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                  <img
                    src={qrCodeUrl}
                    alt={locale === "ar" ? "رمز QR" : "QR Code"}
                    className="w-64 h-64 mx-auto"
                  />
                </div>

                {/* Instructions */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span style={{ color: primaryColor }}>1.</span>
                    <span>
                      {locale === "ar"
                        ? "افتح تطبيق الكاميرا على هاتفك"
                        : "Open your phone camera app"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span style={{ color: primaryColor }}>2.</span>
                    <span>
                      {locale === "ar"
                        ? "وجه الكاميرا نحو رمز QR"
                        : "Point camera at QR code"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span style={{ color: primaryColor }}>3.</span>
                    <span>
                      {locale === "ar"
                        ? "اضغط على الرابط الذي يظهر"
                        : "Tap the link that appears"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
