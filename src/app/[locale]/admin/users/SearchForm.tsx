"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

interface SearchFormProps {
  currentSearch?: string;
  locale: string;
}

export default function SearchForm({ currentSearch, locale }: SearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("AdminUsers");
  const [search, setSearch] = useState(currentSearch || "");
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setSearch(value);
    
    startTransition(() => {
      const params = new URLSearchParams();
      if (value) {
        params.set("search", value);
      }
      params.set("page", "1");
      
      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`);
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="form-input w-full"
      />
      {isPending && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  );
}
