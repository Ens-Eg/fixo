"use client"
import { useState } from "react";
import { MenuItem, TemplateProps } from "../types";
import Navbar from "./Components/Navbar";
import { globalStylesSky } from "../DefaultTemplate/styles";
import { LanguageProvider } from "../DefaultTemplate/context";
import HeroSection from "./Components/HeroSection";
import SwiperCategory from "./SwiperCategory";
import MenuCard from "./Components/MenuCard";
import Footer from "./Components/Footer";
import MenuCategoryButton from "./Components/MenuCategoryButton";
import { useLocale } from "next-intl";
import AdVBanner from "./Components/AdVBanner";

export default function SkyTemplate({ menuData }: TemplateProps) {



    const editedCategories = [...menuData.categories || []]
    const [activeCategory, setActiveCategory] = useState<number>(0);

    const locale = useLocale();

    const itemsByCategory = new Map()

    menuData.items.forEach((item) => {
        const { categoryId } = item

        if (!itemsByCategory.has(categoryId)) {
            itemsByCategory.set(categoryId, {
                categoryId,
                items: []
            })
        }

        itemsByCategory.get(categoryId).items.push(item)
    })
    // Always show all categories for scroll spy to work, but filter items based on activeCategory
    const allCategoriesArray = Array.from(itemsByCategory.values());

    const primaryColor =
        menuData?.customizations?.primaryColor || '#2196F3';

    const globalStyle = globalStylesSky.replace(
        /(--bg-main:\s*)([^;]+)(;)/,
        `$1${primaryColor}$3`
    );


    const customizationsHeroTitle = locale === "ar" ? menuData?.customizations?.heroTitleAr : menuData?.customizations?.heroTitleEn;
    const customizationsHeroSubtitle = locale === "ar" ? menuData?.customizations?.heroSubtitleAr : menuData?.customizations?.heroSubtitleEn;
    const title = customizationsHeroTitle || menuData?.menu?.name;
    const subtitle = customizationsHeroSubtitle || menuData?.menu?.description;

    console.log(menuData);
    return (
        <>

            <LanguageProvider>


                <div className="min-h-screen  bg-white text-[var(--text-main)]">
                    <style jsx global>{globalStyle}</style>
                    {menuData?.customizations ?
                        <HeroSection
                            menuName={title}
                            menuDescription={subtitle}

                        />
                        : <div className="mt-20"></div>}
                    <AdVBanner
                        ads={menuData.ads || []}
                    />
                    <section className="relative w-full  -mt-20 py-24 px-6 md:px-12 bg-white rounded-t-[5rem] shadow-[0_-20px_50px_-20px_rgba(14,165,233,0.05)]">
                        <div className="max-w-7xl mx-auto relative z-10">

                            {/* Category Filter - Sky Blue Style */}
                            <SwiperCategory categories={editedCategories} activeCategory={activeCategory} setActiveCategory={setActiveCategory}>
                                {editedCategories.map((category) => (
                                    <div key={category.id} className="flex-none">
                                        <MenuCategoryButton
                                            category={{
                                                ...category,
                                                image: category.image === null ? undefined : category.image
                                            }}
                                            isActive={category.id === activeCategory}
                                            onClick={() => setActiveCategory(category.id as number)}
                                        />
                                    </div>
                                ))}
                            </SwiperCategory>

                            {/* Menu Grid */}

                            {allCategoriesArray.map((category) => (
                                <div
                                    id={`category-${category.categoryId}`}
                                    className="mb-20 scroll-mt-32"
                                    key={category.categoryId}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {category.items.map((item: MenuItem, index: number) => (
                                            <MenuCard key={item.id} item={item} index={index} currency={menuData?.menu?.currency || "SAR"} onClick={() => { }} />
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <Navbar
                                whatsapp={menuData?.menu?.socialWhatsapp}
                                menuName={menuData?.menu?.name}
                                menuLogo={menuData?.menu?.logo}
                                categories={editedCategories}
                            />
                        </div>
                    </section>
                    <Footer
                        menuName={menuData?.menu?.name}
                        menuLogo={menuData?.menu?.logo}
                        footerLogo={menuData?.menu?.footerLogo}
                        footerDescriptionEn={menuData?.menu?.footerDescriptionEn || ""}
                        footerDescriptionAr={menuData?.menu?.footerDescriptionAr || ""}
                        addressEn={menuData?.menu?.addressEn || ""}
                        addressAr={menuData?.menu?.addressAr || ""}
                        phone={menuData?.menu?.phone}
                        socialFacebook={menuData?.menu?.socialFacebook}
                        socialInstagram={menuData?.menu?.socialInstagram}
                        socialTwitter={menuData?.menu?.socialTwitter}
                        socialWhatsapp={menuData?.menu?.socialWhatsapp}
                        workingHours={menuData?.menu?.workingHours}
                    />
                </div>
            </LanguageProvider>
        </>
    )
}
