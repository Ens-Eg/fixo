import Image from "next/image";
import { useLanguage } from "../../DefaultTemplate/context";
import { Icon } from "../../DefaultTemplate/components";

interface Category {

    id?: number;
    name?: string;
    nameAr?: string;
    image?: string;
}

interface MenuCategoryButtonProps {
    category: Category;
    isActive: boolean;
    onClick: () => void;
}

export default function MenuCategoryButton({ category, isActive, onClick }: MenuCategoryButtonProps) {
    const { locale } = useLanguage();

    return (
        <button
            className={`px-10 !h-full flex items-center relative gap-2 py-2 rounded-2xl text-sm font-black transition-all tracking-widest uppercase ${isActive
                ? 'bg-[var(--bg-main)] text-white shadow-xl shadow-[var(--bg-main)] scale-105'
                : 'bg-[var(--bg-main)]/10 text-[var(--bg-main)] hover:text-[var(--bg-main)]/80 border border-[var(--bg-main)]/20'
                }`}
            onClick={onClick}
        >
            {category.name === "View All" ? (
                <Icon name="grid-line" className="text-2xl" />
            ) : (
                <>
                </>
            )}
            {category.image && (
                <img src={category.image} alt={category.name || ""} className="w-10 border-4 border-white h-10 rounded-full object-cover" />
            )}
            {locale === "ar" ? category.nameAr || category.name : category.name}
        </button>
    )
}
