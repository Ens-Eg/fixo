// "use client";

import Link from "next/link"
import { NavbarProps } from "../../NeonTemplate/components/types"
import { Icon } from "./Icon"
import { useTranslations } from "next-intl";
import { Icon as IconifyIcon } from "@iconify/react";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "../context";

// import React from "react";
// import { useLanguage } from "../context";
// import { Icon } from "./Icon";
// import { LanguageToggle } from "./LanguageToggle";

// // ============================
// // Navbar Component
// // ============================

// interface NavbarProps {
//   menuName: string;
//   logo?: string;
// }

// export const Navbar: React.FC<NavbarProps> = ({ menuName, logo }) => {
//   const { t, direction } = useLanguage();
//   const rtl = direction === "rtl";

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-main)]/80 backdrop-blur-xl border-b border-[var(--border-main)]/50">
//       <div className="container mx-auto px-4 py-4">
//         <div
//           className={`flex items-center justify-between ${
//             rtl ? "flex-row-reverse" : ""
//           }`}
//         >
//           {/* Logo */}
//           <a href="#" className="group flex items-center gap-2">
//             <div className="relative">
//               <div className="absolute inset-0 bg-[var(--accent)]/30 blur-xl rounded-full animate-pulse" />
//               {logo ? (
//                 <img
//                   src={logo}
//                   alt={menuName}
//                   className="relative w-10 h-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//               ) : (
//                 <Icon
//                   name="restaurant-2-line"
//                   className="relative text-[var(--text-3xl)] text-[var(--accent)] transition-transform duration-300 group-hover:scale-110"
//                 />
//               )}
//             </div>
//             <span className="text-[var(--text-2xl)] font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
//               {menuName}
//             </span>
//           </a>

//           {/* Navigation Links */}
//           <div
//             className={`hidden md:flex items-center gap-8 ${
//               rtl ? "flex-row-reverse" : ""
//             }`}
//           >
//             <a
//               href="#menu"
//               className="text-[var(--text-base)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300 relative group font-medium"
//             >
//               {t.nav.menu}
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
//             </a>
//             <a
//               href="#contact"
//               className="text-[var(--text-base)] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300 relative group font-medium"
//             >
//               {t.nav.contact}
//               <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
//             </a>
//           </div>

//           {/* Language Toggle */}
//           <div
//             className={`flex items-center gap-3 ${
//               rtl ? "flex-row-reverse" : ""
//             }`}
//           >
//             <LanguageToggle />
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

export const Navbar: React.FC<NavbarProps> = ({ menuName, logo, whatsapp }) => {
  // interface NavbarProps {
  //   menuName: string;
  //   logo?: string;
  // }
  const { t } = useLanguage();
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : null;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50  w-full flex justify-center items-center py-6 ">
      <div className="w-[90%] max-w-4xl">   <div
        className="bg-white/80 backdrop-blur-xl border border-purple-100 px-8 py-4 rounded-full flex items-center justify-between shadow-lg shadow-purple-500/5"
      >
        <div className="flex items-center gap-2 text-[var(--bg-main)] ">
          {/* <Utensils size={28} /> */}
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            {logo ? (
              <img
                src={logo}
                alt={menuName}
                className="relative w-10 h-10 rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <>
                <Icon
                  name="restaurant-2-line"
                  className="relative text-[var(--text-3xl)] transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-2xl font-black tracking-tighter">
                  {menuName}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-600">
          <Link href="/" className="hover:text-[var(--bg-main)] transition-colors flex items-center gap-1">
            <IconifyIcon icon="mynaui:home" className="text-lg" />
            <span>{t.nav.home}</span>
          </Link>

          {whatsapp &&
            <a href={whatsappUrl || ""} target="_blank" className="hover:text-[var(--bg-main)] transition-colors flex items-center gap-1">
              <IconifyIcon icon="mynaui:contact" className="text-lg" />
              <span>{t.nav.contact}</span>
            </a>
          }

        </div>
        <div className="flex items-center gap-2">

          <button
            className="bg-[var(--bg-main)] text-white  rounded-full font-bold text-sm shadow-md shadow-purple-200"
          >

            <LanguageToggle />
          </button>
        </div>
      </div></div>

    </nav>
  )
}

