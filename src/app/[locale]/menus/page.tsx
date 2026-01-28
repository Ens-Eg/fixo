/**
 * Server Component - جلب البيانات من السيرفر
 */

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getMenus, getUserSubscription, getCurrentUser } from "@/lib/server-api";
import MenusClient from "./MenusClient";

export default async function MenusPage() {
  const locale = await getLocale();

  try {
    // جلب البيانات من السيرفر
    const [menusData, subscriptionData, userData] = await Promise.all([
      getMenus(locale).catch((err) => {
        console.error("Error fetching menus:", err);
        return [];
      }),
      getUserSubscription().catch((err) => {
        console.error("Error fetching subscription:", err);
        return null;
      }),
      getCurrentUser().catch((err) => {
        console.error("Error fetching user:", err);
        return null;
      }),
    ]);

    // التحقق من المستخدم
    if (!userData?.user) {
      redirect(`/${locale}/authentication/sign-in`);
    }

    // Redirect admin users to admin panel
    if (userData.user.role === "admin") {
      redirect(`/${locale}/admin`);
    }

    // Ensure menus is always an array
    const menus = Array.isArray(menusData) ? menusData : [];
    const subscription = subscriptionData?.subscription || subscriptionData || null;

    

    return (
      <MenusClient
        initialMenus={menus}
        initialSubscription={subscription}
        locale={locale}
      />
    );
  } catch (error) {
    console.error("Error in MenusPage:", error);
    redirect(`/${locale}/authentication/sign-in`);
  }
}
