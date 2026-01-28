"use client";

/**
 * Client Component للتفاعل فقط
 * البيانات تأتي من Server Component
 */

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getUserSubscription, toggleMenuStatus, deleteMenu } from "./actions";
import { Menu } from "@/services/api.types";
import { getMenuPublicUrl } from "@/lib/menuUrl";
import toast from "react-hot-toast";
import Image from "next/image";
import { UpgradePlanModal } from "@/components/Modals/UpgradePlanModal";
import CreateMenuModal from "./CreateMenuModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { getMenus } from "@/services/menu.service";
import { IoIosAdd, IoIosAlbums, IoIosCalendar, IoIosLink, IoIosOpen, IoIosPause, IoIosPlay, IoIosRestaurant, IoIosTrash } from "react-icons/io";

interface MenusClientProps {
  initialMenus: Menu[];
  initialSubscription: any;
  locale: string;
}

export default function MenusClient({
  initialMenus,
  initialSubscription,
  locale,
}: MenusClientProps) {
  const router = useRouter();
  const t = useTranslations("Menus");
  const [menus, setMenus] = useState(initialMenus);
  const [subscription, setSubscription] = useState(initialSubscription);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update menus when initialMenus changes (after router.refresh())
  useEffect(() => {
    if (initialMenus && Array.isArray(initialMenus)) {
      setMenus(initialMenus);
    }
  }, [initialMenus]);

  // Ensure menus is always an array
  const menusList = Array.isArray(menus) ? menus : [];

  // Fetch subscription info (Server Action - لا يظهر في Network tab)
  const fetchSubscription = useCallback(async () => {
    try {
      const result = await getUserSubscription();
      if (result) {
        setSubscription(result.subscription || result);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  }, []);

  // Fetch menus from API
  const fetchMenus = useCallback(async () => {
    try {
      const menusData = await getMenus(locale);
      if (Array.isArray(menusData)) {
        // Map the data to ensure it matches the Menu type from api.types
        const mappedMenus = menusData.map((menu: any) => ({
          ...menu,
          theme: menu.theme || "default",
        })) as Menu[];
        setMenus(mappedMenus);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  }, [locale]);

  const handleToggleStatus = async (menuId: number, currentStatus: boolean) => {
    try {
      const result = await toggleMenuStatus(menuId, !currentStatus);

      if (result) {
        // Update local state
        setMenus((prev) =>
          prev.map((menu) =>
            menu.id === menuId
              ? { ...menu, isActive: result.isActive }
              : menu
          )
        );
        toast.success(result.isActive ? t("menuActivated") : t("menuPaused"));
        // Refresh to get updated data from server
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error toggling menu status:", error);
      toast.error(error.message || t("toggleError"));
    }
  };

  const handleDelete = (menu: Menu) => {
    setMenuToDelete(menu);
  };

  const confirmDelete = async () => {
    if (!menuToDelete) return;
    try {
      setIsDeleting(true);
      await deleteMenu(menuToDelete.id);
      setMenus((prev) => prev.filter((menu) => menu.id !== menuToDelete.id));
      setMenuToDelete(null);
      fetchSubscription(); // Refresh subscription after delete
      toast.success(t("deleteSuccess") || "تم حذف القائمة بنجاح");
      router.refresh(); // Refresh to get updated data from server
    } catch (error: any) {
      console.error("Error deleting menu:", error);
      toast.error(error.message || t("deleteError") || "فشل حذف القائمة");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMenuCreated = async (newMenu?: Menu) => {
    fetchSubscription();

    // If new menu is provided, add it directly to the list immediately
    if (newMenu) {
      setMenus((prev) => {
        // Check if menu already exists to avoid duplicates
        const exists = prev.some((m) => m.id === newMenu.id);
        if (exists) return prev;
        return [...prev, newMenu];
      });
    }

    // Fetch menus from API to ensure we have the latest data
    await fetchMenus();

    // Also refresh to update server-side data
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br dark:from-gray-900 dark:via-[#0d1117] dark:to-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t("title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {t("subtitle")}
              </p>
            </div>
            <button
              onClick={() => {
                // Check if user has reached the limit (only count active menus)
                const maxMenus = subscription?.maxMenus || 1; // Default to 1 for free plan
                const currentMenuCount = menusList.filter(
                  (menu: Menu) => menu.isActive
                ).length;

                if (currentMenuCount >= maxMenus) {
                  setShowUpgradeModal(true);
                } else {
                  setShowCreateModal(true);
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl font-medium"
            >
              <IoIosAdd className="!text-[20px]" />
              {t("createMenu")}
            </button>
          </div>
        </div>
        {menusList.length === 0 ? (
          <div className="ENS-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoIosRestaurant className="text-primary-500 dark:text-primary-400 !text-[48px]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t("noMenus")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {t("getStarted")}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all font-medium shadow-lg hover:shadow-xl"
            >
              {t("createFirst")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menusList.map((menu: Menu) => (
              <div
                key={menu.id}
                className="ENS-card bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 group"
              >
                {/* Logo and Header */}
                <div className="flex items-start gap-4 mb-4">
                  {menu.logo ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-700 flex-shrink-0">
                      <Image
                        src={menu.logo}
                        alt={(locale === "ar" ? menu.nameAr : menu.nameEn) || "Menu logo"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center flex-shrink-0">

                      <IoIosRestaurant className="text-primary-500 dark:text-primary-400 !text-[32px]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {locale === "ar" ? menu.nameAr : menu.nameEn}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 ${menu.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                      >
                        {menu.isActive ? t("active") : t("inactive")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {(locale === "ar" ? menu.descriptionAr : menu.descriptionEn) || t("noDescription")}
                    </p>
                  </div>
                </div>

                {/* Menu Info */}
                <div className="mb-4 space-y-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <IoIosLink className="!text-[16px]" />
                    <span className="font-mono truncate">{menu.slug}.ensmenu.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <IoIosCalendar className="!text-[16px]" />
                    <span>{new Date(menu.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() =>
                      router.push(`/${locale}/dashboard/menus/${menu.id}`)
                    }
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <IoIosAlbums className=" !text-[18px]" />
                    {t("openDashboard")}
                  </button>
                  <button
                    onClick={() => handleToggleStatus(menu.id, menu.isActive)}
                    className={`px-4 py-2.5 ${menu.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'} rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm`}
                    title={menu.isActive ? t("pause") : t("activate")}
                  >
                    {menu.isActive ? <IoIosPause className=" !text-[18px]" /> : <IoIosPlay className=" !text-[18px]" />}
                  </button>
                  <button
                    onClick={() => handleDelete(menu)}
                    className="px-4 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all text-sm"
                    title={t("delete")}
                  >
                    <IoIosTrash className=" !text-[18px]" />
                  </button>
                </div>

                {/* View Public Link */}
                <a
                  href={getMenuPublicUrl(menu.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all text-sm font-medium border border-green-200 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700"
                >
                  <IoIosOpen className=" !text-[18px]" />
                  {t("viewPublic")}
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {menuToDelete && (
        <DeleteConfirmModal
          menu={menuToDelete}
          onClose={() => setMenuToDelete(null)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Create Menu Modal */}
      {showCreateModal && (
        <CreateMenuModal
          onClose={() => setShowCreateModal(false)}
          onMenuCreated={handleMenuCreated}
        />
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <UpgradePlanModal
          onClose={() => setShowUpgradeModal(false)}
          currentMenuCount={menusList.filter((menu: Menu) => menu.isActive).length}
          maxMenus={subscription?.maxMenus || 1}
          planName={subscription?.plan || "Free"}
        />
      )}
    </div>
  );
}
