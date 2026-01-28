"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { useLanguage } from "../../DefaultTemplate/context";
import { LanguageToggle } from "../../DefaultTemplate/components";

interface Category {
  id?: number;
  name?: string;
  nameAr?: string;
}

interface NavbarProps {
  menuName?: string;
  menuLogo?: string;
  categories?: Category[];
  whatsapp?: string;
}

const Navbar = ({ menuName, menuLogo, whatsapp }: NavbarProps) => {
  const { t } = useLanguage();
  const locale = useLocale();
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : null;




  return (
    <nav className="fixed top-0 w-full start-0 z-50 bg-[var(--bg-main)]/5 backdrop-blur-xl border-b border-[var(--bg-main)]/10">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        <div className="text-[var(--bg-main)] font-black text-2xl tracking-tighter">
          <a href="/" className="flex items-center gap-3 group">
            {menuLogo && (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src={menuLogo}
                  alt={menuName || "Logo"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span className="font-heading text-xl md:text-2xl font-semibold">
              {menuName || ""}
            </span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">
          <a href="#" className="text-[var(--bg-main)] hover:text-[var(--bg-main)]/80 transition-colors">{t.nav.home}</a>
          {whatsapp &&
            <a href={whatsappUrl || ""} target="_blank" className="text-[var(--bg-main)] hover:text-[var(--bg-main)]/80 transition-colors">{t.nav.contact}</a>
          }
        </div>
        <div className="flex  gap-2">


          <button className="bg-[var(--bg-main)] text-white  rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[var(--bg-main)]/80 transition-all shadow-lg shadow-[var(--bg-main)]/10">
            <LanguageToggle />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
