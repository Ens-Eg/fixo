import { useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import MenuCategoryButton from "./Components/MenuCategoryButton";
import { useLanguage } from '../DefaultTemplate/context';


interface Category {
    id: number;
    name?: string;
    nameAr?: string;
    image?: string | null;
    isGray?: boolean;
}




function SwiperCategory({ categories, activeCategory, setActiveCategory, children, isGray = false }: { categories: Category[], activeCategory: number, setActiveCategory: (id: number) => void, children: React.ReactNode, isGray?: boolean }) {
    const { direction, } = useLanguage();
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isScrollingRef = useRef<boolean>(false);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'center',
        containScroll: 'keepSnaps',

        dragFree: true,
        direction: direction === 'rtl' ? 'rtl' : 'ltr',
    });

    useEffect(() => {
        if (emblaApi) {
            emblaApi.reInit({ direction: direction === 'rtl' ? 'rtl' : 'ltr' });
        }
    }, [emblaApi, direction]);

    // Scroll embla carousel to active category
    useEffect(() => {
        if (emblaApi) {
            const activeIndex = categories.findIndex(cat => cat.id === activeCategory);
            if (activeIndex !== -1) {
                emblaApi.scrollTo(activeIndex, true); // true for smooth scroll
            }
        }
    }, [emblaApi, activeCategory, categories]);

    // Handle category click with scroll
    const handleCategoryClick = (categoryId: number) => {
        setActiveCategory(categoryId);
        isScrollingRef.current = true;

        if (categoryId === 0) {
            // Scroll to top of the menu section
            const menuSection = document.querySelector('section.relative.w-full');
            if (menuSection) {
                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Scroll to the specific category section
            const element = document.getElementById(`category-${categoryId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Reset scrolling flag after animation
        setTimeout(() => {
            isScrollingRef.current = false;
        }, 1000);
    };

    useEffect(() => {
      handleCategoryClick(activeCategory);
    }, [activeCategory, handleCategoryClick]);

    // Intersection Observer for scroll spy
    useEffect(() => {
        // Clean up previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            // Don't update active category if user is manually scrolling via click
            if (isScrollingRef.current) {
                return;
            }

            // Find the entry that is most visible
            let mostVisibleEntry: IntersectionObserverEntry | null = null;
            let maxRatio = 0;

            for (const entry of entries) {
                if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    mostVisibleEntry = entry;
                }
            }

            if (mostVisibleEntry !== null) {
                const targetElement = mostVisibleEntry.target as HTMLElement;
                const categoryId = targetElement.id.replace('category-', '');
                const categoryIdNumber = parseInt(categoryId, 10);

                if (!isNaN(categoryIdNumber) && categoryIdNumber !== activeCategory) {
                    setActiveCategory(categoryIdNumber);
                }
            }
        };

        observerRef.current = new IntersectionObserver(
            observerCallback,
            {
                rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the middle portion of viewport
                threshold: [0, 0.25, 0.5, 0.75, 1]
            }
        );

        // Observe all category sections
        categories.forEach((category) => {
            if (category.id !== 0) { // Skip "View All" category
                const element = document.getElementById(`category-${category.id}`);
                if (element && observerRef.current) {
                    observerRef.current.observe(element);
                }
            }
        });

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [categories, activeCategory, setActiveCategory]);

    return (
        <div className={`mb-20 sticky  z-50 text-black ${isGray ? 'bg-white/20 backdrop-blur-sm lg:top-[100px] top-[60px] ' : 'bg-white lg:top-[80px] top-[60px] '} `}>
            <div className="overflow-hidden py-5 px-5  " ref={emblaRef}>
                <div className="flex gap-4" style={{ direction: direction }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SwiperCategory
