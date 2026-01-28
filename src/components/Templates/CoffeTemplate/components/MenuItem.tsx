import { useLocale } from "next-intl";

interface MenuItemProps {
  id?: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: string;
  tag?: string;
  tagAr?: string;
  image?: string;
  delay?: number;
  originalPrice?: number;
  discountPercent?: number;
}

const MenuItem = ({
  id,
  name,
  nameAr,
  description,
  descriptionAr,
  price,
  tag,
  tagAr,
  image,
  delay = 0,
  originalPrice,
  discountPercent,
}: MenuItemProps) => {
  const locale = useLocale();

  // Calculate discounted price if discount exists
  const displayPrice =
    originalPrice && discountPercent
      ? `${price} (${discountPercent}% off)`
      : price;

  return (
    <div
      className="group p-4 bg-[#221D1A] rounded-lg border border-[#3B332E] hover:border-[#F2B705]/40 transition-all duration-300 animate-fade-in flex gap-4 hover:[box-shadow:0_0_40px_hsl(38_92%_50%_/_0.15)]"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Image */}
      {image && (
        <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={locale === "ar" ? nameAr : name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="font-heading text-lg md:text-xl font-medium text-[#F4EEE7] group-hover:text-[#F2B705] transition-colors">
              {locale === "ar" ? nameAr : name}
            </h3>
            {(tag || tagAr) && (
              <span className="px-2 py-1 text-xs font-medium bg-[#F2B705]/20 text-[#F2B705] rounded">
                {locale === "ar" ? tagAr : tag}
              </span>
            )}
          </div>
          {(description || descriptionAr) && (
            <p className="text-[#B6AA99] text-sm leading-relaxed">
              {locale === "ar" ? descriptionAr : description}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end shrink-0">
          {originalPrice &&
            originalPrice > parseFloat(price.replace(/[^0-9.]/g, "")) && (
              <span className="text-sm text-[#B6AA99] line-through">
                {originalPrice}
              </span>
            )}
          <span className="font-heading text-xl md:text-2xl font-semibold text-[#F2B705]">
            {displayPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
