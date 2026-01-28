import React from "react";
import { getLocale } from "next-intl/server";
import MenuClientWrapper from "./MenuClientWrapper";

export default async function PublicMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string; preview?: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const search = await searchParams;

  // Get preview theme from search params
  const previewTheme =
    search.preview === "true" && search.theme ? search.theme : null;

  return (
    <MenuClientWrapper
      slug={slug}
      locale={locale}
      initialPreviewTheme={previewTheme}
    />
  );
}
