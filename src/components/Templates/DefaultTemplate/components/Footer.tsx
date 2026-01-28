// "use client";

import { useMemo } from "react";
import { Branch } from "../../types";
import { useLanguage } from "../context";
import { Icon } from "./Icon";

// import React, { useMemo } from "react";
// import { useLanguage } from "../context";
// import { Icon } from "./Icon";
// import { Branch } from "../../types";
// import Image from "next/image";

// // ============================
// // Footer Component
// // ============================

// interface FooterProps {
//   menuName: string;
//   branches: Branch[];
//   menuLogo?: string;
//   footerLogo?: string;
//   footerDescriptionEn?: string;
//   footerDescriptionAr?: string;
//   socialFacebook?: string;
//   socialInstagram?: string;
//   socialTwitter?: string;
//   socialWhatsapp?: string;
//   addressEn?: string;
//   addressAr?: string;
//   phone?: string;
//   workingHours?: {
//     sunday?: { open?: string; close?: string; closed?: boolean };
//     monday?: { open?: string; close?: string; closed?: boolean };
//     tuesday?: { open?: string; close?: string; closed?: boolean };
//     wednesday?: { open?: string; close?: string; closed?: boolean };
//     thursday?: { open?: string; close?: string; closed?: boolean };
//     friday?: { open?: string; close?: string; closed?: boolean };
//     saturday?: { open?: string; close?: string; closed?: boolean };
//   };
// }

// export const Footer: React.FC<FooterProps> = ({
//   menuName,
//   branches,
//   menuLogo,
//   footerLogo,
//   footerDescriptionEn,
//   footerDescriptionAr,
//   socialFacebook,
//   socialInstagram,
//   socialTwitter,
//   socialWhatsapp,
//   addressEn,
//   addressAr,
//   phone,
//   workingHours,
// }) => {
//   const { t, direction, locale } = useLanguage();
//   const isArabic = locale === "ar";

//   // استخراج بيانات الفوتر
//   const displayLogo = footerLogo || menuLogo;
//   const footerDescription = isArabic
//     ? footerDescriptionAr
//     : footerDescriptionEn;
//   const address = isArabic ? addressAr : addressEn;

//   // تحويل مواعيد العمل إلى تنسيق قابل للعرض
//   const formatTime = (time?: string) => {
//     if (!time) return "";
//     const [hours, minutes] = time.split(":");
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? "PM" : "AM";
//     const displayHour = hour % 12 || 12;
//     return `${displayHour}:${minutes} ${ampm}`;
//   };

//   const daysOfWeek = [
//     { key: "sunday", label: isArabic ? "الأحد" : "Sunday" },
//     { key: "monday", label: isArabic ? "الإثنين" : "Monday" },
//     { key: "tuesday", label: isArabic ? "الثلاثاء" : "Tuesday" },
//     { key: "wednesday", label: isArabic ? "الأربعاء" : "Wednesday" },
//     { key: "thursday", label: isArabic ? "الخميس" : "Thursday" },
//     { key: "friday", label: isArabic ? "الجمعة" : "Friday" },
//     { key: "saturday", label: isArabic ? "السبت" : "Saturday" },
//   ];

//   const displayWorkingHours = workingHours
//     ? daysOfWeek
//         .map((day) => {
//           const dayHours = workingHours[day.key as keyof typeof workingHours];
//           if (!dayHours || dayHours.closed) {
//             return null;
//           }
//           const openTime = formatTime(dayHours.open);
//           const closeTime = formatTime(dayHours.close);
//           if (openTime && closeTime) {
//             return { day: day.label, hours: `${openTime} - ${closeTime}` };
//           }
//           return null;
//         })
//         .filter(Boolean)
//     : [];

//   // روابط السوشيال ميديا
//   const socialLinks = useMemo(() => {
//     const links = [
//       {
//         icon: "facebook-circle-line",
//         href: socialFacebook,
//         platform: "facebook",
//       },
//       {
//         icon: "instagram-line",
//         href: socialInstagram,
//         platform: "instagram",
//       },
//       {
//         icon: "twitter-x-line",
//         href: socialTwitter,
//         platform: "twitter",
//       },
//       {
//         icon: "whatsapp-fill",
//         href: socialWhatsapp
//           ? `https://wa.me/${socialWhatsapp.replace(/[^0-9]/g, "")}`
//           : null,
//         platform: "whatsapp",
//       },
//     ];
//     return links.filter((link) => link.href && link.href.trim() !== "");
//   }, [socialFacebook, socialInstagram, socialTwitter, socialWhatsapp]);

//   return (
//     <footer
//       id="contact"
//       dir={direction}
//       className="
//     relative overflow-hidden
//     bg-[var(--bg-card)]
//     border-t border-[var(--border-main)]
//    py-4 sm:py-6 md:py-10
//    pb-16 sm:pb-18 md:pb-20
//   "
//     >
//       {/* Ambient glow */}
//       <div
//         className="
//     absolute bottom-0 left-1/2 -translate-x-1/2
//     w-[420px] md:w-[720px]
//     h-[220px] md:h-[340px]
//     bg-[var(--accent)]/8
//     rounded-full blur-3xl
//     pointer-events-none
//   "
//       />

//       <div className="container mx-auto px-4 relative z-10">
//         {/* Top */}
//         <div
//           className="
//       grid grid-cols-1
//       sm:grid-cols-2
//       md:grid-cols-3
//       gap-8 sm:gap-10 md:gap-14
//       text-start
//     "
//         >
//           {/* Brand & Description */}
//           <div>
//             {displayLogo && (
//               <div className="mb-4">
//                 <Image
//                   src={displayLogo}
//                   alt={menuName}
//                   width={100}
//                   height={100}
//                   className="object-contain"
//                 />
//               </div>
//             )}
//             {footerDescription && (
//               <p
//                 className="
//           text-sm sm:text-base
//           text-[var(--text-muted)]
//           max-w-sm
//           leading-relaxed
//         "
//               >
//                 {footerDescription}
//               </p>
//             )}
//             {/* Contact Information */}
//             {(address || phone) && (
//               <div className="mt-4 space-y-3">
//                 {address && (
//                   <div
//                     className="
//             flex items-start gap-3
//             text-sm sm:text-base
//             text-[var(--text-muted)]
//             transition-colors
//             hover:text-[var(--text-main)]
//           "
//                   >
//                     <Icon
//                       name="map-pin-line"
//                       className="text-lg sm:text-xl text-[var(--accent)] mt-0.5 shrink-0"
//                     />
//                     <span dir={isArabic ? "rtl" : "ltr"}>{address}</span>
//                   </div>
//                 )}
//                 {phone && (
//                   <div
//                     className="
//             flex items-center gap-3
//             text-sm sm:text-base
//             text-[var(--text-muted)]
//             transition-colors
//             hover:text-[var(--text-main)]
//           "
//                   >
//                     <Icon
//                       name="phone-line"
//                       className="text-lg sm:text-xl text-[var(--accent)] shrink-0"
//                     />
//                     <a href={`tel:${phone}`} dir="ltr">
//                       {phone}
//                     </a>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Working Hours */}
//           {displayWorkingHours.length > 0 && (
//             <div>
//               <h4
//                 className="
//           text-base sm:text-lg
//           font-semibold
//           text-[var(--text-main)]
//           mb-4
//         "
//               >
//                 {isArabic ? "مواعيد العمل" : "Working Hours"}
//               </h4>
//               <ul className="space-y-2">
//                 {displayWorkingHours.map(
//                   (item, index) =>
//                     item && (
//                       <li
//                         key={index}
//                         className="
//             flex items-center gap-3
//             text-sm sm:text-base
//             text-[var(--text-muted)]
//           "
//                       >
//                         <Icon
//                           name="time-line"
//                           className="text-lg sm:text-xl text-[var(--accent)] shrink-0"
//                         />
//                         <span>
//                           <span className="font-medium text-[var(--text-main)]">
//                             {item.day}:
//                           </span>{" "}
//                           {item.hours}
//                         </span>
//                       </li>
//                     )
//                 )}
//               </ul>
//             </div>
//           )}

//           {/* Social Media */}
//           {socialLinks.length > 0 && (
//             <div className="sm:col-span-2 md:col-span-1">
//               <h4
//                 className="
//           text-base sm:text-lg
//           font-semibold
//           text-[var(--text-main)]
//           mb-4
//         "
//               >
//                 {t.footer.followUs}
//               </h4>

//               <div className="flex gap-3">
//                 {socialLinks.map((social, i) => (
//                   <a
//                     key={i}
//                     href={social.href || "#"}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="
//                 w-10 h-10 sm:w-11 sm:h-11
//                 rounded-full
//                 bg-[var(--bg-main)]
//                 border border-[var(--border-main)]
//                 flex items-center justify-center
//                 text-[var(--text-muted)]
//                 transition-all duration-300
//                 hover:bg-[var(--accent)]
//                 hover:border-[var(--accent)]
//                 hover:text-white
//                 hover:scale-110
//               "
//                   >
//                     <Icon name={social.icon} className="text-lg sm:text-xl" />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Bottom */}
//         <div
//           className="
//       mt-8 sm:mt-10 md:mt-12
//       pt-5 sm:pt-6
//       border-t border-[var(--border-main)]
//       text-center
//       flex flex-col items-center
//       gap-1.5
//     "
//         >
//           <p
//             dir="ltr"
//             className="
//           text-xs sm:text-sm
//           text-[var(--text-muted)]
//           leading-relaxed
//         "
//           >
//             © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
//           </p>

//           <p
//             className="
//         flex items-center justify-center
//         gap-1
//         text-xs sm:text-sm
//         text-[var(--text-muted)]
//       "
//           >
//             <span>{t.footer.designedBy}</span>
//             <a
//               href="https://www.facebook.com/ENSEGYPTEG"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="
//             font-semibold
//             text-[var(--accent)]
//             hover:underline
//             transition
//           "
//             >
//               ENS
//             </a>
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };



interface FooterProps {
  menuName: string;
  branches: Branch[];
  menuLogo?: string;
  footerLogo?: string;
  footerDescriptionEn?: string;
  footerDescriptionAr?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialWhatsapp?: string;
  addressEn?: string;
  addressAr?: string;
  phone?: string;
  workingHours?: {
    sunday?: { open?: string; close?: string; closed?: boolean };
    monday?: { open?: string; close?: string; closed?: boolean };
    tuesday?: { open?: string; close?: string; closed?: boolean };
    wednesday?: { open?: string; close?: string; closed?: boolean };
    thursday?: { open?: string; close?: string; closed?: boolean };
    friday?: { open?: string; close?: string; closed?: boolean };
    saturday?: { open?: string; close?: string; closed?: boolean };
  };
}

export const Footer: React.FC<FooterProps> = ({
  menuName,
  branches,
  menuLogo,
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
  const { locale, t } = useLanguage();
  const isArabic = locale === "ar";
  const footerDescription = isArabic
    ? footerDescriptionAr
    : footerDescriptionEn;
  const currentYear = new Date().getFullYear();


  const socialLinks = useMemo(() => {
    const links = [
      {
        icon: "facebook-circle-line",
        href: socialFacebook,
        platform: "facebook",
      },
      {
        icon: "instagram-line",
        href: socialInstagram,
        platform: "instagram",
      },
      {
        icon: "twitter-x-line",
        href: socialTwitter,
        platform: "twitter",
      },
      {
        icon: "whatsapp-fill",
        href: socialWhatsapp
          ? `https://wa.me/${socialWhatsapp.replace(/[^0-9]/g, "")}`
          : null,
        platform: "whatsapp",
      },
    ];
    return links.filter((link) => link.href && link.href.trim() !== "");
  }, [socialFacebook, socialInstagram, socialTwitter, socialWhatsapp]);

  const displayLogo = footerLogo || menuLogo;

  return (
    <footer className="py-16 bg-white border-t border-purple-50 text-center mt-20">
      <div className="flex items-center justify-center gap-2 text-purple-600 mb-8">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2 justify-center">
          {displayLogo ? (
            <img
              src={displayLogo}
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
      <p className="mb-8 text-zinc-400 font-medium">© {currentYear} {t.brand}. {t.footer.rights}</p>
      <p
        className="
        flex items-center justify-center
        gap-1
        text-xs sm:text-sm
        text-[var(--text-muted)]
      "
      >
        <span>{t.footer.designedBy}</span>
        <a
          href="https://www.facebook.com/ENSEGYPTEG"
          target="_blank"
          rel="noopener noreferrer"
          className="
            font-semibold
            text-[var(--bg-main)]
            hover:underline
            transition
          "
        >
          ENS
        </a>
      </p>
      {socialLinks.length > 0 && (
        <div>
          <h4 className="text-lg font-bold mb-4">{t.footer.followUs}</h4>
          <div className="flex justify-center gap-8">
            {socialLinks.map((social) => (
              <a key={social.platform} href={social.href || "#"} target="_blank" rel="noopener noreferrer" className="text-zinc-400 font-bold hover:text-purple-600 transition-colors relative group">
                <Icon name={social.icon} className="text-xl" />
                {social.platform}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>
      )}
    </footer>
  )
}
