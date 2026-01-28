"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useLanguage } from "../../DefaultTemplate/context";
import Image from "next/image";

// Ad interface based on the JSON structure
interface Ad {
    id: number;
    title: string;
    titleAr: string;
    content: string;
    contentAr: string;
    imageUrl: string;
    linkUrl?: string;
    position: string;
    displayOrder: number;
}

interface AdVBannerProps {
    ads: Ad[] | any[];
}

// Type guard to check if an item is a valid Ad
function isValidAd(item: any): item is Ad {
    return (
        item &&
        typeof item === "object" &&
        "id" in item &&
        "title" in item &&
        "imageUrl" in item &&
        typeof item.imageUrl === "string"
    );
}

export default function AdVBanner({ ads }: AdVBannerProps) {
    const { locale, direction } = useLanguage();
    const rtl = direction === "rtl";
    const [selectedIndex, setSelectedIndex] = useState(0);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    // Filter, validate, and sort ads by displayOrder
    const sortedAds = [...ads]
        .filter(isValidAd)
        .filter((ad) => ad.position === "banner" && ad.imageUrl)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        loop: sortedAds.length > 1,
        direction: rtl ? "rtl" : "ltr",
    });

    // Update embla direction when direction changes
    useEffect(() => {
        if (emblaApi) {
            emblaApi.reInit({ direction: rtl ? "rtl" : "ltr" });
        }
    }, [emblaApi, rtl]);

    // Handle slide selection
    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on("select", onSelect);
        onSelect(); // Set initial index

        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    // Autoplay functionality
    useEffect(() => {
        if (!emblaApi || sortedAds.length <= 1) return;

        const startAutoplay = () => {
            autoplayRef.current = setInterval(() => {
                if (emblaApi) {
                    emblaApi.scrollNext();
                }
            }, 5000);
        };

        const stopAutoplay = () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
                autoplayRef.current = null;
            }
        };

        startAutoplay();

        // Pause on hover
        const emblaNode = emblaApi.containerNode();
        emblaNode.addEventListener("mouseenter", stopAutoplay);
        emblaNode.addEventListener("mouseleave", startAutoplay);

        return () => {
            stopAutoplay();
            emblaNode.removeEventListener("mouseenter", stopAutoplay);
            emblaNode.removeEventListener("mouseleave", startAutoplay);
        };
    }, [emblaApi, sortedAds.length]);

    // If no ads, don't render
    if (sortedAds.length === 0) {
        return null;
    }

    const handleAdClick = async (ad: Ad) => {
        if (ad.linkUrl) {
            // Track click if needed
            try {
                await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/ads/${ad.id}/click`,
                    {
                        method: "POST",
                    }
                );
            } catch (error) {
                console.error("Error tracking ad click:", error);
            }
            // Open link
            window.open(ad.linkUrl, "_blank", "noopener,noreferrer");
        }
    };

    const scrollPrev = () => {
        if (emblaApi) emblaApi.scrollPrev();
    };

    const scrollNext = () => {
        if (emblaApi) emblaApi.scrollNext();
    };

    const scrollTo = (index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    };

    return (
        <section className="py-6 sm:py-8 relative overflow-hidden mb-16">
            <div className="container mx-auto px-4 sm:px-6">
                <div dir={direction} className="relative">
                    <div
                        className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
                        ref={emblaRef}
                    >
                        <div className="flex" style={{ direction: direction }}>
                            {sortedAds.map((ad) => {
                                const title =
                                    locale === "ar"
                                        ? ad.titleAr || ad.title
                                        : ad.title || ad.titleAr;
                                const content =
                                    locale === "ar"
                                        ? ad.contentAr || ad.content
                                        : ad.content || ad.contentAr;

                                return (
                                    <div
                                        key={ad.id}
                                        className="flex-[0_0_100%] min-w-0"
                                    >
                                        <div
                                            className={`relative w-full h-[300px] sm:h-[400px] md:h-[500px] cursor-pointer group ${
                                                ad.linkUrl
                                                    ? "hover:scale-[1.02] transition-transform duration-300"
                                                    : ""
                                            }`}
                                            onClick={() => handleAdClick(ad)}
                                        >
                                            {/* Background Image */}
                                            <div className="absolute inset-0">
                                                <Image
                                                    src={ad.imageUrl}
                                                    alt={title}
                                                    fill
                                                    className="object-cover"
                                                    priority
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                                                />
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                                            </div>

                                            {/* Content */}
                                            <div className={`relative z-10 h-full flex flex-col justify-center items-start p-6 sm:p-8 md:p-12 text-white ${
                                                sortedAds.length > 1 ? "pl-14 pr-14 sm:pl-16 sm:pr-16 md:pl-20 md:pr-20" : ""
                                            }`}>
                                                {/* Badge */}
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-xs sm:text-sm font-bold mb-4">
                                                    <span>
                                                        {locale === "ar"
                                                            ? "إعلان"
                                                            : "Sponsored"}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight max-w-2xl">
                                                    {title}
                                                </h3>

                                                {/* Description */}
                                                {content && (
                                                    <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 max-w-xl leading-relaxed line-clamp-3">
                                                        {content}
                                                    </p>
                                                )}

                                                {/* CTA Button */}
                                                {ad.linkUrl && (
                                                    <button
                                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold transition-all duration-300 group-hover:translate-x-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAdClick(ad);
                                                        }}
                                                    >
                                                        <span>
                                                            {locale === "ar"
                                                                ? "اعرف المزيد"
                                                                : "Learn More"}
                                                        </span>
                                                        <svg
                                                            className={`w-5 h-5 transition-transform ${
                                                                rtl
                                                                    ? "group-hover:-translate-x-1"
                                                                    : "group-hover:translate-x-1"
                                                            }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d={
                                                                    rtl
                                                                        ? "M15 19l-7-7 7-7"
                                                                        : "M9 5l7 7-7 7"
                                                                }
                                                            />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Navigation Buttons */}
                    {sortedAds.length > 1 && (
                        <>
                            <button
                                onClick={scrollPrev}
                                className={`absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 ${
                                    rtl ? "right-2 sm:right-4" : "left-2 sm:left-4"
                                }`}
                                aria-label="Previous"
                            >
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={
                                            rtl
                                                ? "M9 5l7 7-7 7"
                                                : "M15 19l-7-7 7-7"
                                        }
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={scrollNext}
                                className={`absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 ${
                                    rtl ? "left-2 sm:left-4" : "right-2 sm:right-4"
                                }`}
                                aria-label="Next"
                            >
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={
                                            rtl
                                                ? "M15 19l-7-7 7-7"
                                                : "M9 5l7 7-7 7"
                                        }
                                    />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Custom Pagination */}
                    {sortedAds.length > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            {sortedAds.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => scrollTo(index)}
                                    className={`transition-all duration-300 rounded-full ${
                                        selectedIndex === index
                                            ? "w-8 h-3 bg-white"
                                            : "w-3 h-3 bg-white/40 hover:bg-white/60"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
