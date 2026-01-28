
import { useLanguage } from "../../DefaultTemplate/context";

interface HeroSectionProps {
    menuName?: string;
    menuDescription?: string;
}

export default function HeroSection({ menuName, menuDescription }: HeroSectionProps) {
    console.log();
    
    const { locale } = useLanguage();
    return (
        <section className=" min-h-[60vh] py-30 relative w-full flex items-center justify-center !overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-main)]/10 via-white to-transparent" />

            {/* Large Decorative Circles */}
            <div className="absolute top-[-10%] end-[-5%] w-[40rem] h-[40rem] bg-[var(--bg-main)]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] end-0 w-[35rem] h-[35rem] bg-[var(--bg-main)]/10 rounded-full blur-[80px]" />
            <div className="relative z-10 text-center px-4 max-w-4xl">
                <div
                >
                    <h1 className="text-4xl md:!text-6xl font-black mb-8 tracking-tighter text-[var(--bg-main)] leading-[1.1]">
                        {menuName || (locale === "ar" ? "قائمتنا" : "Our Menu")} <br /> <span className="text-[var(--bg-main)]"></span>
                    </h1>
                    <div className="w-16 h-1.5 bg-[var(--bg-main)] mx-auto mb-10 rounded-full" />
                    <p className="text-[var(--text-muted)] text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        {menuDescription || (locale === "ar" ? "استمتع بأشهى المأكولات في أجواء هادئة وألوان تبعث على الانتعاش والراحة." : "Enjoy the best food in a peaceful atmosphere and colors that inspire rejuvenation and relaxation.")}
                    </p>
                </div>
            </div>
        </section>
    )
}
