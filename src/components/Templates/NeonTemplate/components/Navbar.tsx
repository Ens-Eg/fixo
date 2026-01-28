"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, Moon, Sun, Globe } from "@/components/icons/Icons";
import { NavbarProps } from "./types";

export const Navbar: React.FC<NavbarProps> = ({ 
  menuName, 
  logo,
  primaryColor = "#14b8a6",
  secondaryColor = "#06b6d4" 
}) => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("navbar");
  const isRTL = locale === "ar";

  const NAV_ITEMS = [
    { key: "templates", path: "#templates" },

    { key: "contact", path: "#contact" },
  ];

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.toggle("dark", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  useEffect(() => {
    const onScroll = () => setIsSticky(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLanguage = () => {
    const cleanPath = pathname.replace(/^\/(ar|en)/, "") || "/";
    window.location.href = `/${locale === "ar" ? "en" : "ar"}${cleanPath}`;
  };

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
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isSticky
          ? "backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 shadow-xl"
          : "bg-transparent"
      }`}
      style={isSticky ? {
        borderBottom: `1px solid ${primaryColor}20`
      } : undefined}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="relative">
            {logo ? (
              <img
                src={logo}
                alt={menuName}
                className="w-12 h-12 rounded-lg object-contain"
              />
            ) : (
              <>
                <div 
                  className="absolute inset-0 rounded-lg blur opacity-75 group-hover:opacity-100 transition" 
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}66, ${secondaryColor}66)`
                  }}
                />
                <div 
                  className="relative px-4 py-2 rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                  }}
                >
                  <span className="text-white font-bold text-lg">{menuName}</span>
                </div>
              </>
            )}
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.key}
                href={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className={`relative text-sm font-semibold transition-all duration-300 ${
                  pathname === item.path
                    ? ""
                    : "text-slate-700 dark:text-slate-300"
                }`}
                style={pathname === item.path ? { color: primaryColor } : undefined}
                onMouseEnter={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.color = primaryColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.path) {
                    e.currentTarget.style.color = '';
                  }
                }}
              >
                {t(item.key)}
                {pathname === item.path && (
                  <span 
                    className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full" 
                    style={{
                      background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                    }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${primaryColor}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              <Globe className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>

            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${primaryColor}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
              }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              )}
            </button>
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div 
            className="lg:hidden mt-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-6 space-y-4"
            style={{
              border: `1px solid ${primaryColor}20`
            }}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.key}
                href={item.path}
                onClick={(e) => {
                  handleNavClick(e, item.path);
                  setIsOpen(false);
                }}
                className="block text-slate-800 dark:text-slate-200 font-medium transition-colors"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = primaryColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '';
                }}
              >
                {t(item.key)}
              </a>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <Globe className="w-5 h-5" />
                {t("language")}
              </button>
              <button onClick={toggleDarkMode}>
                {isDarkMode ? <Sun /> : <Moon />}
              </button>
            </div>
            <Link
              href={`/${locale}/authentication/sign-in`}
              className="block text-center rounded-xl py-3 font-semibold text-white transition-all"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {t("login")}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
