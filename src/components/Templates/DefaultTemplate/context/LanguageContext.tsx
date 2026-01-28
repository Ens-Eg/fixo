"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Locale } from "../types";
import { translations, TranslationType } from "../translations";
import { usePathname, useRouter } from "@/i18n/navigation";
import Loading from "@/app/[locale]/menu/[slug]/loading";
import { useLocale } from "next-intl";


// ============================
// Context: Language
// ============================

interface LanguageContextType {
  locale: string;
  t: TranslationType;
  direction: "rtl" | "ltr";
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

console.log('====================================');
console.log('====================================');

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const toggleLanguage = useCallback(() => {
    setLoading(true);
    const newLocale = locale === "ar" ? "en" : "ar";
    window.location.assign(
      `${location.origin}/${newLocale
      }/${pathname}/${location.search}`
    );


  }, [locale]);

  const direction = locale === "ar" ? "rtl" : "ltr";

  console.log(locale);


  const value: LanguageContextType = {
    locale,
    t: translations[locale as Locale],
    direction,
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {loading ? <Loading /> : children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }


  return context;
};

