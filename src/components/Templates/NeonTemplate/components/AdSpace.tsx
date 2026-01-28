"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { X } from "@/components/icons/Icons";
import { AdSpaceProps, GlobalAd } from "./types";

// Gradient colors for ads display
const gradientColors = [
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-indigo-500 to-blue-500",
  "from-teal-500 to-cyan-500",
];

export const AdSpace: React.FC<AdSpaceProps> = ({
  position,
  menuId,
  ownerPlanType,
  primaryColor = "#14b8a6",
  secondaryColor = "#06b6d4",
}) => {
  const [currentAd, setCurrentAd] = useState(0);
  const [isClosed, setIsClosed] = useState(false);
  const [ads, setAds] = useState<GlobalAd[]>([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const locale = useLocale();

  // Check if owner is on free plan (show ads only for free users)
  const isOwnerFreePlan = ownerPlanType === "free" || !ownerPlanType;

  // Fetch ads based on owner plan type
  useEffect(() => {
    if (isOwnerFreePlan) {
      // Free users: fetch global ads
      fetchGlobalAds();
    } else if (menuId) {
      // Pro users: fetch menu-specific custom ads
      fetchCustomAds();
    } else {
      setLoadingAds(false);
    }
  }, [isOwnerFreePlan, menuId]);

  const fetchGlobalAds = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(
        `${apiUrl}/public/ads?position=banner&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        const fetchedAds = data.data?.ads || [];

        setAds(fetchedAds);
      } else {
        console.warn("Failed to fetch global ads:", response.status);
      }
    } catch (error) {
      console.error("Error fetching global ads:", error);
    } finally {
      setLoadingAds(false);
    }
  };

  const fetchCustomAds = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(
        `${apiUrl}/public/menu/${menuId}/ads?position=banner&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        const fetchedAds = data.data?.ads || [];

        setAds(fetchedAds);
      } else {
        console.warn("Failed to fetch custom ads:", response.status);
      }
    } catch (error) {
      console.error("Error fetching custom ads:", error);
    } finally {
      setLoadingAds(false);
    }
  };

  // Auto-rotate ads
  useEffect(() => {
    if (ads.length > 1 && !isClosed) {
      const timer = setInterval(() => {
        setCurrentAd((prev) => (prev + 1) % ads.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [ads.length, isClosed]);

  // Don't show if closed or loading
  if (isClosed || loadingAds) return null;

  // Show nothing if no ads (silently)
  if (ads.length === 0) {
    return null;
  }

  const ad = ads[currentAd];
  const title =
    locale === "ar" ? ad.titleAr || ad.title : ad.title || ad.titleAr;
  const content =
    locale === "ar" ? ad.contentAr || ad.content : ad.content || ad.contentAr;
  const bgColor = gradientColors[currentAd % gradientColors.length];

  // Track ad click
  const handleAdClick = async () => {
    if (ad.linkUrl) {
      // Track click
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        await fetch(`${apiUrl}/admin/ads/${ad.id}/click`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error tracking ad click:", error);
      }
      // Open link
      window.open(ad.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`fixed z-20 transition-all duration-500 ${
        // Desktop: side positioning
        position === "left"
          ? "xl:left-6 xl:top-1/2 xl:-translate-y-1/2 xl:w-56"
          : "xl:right-6 xl:top-1/2 xl:-translate-y-1/2 xl:w-56"
      } ${
        // Mobile: bottom positioning
        position === "left"
          ? "bottom-4 left-4 right-4 xl:left-6 xl:right-auto xl:bottom-auto xl:top-1/2 xl:-translate-y-1/2 xl:w-56"
          : "bottom-20 left-4 right-4 xl:right-6 xl:left-auto xl:bottom-auto xl:top-1/2 xl:-translate-y-1/2 xl:w-56"
      }`}
    >
      <div className="relative group cursor-pointer" onClick={handleAdClick}>
        {/* Glow effect */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-75 blur-lg group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(to right, ${primaryColor}66, ${secondaryColor}66, ${primaryColor}66)`,
          }}
        />

        <div
          className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 transition-transform duration-300"
          style={{
            borderColor: `${primaryColor}33`,
          }}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsClosed(true);
            }}
            className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full   flex items-center justify-center transition-all"
            aria-label={locale === "ar" ? "إغلاق" : "Close"}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Image */}
          <div className="relative h-48 xl:h-64 overflow-hidden">
            {ad.imageUrl ? (
              <>
                <img
                  src={ad.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-90`}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                {!ad.imageUrl && (
                  <div className="w-12 h-12 xl:w-16 xl:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl xl:text-3xl">🎯</span>
                  </div>
                )}
                <h3 className="text-white font-bold text-base xl:text-lg mb-2 drop-shadow-lg">
                  {title}
                </h3>
                <p className="text-white/90 text-xs xl:text-sm drop-shadow-md">
                  {content}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div
            className="p-3 xl:p-4"
            style={{
              background: `linear-gradient(to right, ${primaryColor}0D, ${secondaryColor}0D)`,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAdClick();
              }}
              className="w-full py-2 text-white font-semibold rounded-lg transition-all shadow-md text-sm xl:text-base"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {locale === "ar" ? "اعرف المزيد" : "Learn More"}
            </button>
          </div>

          {/* Indicators */}
          {ads.length > 1 && (
            <div className="absolute bottom-14 xl:bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentAd(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    currentAd === index
                      ? "w-8"
                      : "w-2 bg-white/50 hover:bg-white/70"
                  }`}
                  style={
                    currentAd === index
                      ? {
                          backgroundColor: primaryColor,
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
