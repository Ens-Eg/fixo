"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  locale: string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  locale,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("AdminUsers");
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];

    // Always show first page
    if (totalPages > 0) pages.push(1);

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages.sort((a, b) => a - b);
  };

  const pages = getPageNumbers();

  return (
    <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {t("pagination.showing", {
          start: (currentPage - 1) * itemsPerPage + 1,
          end: Math.min(currentPage * itemsPerPage, totalItems),
          total: totalItems,
        })}
      </div>
      <div
        className={`flex gap-2 ${locale === "ar" ? "flex-row-reverse" : ""}`}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            currentPage === 1 || isPending
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {t("pagination.previous")}
        </button>
        
        <div className="flex gap-1">
          {pages.map((page, index) => {
            // Add ellipsis if there's a gap
            const elements = [];
            if (index > 0 && pages[index - 1] !== page - 1) {
              elements.push(
                <span
                  key={`ellipsis-${page}`}
                  className="px-2 text-gray-400 flex items-center"
                >
                  ...
                </span>
              );
            }
            
            elements.push(
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={isPending}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  currentPage === page
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {page}
              </button>
            );
            
            return elements;
          })}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            currentPage === totalPages || isPending
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {t("pagination.next")}
        </button>
      </div>
    </div>
  );
}
