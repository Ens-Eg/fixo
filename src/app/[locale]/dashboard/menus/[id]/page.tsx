

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getMenu, getRecentActivity } from "@/lib/server-api";
import MenuDashboardClient from "./MenuDashboardClient";

export default async function MenuDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();

  try {
    // جلب البيانات من السيرفر
    const [menuData, recentItems] = await Promise.all([
      getMenu(id, locale).catch(() => null),
      getRecentActivity(Number(id)).catch(() => []),
    ]);

    if (!menuData || !menuData.menu) {
      redirect(`/${locale}/dashboard/menus`);
    }

    const menu = menuData.menu;
    const stats = {
      totalItems: menuData.itemsCount || 0,
      activeItems: menuData.activeItemsCount || 0,
      categories: menuData.categoriesCount || 0,
    };

    return (
      <MenuDashboardClient
        menu={menu}
        stats={stats}
        recentItems={Array.isArray(recentItems) ? recentItems : []}
        locale={locale}
      />
    );
  } catch (error) {
    console.error("Error in MenuDashboard:", error);
    redirect(`/${locale}/dashboard/menus`);
  }
}
