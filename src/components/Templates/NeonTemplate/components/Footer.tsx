"use client";

import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { FooterProps } from "./types";
import { Logo } from "@/components/common/Logo";

export const Footer: React.FC<FooterProps> = ({
  menuName,
  branches,
  primaryColor = "#14b8a6",
  secondaryColor = "#06b6d4",
  footerLogo,
  footerDescriptionEn,
  footerDescriptionAr,
  socialFacebook,
  socialInstagram,
  socialTwitter,
  socialWhatsapp,
  addressEn,
  addressAr,
  phone,
  workingHours,
}) => {
  const t = useTranslations("Landing.footer");
  const navT = useTranslations("navbar");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const isRTL = locale === "ar";
  const isArabic = locale === "ar";

  // استخراج بيانات الفوتر
  const footerDescription = isArabic
    ? footerDescriptionAr
    : footerDescriptionEn;
  const address = isArabic ? addressAr : addressEn;

  // تحويل مواعيد العمل إلى تنسيق قابل للعرض
  const formatTime = (time?: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const daysOfWeek = [
    { key: "sunday", label: isArabic ? "الأحد" : "Sunday" },
    { key: "monday", label: isArabic ? "الإثنين" : "Monday" },
    { key: "tuesday", label: isArabic ? "الثلاثاء" : "Tuesday" },
    { key: "wednesday", label: isArabic ? "الأربعاء" : "Wednesday" },
    { key: "thursday", label: isArabic ? "الخميس" : "Thursday" },
    { key: "friday", label: isArabic ? "الجمعة" : "Friday" },
    { key: "saturday", label: isArabic ? "السبت" : "Saturday" },
  ];

  const displayWorkingHours = workingHours
    ? daysOfWeek
        .map((day) => {
          const dayHours = workingHours[day.key as keyof typeof workingHours];
          if (!dayHours || dayHours.closed) {
            return null;
          }
          const openTime = formatTime(dayHours.open);
          const closeTime = formatTime(dayHours.close);
          if (openTime && closeTime) {
            return { day: day.label, hours: `${openTime} - ${closeTime}` };
          }
          return null;
        })
        .filter(Boolean)
    : [];

  // روابط السوشيال ميديا
  const socialLinks = [
    {
      platform: "facebook",
      url: socialFacebook,
      icon: "ri-facebook-fill",
      color: "#1877F2",
    },
    {
      platform: "instagram",
      url: socialInstagram,
      icon: "ri-instagram-fill",
      color: "#E4405F",
    },
    {
      platform: "twitter",
      url: socialTwitter,
      icon: "ri-twitter-x-fill",
      color: "#1DA1F2",
    },
    {
      platform: "whatsapp",
      url: socialWhatsapp
        ? `https://wa.me/${socialWhatsapp.replace(/[^0-9]/g, "")}`
        : null,
      icon: "ri-whatsapp-fill",
      color: "#25D366",
    },
  ].filter((link) => link.url);

  const navLinks = [
    { name: navT("home"), path: "#hero" },
    { name: navT("features"), path: "#features" },
    { name: navT("templates"), path: "#templates" },
    { name: navT("pricing"), path: "#pricing" },
    { name: navT("contact"), path: "#contact" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(path);
      if (element) {
        const navbarHeight = 100;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <footer
      id="contact"
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 py-16 overflow-hidden border-t-2"
      style={{
        borderColor: `${primaryColor}20`,
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{
            backgroundColor: `${primaryColor}0D`,
          }}
        />
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
          style={{
            backgroundColor: `${secondaryColor}0D`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-lg blur opacity-50 group-hover:opacity-75 transition"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}66, ${secondaryColor}66)`,
                  }}
                />
                <div
                  className="relative p-2 rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  <div className="scale-90">
                    <Logo />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-slate-400 max-w-md mb-6 leading-relaxed text-base">
              {t("description")}
            </p>
          </div>

          <div>
            <h4
              className="text-lg font-bold mb-6"
              style={{ color: primaryColor }}
            >
              {t("quickLinks")}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className="text-slate-400 transition-all duration-300 hover:translate-x-1 inline-block text-base cursor-pointer"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "";
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-lg font-bold mb-6"
              style={{ color: primaryColor }}
            >
              {t("contactUs")}
            </h4>
            <ul className="space-y-4">
              {branches && branches.length > 0 ? (
                <>
                  <li className="flex items-center gap-3 group">
                    <span className="text-2xl">📞</span>
                    <a
                      href={`tel:${branches[0].phone}`}
                      className="text-slate-400 transition-colors text-base"
                      dir="ltr"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = primaryColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "";
                      }}
                    >
                      {branches[0].phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <span className="text-2xl">📍</span>
                    <span className="text-slate-400 text-base">
                      {branches[0].address}
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-3 group">
                    <span className="text-2xl">📞</span>
                    <a
                      href="tel:+201000000000"
                      className="text-slate-400 transition-colors text-base"
                      dir="ltr"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = primaryColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "";
                      }}
                    >
                      +20 100 000 0000
                    </a>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <span className="text-2xl">✉️</span>
                    <a
                      href="mailto:info@ens.com"
                      className="text-slate-400 transition-colors text-base"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = primaryColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "";
                      }}
                    >
                      info@ens.com
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            {footerLogo && (
              <div className="mb-4">
                <Image
                  src={footerLogo}
                  alt={menuName}
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </div>
            )}
            {footerDescription && (
              <p className="text-slate-400 mb-4 leading-relaxed text-base">
                {footerDescription}
              </p>
            )}
            {/* Contact Information */}
            {(address || phone) && (
              <div className="space-y-3">
                {address && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <p className="text-slate-400 text-base" dir={isArabic ? "rtl" : "ltr"}>
                      {address}
                    </p>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📞</span>
                    <a
                      href={`tel:${phone}`}
                      className="text-slate-400 text-base transition-colors"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = primaryColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "";
                      }}
                      dir="ltr"
                    >
                      {phone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Working Hours */}
          {displayWorkingHours.length > 0 && (
            <div>
              <h4
                className="text-lg font-bold mb-4"
                style={{ color: primaryColor }}
              >
                {isArabic ? "مواعيد العمل" : "Working Hours"}
              </h4>
              <ul className="space-y-2">
                {displayWorkingHours.map((item, index) => (
                  item && (
                    <li key={index} className="text-slate-400 text-sm">
                      <span className="font-medium text-slate-300">{item.day}:</span>{" "}
                      <span>{item.hours}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}

          {/* Social Media */}
          {socialLinks.length > 0 && (
            <div>
              <h4
                className="text-lg font-bold mb-4"
                style={{ color: primaryColor }}
              >
                {isArabic ? "تابعنا" : "Follow Us"}
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      backgroundColor: `${link.color}20`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = link.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${link.color}20`;
                    }}
                    aria-label={link.platform}
                  >
                    <i className={`${link.icon} text-xl`} style={{ color: link.color }}></i>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col items-center gap-6">
            <p className="text-slate-500 text-base md:text-lg flex items-center gap-2 font-bold">
              © {currentYear}{" "}
              <a
                href="https://www.facebook.com/ENSEGYPTEG"
                className="transition-colors hover:underline"
                style={{ color: primaryColor }}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                ENS
              </a>
              . {locale === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
