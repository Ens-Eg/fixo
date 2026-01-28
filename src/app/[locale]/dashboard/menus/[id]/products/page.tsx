"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "../categories/actions";
import {
  getMenuItems,
  getMenuData,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from "./actions";
import { uploadImage } from "@/app/[locale]/actions/upload.actions";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrencyByCode } from "@/constants/currencies";
import { useToken } from "@/hooks/useToken";
import { IoAddCircleOutline, IoAddOutline, IoCheckmarkCircleOutline, IoCloseOutline, IoCloudUploadOutline, IoListOutline, IoLockClosedOutline, IoPencilOutline, IoSearchOutline, IoTrashOutline, IoWarningOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

interface MenuItem {
  id: number;
  name: string; // This comes from API based on locale
  description?: string; // This comes from API based on locale
  price: number;
  image?: string;
  categoryId?: number;
  categoryName?: string; // This comes from API based on locale
  available: boolean; // API uses 'available' not 'isAvailable'
  sortOrder: number;
  createdAt?: string;
  // Keep these for form data
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  // Support translations object format
  translations?: {
    ar?: {
      name?: string;
      description?: string;
    };
    en?: {
      name?: string;
      description?: string;
    };
  };
}

export default function ProductsPage() {
  const params = useParams();
  const t = useTranslations();
  const locale = useLocale();
  const menuId = Number(params.id);


  const [categories, setCategories] = useState<any[]>([]);
  const [notFoundError, setNotFoundError] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const productsPerPage = 10;

  // Trigger notFound() when error is detected
  if (notFoundError) {
    notFound();
  }

  // Get user data and check subscription
  const { user } = useAuth();
  const currentPlan = user?.planType?.toLowerCase() || "free";
  const isFreeUser = currentPlan === "free";

  // Fetch menu data using React Query - هنا الـ currency
  const { data: menuData } = useQuery({
    queryKey: ["menu-data", menuId, locale],
    queryFn: async () => {
      const result = await getMenuData(menuId, locale);
      return result?.menu;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });

  const menuCurrency = menuData?.currency || "SAR";

  // Fetch products using React Query
  const { data: productsData, isLoading: loadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ["menu-items", menuId, locale],
    queryFn: async () => {
      const response = await getMenuItems(menuId, locale);
      // Handle different response formats
      let items: any[] = [];
      if (response && typeof response === 'object' && 'items' in response) {
        items = Array.isArray(response.items) ? response.items : [];
      } else if (Array.isArray(response)) {
        items = response;
      } else if (response && typeof response === 'object' && 'data' in response) {
        const data = (response as any).data;
        items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      }
      return items;
    },
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });

  const products = productsData || [];

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response: any = await getCategories(menuId);

      // Handle different response formats
      let cats: any[] = [];
      if (Array.isArray(response)) {
        cats = response;
      } else if (response && typeof response === 'object' && 'categories' in response) {
        const resp = response as any;
        cats = Array.isArray(resp.categories) ? resp.categories : [];
      } else if (response && typeof response === 'object' && 'data' in response) {
        const data = (response as any).data;
        cats = Array.isArray(data?.categories) ? data.categories : Array.isArray(data) ? data : [];
      }

      setCategories(cats);
    } catch (error: any) {
      if (error.message?.includes("not found") || error.message?.includes("404")) {
        setNotFoundError(true);
      } else {
        setCategories([]);
      }
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [menuId]);

  // Handle tab switching
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setCurrentPage(1);
  };

  // Handle product deletion
  const handleDeleteProduct = async (product: MenuItem) => {
    let productName = "";

    // Support both formats: translations object and direct properties
    if (product.translations) {
      productName = locale === "ar"
        ? product.translations.ar?.name || product.name || ""
        : product.translations.en?.name || product.name || "";
    } else {
      productName = locale === "ar"
        ? product.nameAr || product.name || ""
        : product.nameEn || product.name || "";
    }

    const id = product.id;
    toast.custom(
      (toastInstance) => (
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <IoWarningOutline className=" !text-[20px] text-red-600 dark:text-red-400">
                  </IoWarningOutline>
                </div>
              </div>
              <div className="ml-3 flex-1 rtl:mr-3 rtl:ml-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("Products.deleteConfirm") ||
                    "Are you sure you want to delete this product?"}
                </p>
                {productName && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {productName}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={async () => {
                      toast.dismiss(toastInstance.id);
                      try {
                        const result = await deleteMenuItem(menuId, id);
                        if (result.success) {
                          toast.success(
                            t("Products.deleteSuccess") ||
                            "Product deleted successfully"
                          );
                          refetchProducts();
                        } else {
                          toast.error(
                            result.error ||
                            t("Products.deleteError") ||
                            "Failed to delete product"
                          );
                        }
                      } catch (error) {
                        console.error("Error deleting product:", error);
                        toast.error(
                          t("Products.deleteError") ||
                          "Failed to delete product"
                        );
                      }
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("Products.delete") || "Delete"}
                  </button>
                  <button
                    onClick={() => toast.dismiss(toastInstance.id)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t("Products.cancel") || "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity, // يبقى مفتوح حتى يختار المستخدم
        position: "top-center",
      }
    );
  };

  // Handle edit product
  const handleEditProduct = (product: MenuItem) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  // Filter products based on tab, category, and search
  const filteredProducts = (Array.isArray(products) ? products : []).filter(
    (product) => {
      // Filter by availability tab
      if (activeTab === 1 && !product.available) return false;
      if (activeTab === 2 && product.available) return false;

      // Filter by category
      if (selectedCategoryId !== "all") {
        if (product.categoryId?.toString() !== selectedCategoryId) return false;
      }

      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const nameMatch = (product.name || "")
          .toLowerCase()
          .includes(searchLower);

        // Support both formats: translations object and direct properties
        let nameArMatch = false;
        let nameEnMatch = false;

        if (product.translations) {
          nameArMatch = (product.translations.ar?.name || "")
            .toLowerCase()
            .includes(searchLower);
          nameEnMatch = (product.translations.en?.name || "")
            .toLowerCase()
            .includes(searchLower);
        } else {
          nameArMatch = (product.nameAr || "")
            .toLowerCase()
            .includes(searchLower);
          nameEnMatch = (product.nameEn || "")
            .toLowerCase()
            .includes(searchLower);
        }

        const categoryMatch = (product.categoryName || "")
          .toLowerCase()
          .includes(searchLower);

        if (!nameMatch && !nameArMatch && !nameEnMatch && !categoryMatch) return false;
      }

      return true;
    }
  );

  const searchedProducts = filteredProducts;

  // Pagination logic
  const totalPages = Math.ceil(searchedProducts.length / productsPerPage);
  const paginatedProducts = searchedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="ENS-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="ENS-tabs products-tabs" id="ENS-tabs">
          {/* Tabs */}
          <ul className="products-list-navs mb-[10px] md:mb-[15px]">
            {[
              t("Products.allProducts") || "All Products",
              t("Products.availableProducts") || "Available Products",
              t("Products.unavailableProducts") || "Unavailable Products",
            ].map((label, index) => (
              <li
                key={index}
                className="nav-item inline-block mb-[10px] ltr:mr-[11px] rtl:ml-[11px] ltr:last:mr-0 rtl:last:ml-0"
              >
                <button
                  onClick={() => handleTabClick(index)}
                  className={`nav-link block font-semibold transition-all rounded-md py-[10px] px-[22px] bg-gray-50 dark:bg-[#15203c] ${activeTab === index
                    ? "bg-primary-500 text-white"
                    : "text-black dark:text-white"
                    }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="products-tab-content">
            <div className="ENS-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between gap-3">
              <div className="ENS-card-title flex flex-col sm:flex-row gap-3 flex-1">
                {/* Search Input */}
                <form className="relative sm:w-[265px]">
                  <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                    <IoSearchOutline className=" !text-[20px]" />
                  </label>
                  <input
                    type="text"
                    placeholder={
                      t("Products.searchPlaceholder") ||
                      "Search product here..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
                  />
                </form>

                {/* Category Filter */}
                <div className="relative sm:w-[200px]">
                  <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2 pointer-events-none">
                    <IoListOutline className=" !text-[20px]" />
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] rtl:pl-[13px] outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] cursor-pointer appearance-none"
                  >
                    <option value="all">
                      {t("Products.allCategories") || "All Categories"}
                    </option>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {locale === "ar" ? cat.nameAr : cat.nameEn}
                        </option>
                      ))}
                  </select>
                  <IoIosArrowDown className=" !text-[20px] absolute ltr:right-[13px] rtl:left-[13px] top-1/2 -translate-y-1/2 text-black dark:text-white pointer-events-none" />
                </div>
              </div>

              <div className="ENS-card-subtitle mt-[15px] sm:mt-0">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                    <IoAddOutline className=" !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2" />
                    {t("Products.addNew") || "Add New Product"}
                  </span>
                </button>
              </div>
            </div>

            <div className="ENS-card-content">
              <div className="table-responsive overflow-x-auto">
                <table className="w-full">
                  <thead className="text-black dark:text-white">
                    <tr>
                      {[

                        t("Products.product") || "Product",
                        t("Products.category") || "Category",
                        t("Products.price") || "Price",
                        t("Products.status") || "Status",
                        t("Products.actions") || "Actions",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="text-black dark:text-white">
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-[40px] text-gray-500 dark:text-gray-400"
                        >
                          {t("Products.noProducts") || "No products found"}
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((product) => (
                        <tr key={product.id}>


                          <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                            <div className="flex items-center">
                              {product.image && (
                                <div className="rounded-md w-[40px]">
                                  <Image
                                    src={product.image}
                                    alt={product.name || "Product"}
                                    className="inline-block rounded-md"
                                    width={40}
                                    height={40}
                                  />
                                </div>
                              )}
                              <div
                                className={
                                  product.image
                                    ? "ltr:ml-[12px] rtl:mr-[12px]"
                                    : ""
                                }
                              >
                                <div className="font-medium text-[14px] md:text-[15px] mb-px">
                                  {(() => {
                                    // Support both formats: translations object and direct properties
                                    if (product.translations) {
                                      return locale === "ar"
                                        ? product.translations.ar?.name || product.name || ""
                                        : product.translations.en?.name || product.name || "";
                                    }
                                    return locale === "ar"
                                      ? product.nameAr || product.name || ""
                                      : product.nameEn || product.name || "";
                                  })()}
                                </div>
                                {product.description && (
                                  <div className="relative group inline-block">
                                    <span
                                      className={`block text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] ${isFreeUser ? "cursor-help" : ""
                                        }`}
                                    >
                                      {isFreeUser
                                        ? "••••••••••"
                                        : product.description}
                                    </span>
                                    {isFreeUser && (
                                      <div className="absolute hidden group-hover:block hover:block bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl p-4 z-50 w-[280px] ltr:left-0 rtl:right-0 top-full mt-2 transition-all before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                                        <div className="flex items-center gap-3 mb-2">
                                          <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <IoLockClosedOutline className=" !text-[20px] text-primary-500" />
                                          </div>
                                          <div className="flex-1">
                                            <p className="font-semibold text-sm mb-1">
                                              {locale === "ar"
                                                ? "ميزة متاحة للمشتركين"
                                                : "Premium Feature"}
                                            </p>
                                            <p className="text-xs text-gray-300">
                                              {locale === "ar"
                                                ? "اشترك لرؤية الوصف الكامل"
                                                : "Subscribe to view full descriptions"}
                                            </p>
                                          </div>
                                        </div>
                                        <Link
                                          href={`/${locale}/dashboard/profile/user-profile`}
                                          className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-xs transition-colors"
                                        >
                                          {locale === "ar"
                                            ? "اشترك الآن"
                                            : "Subscribe Now"}
                                        </Link>
                                        <div className="absolute -top-2 ltr:left-4 rtl:right-4 w-4 h-4 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                            {product.categoryName ||
                              t("Products.noCategory") ||
                              "No Category"}
                          </td>

                          <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                            {product.price?.toFixed(2) || "0.00"}{" "}
                            {getCurrencyByCode(menuCurrency)?.symbol ||
                              menuCurrency}
                          </td>

                          <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                            <span
                              className={`px-[8px] py-[3px] inline-block dark:bg-[#15203c] rounded-sm font-medium text-xs ${product.available
                                ? "bg-primary-50 text-primary-500"
                                : "bg-orange-100 text-orange-600"
                                }`}
                            >
                              {product.available
                                ? t("Products.available") || "Available"
                                : t("Products.unavailable") || "Unavailable"}
                            </span>
                          </td>

                          <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                            <div className="flex items-center gap-[9px]">
                              <button
                                type="button"
                                className="text-gray-500 dark:text-gray-400 leading-none custom-tooltip"
                                onClick={() => handleEditProduct(product)}
                                title={t("Products.edit") || "Edit"}
                              >
                                <IoPencilOutline className=" !text-[20px] text-gray-400" />
                              </button>

                              <button
                                type="button"
                                className="text-danger-500 leading-none custom-tooltip"
                                onClick={() =>
                                  handleDeleteProduct(product)
                                }
                                title={t("Products.delete") || "Delete"}
                              >
                                <IoTrashOutline className=" !text-[20px] text-danger-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {paginatedProducts.length > 0 && (
                <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
                  <p className="!mb-0 !text-sm">
                    {t("Products.showing") || "Showing"}{" "}
                    {paginatedProducts.length} {t("Products.of") || "of"}{" "}
                    {searchedProducts.length}{" "}
                    {t("Products.results") || "results"}
                  </p>

                  <ol className="mt-[10px] sm:mt-0">
                    <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="opacity-0">0</span>
                        <IoIosArrowBack className=" !text-[20px] left-0 right-0 absolute top-1/2 -translate-y-1/2" />
                      </button>
                    </li>

                    <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                      <button className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-primary-500 bg-primary-500 text-white">
                        {currentPage}
                      </button>
                    </li>

                    <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="opacity-0">0</span>
                        <IoIosArrowForward className=" !text-[20px] left-0 right-0 absolute top-1/2 -translate-y-1/2" />

                      </button>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <CreateProductModal
          menuId={menuId}
          locale={locale}
          menuCurrency={menuCurrency}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetchProducts();
          }}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <EditProductModal
          menuId={menuId}
          locale={locale}
          product={selectedProduct}
          menuCurrency={menuCurrency}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
            refetchProducts();
          }}
        />
      )}
    </>
  );
}

// Create Product Modal Component
function CreateProductModal({
  menuId,
  locale,
  menuCurrency,
  onClose,
  onSuccess,
}: {
  menuId: number;
  locale: string;
  menuCurrency: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    price: "",
    categoryId: "",
    isAvailable: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Get user data and check subscription
  const { user } = useAuth();
  const currentPlan = user?.planType?.toLowerCase() || "free";
  const isFreeUser = currentPlan === "free";

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await getCategories(menuId);

        // Handle different response formats
        let cats: any[] = [];
        if (Array.isArray(response)) {
          cats = response;
        } else if (response && typeof response === 'object' && 'categories' in response) {
          const resp = response as any;
          cats = Array.isArray(resp.categories) ? resp.categories : [];
        } else if (response && typeof response === 'object' && 'data' in response) {
          const data = (response as any).data;
          cats = Array.isArray(data?.categories) ? data.categories : Array.isArray(data) ? data : [];
        }

        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, [menuId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1MB = 1 * 1024 * 1024 bytes)
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        toast.error(
          locale === "ar"
            ? "حجم الصورة يجب أن لا يتجاوز 1 ميجابايت"
            : "Image size must not exceed 1MB"
        );
        // Reset the input
        e.target.value = "";
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.nameAr.trim() || !formData.nameEn.trim()) {
        toast.error(
          t("Products.nameRequired") ||
          "Please enter product name in both Arabic and English"
        );
        setLoading(false);
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error(
          t("Products.priceRequired") || "Please enter a valid price"
        );
        setLoading(false);
        return;
      }

      if (!formData.categoryId || formData.categoryId === "") {
        toast.error(
          t("Products.categoryRequired") ||
          "Please select a category for this product"
        );
        setLoading(false);
        return;
      }

      let imageUrl = "";

      // Upload image if selected
      if (image) {
        try {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("type", "menu-items");

          const uploadResponse = await uploadImage(formData);

          if (!uploadResponse.success) {
            throw new Error(uploadResponse.error || "Failed to upload image");
          }

          imageUrl = uploadResponse.data?.url || "";
        } catch (error: any) {
          toast.error(error.message || "حدث خطأ في رفع الصورة");
          setLoading(false);
          return;
        }
      }

      // Find selected category to get names
      const selectedCategory = categories.find(
        (cat) => cat.id === parseInt(formData.categoryId)
      );

      if (!selectedCategory) {
        toast.error(t("Products.categoryRequired") || "Category not found");
        setLoading(false);
        return;
      }

      // Create product
      const productData = {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        descriptionAr: formData.descriptionAr,
        descriptionEn: formData.descriptionEn,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        category: selectedCategory.nameAr, // للتوافق مع النسخة القديمة
        image: imageUrl,
        isAvailable: formData.isAvailable,
      };

      const result = await createMenuItem(menuId, productData);

      if (result.success) {
        toast.success(
          t("Products.createSuccess") || "Product created successfully"
        );
        onSuccess();
      } else {
        // Handle error from server action
        if (
          result.error?.includes("categoryId") ||
          result.error?.includes("category") ||
          result.error?.includes("Either categoryId or category must be provided")
        ) {
          toast.error(
            t("Products.categoryRequired") ||
            "Please select a category for this product"
          );
        } else {
          toast.error(result.error || t("Products.createError") || "Failed to create product");
        }
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast.error(error.message || t("Products.createError") || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#0c1427] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-[#15203c] px-6 py-4 border-b border-gray-200 dark:border-[#172036]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
              <IoAddCircleOutline className=" !text-[20px] text-primary-500">
              </IoAddCircleOutline>
              {t("Products.addNew") || "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <IoCloseOutline className=" !text-[28px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Product Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    {t("Products.nameAr") || "Name (Arabic)"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) =>
                      setFormData({ ...formData, nameAr: e.target.value })
                    }
                    dir="rtl"
                    placeholder="مثال: برجر دجاج"
                    className="w-full h-[50px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    {t("Products.nameEn") || "Name (English)"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder="E.g. Chicken Burger"
                    className="w-full h-[50px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              {/* Product Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    {t("Products.descriptionAr") || "Description (Arabic)"}
                    {isFreeUser && (
                      <IoLockClosedOutline className=" !text-[16px] text-orange-500 ltr:ml-1 rtl:mr-1 align-text-bottom">
                      </IoLockClosedOutline>
                    )}
                  </label>
                  <div className="relative group">
                    <textarea
                      value={formData.descriptionAr}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionAr: e.target.value,
                        })
                      }
                      disabled={isFreeUser}
                      dir="rtl"
                      rows={3}
                      placeholder={
                        isFreeUser
                          ? "متاح للمشتركين فقط"
                          : "وصف المنتج بالعربية..."
                      }
                      className={`w-full rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 py-3 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none ${isFreeUser ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    />
                    {isFreeUser && (
                      <div className="absolute hidden group-hover:block hover:block bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl p-4 z-50 w-[280px] ltr:left-0 rtl:right-0 top-full mt-2 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <IoLockClosedOutline className=" !text-[20px] text-primary-500">
                            </IoLockClosedOutline>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">
                              {locale === "ar"
                                ? "ميزة متاحة للمشتركين"
                                : "Premium Feature"}
                            </p>
                            <p className="text-xs text-gray-300">
                              {locale === "ar"
                                ? "اشترك لإضافة وصف للمنتجات"
                                : "Subscribe to add product descriptions"}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/${locale}/dashboard/profile/user-profile`}
                          className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-xs transition-colors"
                        >
                          {locale === "ar" ? "اشترك الآن" : "Subscribe Now"}
                        </Link>
                        <div className="absolute -top-2 ltr:left-4 rtl:right-4 w-4 h-4 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    {t("Products.descriptionEn") || "Description (English)"}
                    {isFreeUser && (
                      <IoLockClosedOutline className=" !text-[16px] text-orange-500 ltr:ml-1 rtl:mr-1 align-text-bottom">
                      </IoLockClosedOutline>
                    )}
                  </label>
                  <div className="relative group">
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descriptionEn: e.target.value,
                        })
                      }
                      disabled={isFreeUser}
                      rows={3}
                      placeholder={
                        isFreeUser
                          ? "Available for subscribers only"
                          : "Product description in English..."
                      }
                      className={`w-full rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 py-3 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none ${isFreeUser ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    />
                    {isFreeUser && (
                      <div className="absolute hidden group-hover:block hover:block bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl p-4 z-50 w-[280px] ltr:left-0 rtl:right-0 top-full mt-2 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <IoLockClosedOutline className=" !text-[20px] text-primary-500">
                            </IoLockClosedOutline>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm mb-1">
                              {locale === "ar"
                                ? "ميزة متاحة للمشتركين"
                                : "Premium Feature"}
                            </p>
                            <p className="text-xs text-gray-300">
                              {locale === "ar"
                                ? "اشترك لإضافة وصف للمنتجات"
                                : "Subscribe to add product descriptions"}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/${locale}/dashboard/profile/user-profile`}
                          className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-xs transition-colors"
                        >
                          {locale === "ar" ? "اشترك الآن" : "Subscribe Now"}
                        </Link>
                        <div className="absolute -top-2 ltr:left-4 rtl:right-4 w-4 h-4 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    {t("Products.price") || "Price"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full h-[50px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] pl-4 pr-16 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      {getCurrencyByCode(menuCurrency)?.symbol || menuCurrency}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    {t("Products.category") || "Category"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    required
                    className="w-full h-[50px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                  >
                    <option value="">
                      {t("Products.selectCategory") || "Select Category"}
                    </option>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {locale === "ar" ? cat.nameAr : cat.nameEn}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                  {t("Products.image") || "Product Image"}
                </label>
                <div className="relative">
                  <div className="border-2 border-dashed border-gray-300 dark:border-[#172036] rounded-lg p-6 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {imagePreview ? (
                      <div className="flex flex-col items-center gap-3">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={120}
                          height={120}
                          className="rounded-md object-cover"
                        />
                        <p className="text-sm text-primary-500 font-medium">
                          {t("Products.clickToChange") ||
                            "Click to change image"}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-[#15203c] rounded-full flex items-center justify-center">
                          <IoCloudUploadOutline className=" !text-[32px] text-primary-500">
                          </IoCloudUploadOutline>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black dark:text-white">
                            {t("Products.clickToUpload") || "Click to upload"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            PNG, JPG, WEBP (MAX. 1MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="bg-gray-50 dark:bg-[#15203c] rounded-lg p-4 border border-gray-200 dark:border-[#172036]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.isAvailable
                        ? "bg-primary-500/10"
                        : "bg-gray-200 dark:bg-[#0c1427]"
                        }`}
                    >
                      <IoCheckmarkCircleOutline className={` !text-[20px] ${formData.isAvailable
                        ? "text-primary-500"
                        : "text-gray-400"
                        }`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        {t("Products.availability") || "Product Availability"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.isAvailable
                          ? t("Products.availableForOrder") ||
                          "Available for customers to order"
                          : t("Products.unavailableForOrder") ||
                          "Hidden from customers"}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-[#0c1427] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-[#172036] mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-[50px] rounded-md border-2 border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("Products.cancel") || "Cancel"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-[50px] rounded-md bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {t("Products.creating") || "Creating..."}
                  </>
                ) : (
                  <>
                    <IoAddOutline className=" !text-[20px]" />
                    {t("Products.create") || "Create Product"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Edit Product Modal Component
function EditProductModal({
  menuId,
  locale,
  product,
  menuCurrency,
  onClose,
  onSuccess,
}: {
  menuId: number;
  locale: string;
  product: MenuItem;
  menuCurrency: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const t = useTranslations();

  // Get user data and check subscription
  const { user } = useAuth();
  const currentPlan = user?.planType?.toLowerCase() || "free";
  const isFreeUser = currentPlan === "free";

  // We need to fetch the full product data with both languages
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    price: "0",
    categoryId: "",
    isAvailable: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Fetch both product details and categories
    const fetchData = async () => {
      setLoadingData(true);


      try {
        // Fetch full product data with both translations
        const response = await getMenuItem(menuId, product.id);


        // Handle different response formats
        let fullProduct: any = response;
        if (response && typeof response === 'object' && 'data' in response) {
          fullProduct = (response as any).data;
        }
        if (response && typeof response === 'object' && 'item' in response) {
          fullProduct = (response as any).item;
        }



        // Extract data from translations object if it exists
        let nameAr = "";
        let nameEn = "";
        let descriptionAr = "";
        let descriptionEn = "";

        if (fullProduct.translations) {
          // New format with translations object
          nameAr = fullProduct.translations.ar?.name || "";
          nameEn = fullProduct.translations.en?.name || "";
          descriptionAr = fullProduct.translations.ar?.description || "";
          descriptionEn = fullProduct.translations.en?.description || "";
        } else {
          // Old format with direct properties
          nameAr = fullProduct.nameAr || "";
          nameEn = fullProduct.nameEn || "";
          descriptionAr = fullProduct.descriptionAr || "";
          descriptionEn = fullProduct.descriptionEn || "";
        }



        // Handle categoryId - might come as categoryId or need to find from category name
        let categoryIdValue = "";
        if (fullProduct.categoryId) {
          categoryIdValue = fullProduct.categoryId.toString();
        } else if (product.categoryId) {
          categoryIdValue = product.categoryId.toString();
        }

        // Update form with full data
        setFormData({
          nameAr: nameAr,
          nameEn: nameEn,
          descriptionAr: descriptionAr,
          descriptionEn: descriptionEn,
          price: fullProduct.price?.toString() || "0",
          categoryId: categoryIdValue,
          isAvailable: fullProduct.available !== undefined
            ? fullProduct.available
            : fullProduct.isActive !== undefined
              ? fullProduct.isActive
              : product.available !== undefined
                ? product.available
                : true,
        });

        setImagePreview(fullProduct.image || fullProduct.imageUrl || product.image || "");

        // Fetch categories
        const categoriesResponse = await getCategories(menuId);


        // Handle different response formats
        let cats: any[] = [];
        if (Array.isArray(categoriesResponse)) {
          cats = categoriesResponse;
        } else if (categoriesResponse && typeof categoriesResponse === 'object' && 'categories' in categoriesResponse) {
          const resp = categoriesResponse as any;
          cats = Array.isArray(resp.categories) ? resp.categories : [];
        } else if (categoriesResponse && typeof categoriesResponse === 'object' && 'data' in categoriesResponse) {
          const data = (categoriesResponse as any).data;
          cats = Array.isArray(data?.categories) ? data.categories : Array.isArray(data) ? data : [];
        }


        setCategories(cats);
      } catch (error) {
        console.error("❌ Error fetching product data:", error);

        // Fallback: use product data that we already have
        console.log("⚠️ Using fallback - product data from list:", product);

        // Extract from translations if available
        let fallbackNameAr = "";
        let fallbackNameEn = "";
        let fallbackDescAr = "";
        let fallbackDescEn = "";

        if ((product as any).translations) {
          fallbackNameAr = (product as any).translations.ar?.name || "";
          fallbackNameEn = (product as any).translations.en?.name || "";
          fallbackDescAr = (product as any).translations.ar?.description || "";
          fallbackDescEn = (product as any).translations.en?.description || "";
        } else {
          fallbackNameAr = product.nameAr || product.name || "";
          fallbackNameEn = product.nameEn || product.name || "";
          fallbackDescAr = product.descriptionAr || product.description || "";
          fallbackDescEn = product.descriptionEn || product.description || "";
        }

        setFormData({
          nameAr: fallbackNameAr,
          nameEn: fallbackNameEn,
          descriptionAr: fallbackDescAr,
          descriptionEn: fallbackDescEn,
          price: product.price?.toString() || "0",
          categoryId: product.categoryId?.toString() || "",
          isAvailable: product.available !== undefined ? product.available : true,
        });

        setImagePreview(product.image || "");

        // Try to get categories anyway
        try {
          const categoriesResponse = await getCategories(menuId);
          let cats: any[] = [];
          if (Array.isArray(categoriesResponse)) {
            cats = categoriesResponse;
          } else if (categoriesResponse && typeof categoriesResponse === 'object' && 'categories' in categoriesResponse) {
            cats = Array.isArray((categoriesResponse as any).categories) ? (categoriesResponse as any).categories : [];
          }
          setCategories(cats);
        } catch (catError) {
          console.error("❌ Error fetching categories:", catError);
        }

        toast.error(
          locale === "ar"
            ? "تعذر تحميل بعض البيانات، سيتم استخدام البيانات المتاحة"
            : "Could not load some data, using available data"
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1MB = 1 * 1024 * 1024 bytes)
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        toast.error(
          locale === "ar"
            ? "حجم الصورة يجب أن لا يتجاوز 1 ميجابايت"
            : "Image size must not exceed 1MB"
        );
        // Reset the input
        e.target.value = "";
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.nameAr.trim() || !formData.nameEn.trim()) {
        toast.error(
          t("Products.nameRequired") ||
          "Please enter product name in both Arabic and English"
        );
        setLoading(false);
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error(
          t("Products.priceRequired") || "Please enter a valid price"
        );
        setLoading(false);
        return;
      }

      if (!formData.categoryId || formData.categoryId === "") {
        toast.error(
          t("Products.categoryRequired") ||
          "Please select a category for this product"
        );
        setLoading(false);
        return;
      }

      let imageUrl = product.image || "";

      // Upload new image if selected
      if (image) {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append("file", image);
          formDataUpload.append("type", "menu-items");

          const uploadResponse = await uploadImage(formDataUpload);

          if (!uploadResponse.success) {
            throw new Error(uploadResponse.error || "Failed to upload image");
          }

          imageUrl = uploadResponse.data?.url || "";
        } catch (error: any) {
          toast.error(error.message || "حدث خطأ في رفع الصورة");
          setLoading(false);
          return;
        }
      }

      // Find selected category to get names
      const selectedCategory = categories.find(
        (cat) => cat.id === parseInt(formData.categoryId)
      );

      if (!selectedCategory) {
        toast.error(t("Products.categoryRequired") || "Category not found");
        setLoading(false);
        return;
      }

      // Update product
      const productData = {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        descriptionAr: formData.descriptionAr,
        descriptionEn: formData.descriptionEn,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        category: selectedCategory.nameAr,
        image: imageUrl,
        isAvailable: formData.isAvailable,
      };

      const result = await updateMenuItem(
        menuId,
        product.id,
        productData
      );

      if (result.success) {
        toast.success(
          t("Products.updateSuccess") || "Product updated successfully"
        );
        onSuccess();
      } else {
        // Handle error from server action
        if (
          result.error?.includes("categoryId") ||
          result.error?.includes("category") ||
          result.error?.includes("Either categoryId or category must be provided")
        ) {
          toast.error(
            t("Products.categoryRequired") ||
            "Please select a category for this product"
          );
        } else {
          toast.error(result.error || t("Products.updateError") || "Failed to update product");
        }
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message || t("Products.updateError") || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#0c1427] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-[#15203c] px-6 py-4 border-b border-gray-200 dark:border-[#172036]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
              <IoPencilOutline className=" !text-[20px] text-primary-500" />
              {t("Products.edit") || "Edit Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <IoCloseOutline className=" !text-[28px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">
                  {locale === "ar" ? "جاري تحميل البيانات..." : "Loading data..."}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Product Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                      {t("Products.nameAr") || "Name (Arabic)"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameAr}
                      onChange={(e) =>
                        setFormData({ ...formData, nameAr: e.target.value })
                      }
                      dir="rtl"
                      placeholder="مثال: برجر دجاج"
                      className="w-full h-[50px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                      {t("Products.nameEn") || "Name (English)"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameEn}
                      onChange={(e) =>
                        setFormData({ ...formData, nameEn: e.target.value })
                      }
                      placeholder="E.g. Chicken Burger"
                      className="w-full h-[50px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>

                {/* Product Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                      {t("Products.descriptionAr") || "Description (Arabic)"}
                      {isFreeUser && (
                        <IoLockClosedOutline className=" !text-[16px] text-orange-500 ltr:ml-1 rtl:mr-1 align-text-bottom">
                        </IoLockClosedOutline>
                      )}
                    </label>
                    <div className="relative group">
                      <textarea
                        value={formData.descriptionAr}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descriptionAr: e.target.value,
                          })
                        }
                        disabled={isFreeUser}
                        dir="rtl"
                        rows={3}
                        placeholder={
                          isFreeUser
                            ? "متاح للمشتركين فقط"
                            : "وصف المنتج بالعربية..."
                        }
                        className={`w-full rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 py-3 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none ${isFreeUser ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      />
                      {isFreeUser && (
                        <div className="absolute hidden group-hover:block hover:block bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl p-4 z-50 w-[280px] ltr:left-0 rtl:right-0 top-full mt-2 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <IoLockClosedOutline className=" !text-[20px] text-primary-500">
                              </IoLockClosedOutline>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm mb-1">
                                {locale === "ar"
                                  ? "ميزة متاحة للمشتركين"
                                  : "Premium Feature"}
                              </p>
                              <p className="text-xs text-gray-300">
                                {locale === "ar"
                                  ? "اشترك لإضافة وصف للمنتجات"
                                  : "Subscribe to add product descriptions"}
                              </p>
                            </div>
                          </div>
                          <Link
                            href={`/${locale}/dashboard/profile/user-profile`}
                            className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-xs transition-colors"
                          >
                            {locale === "ar" ? "اشترك الآن" : "Subscribe Now"}
                          </Link>
                          <div className="absolute -top-2 ltr:left-4 rtl:right-4 w-4 h-4 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                      {t("Products.descriptionEn") || "Description (English)"}
                      {isFreeUser && (
                        <IoLockClosedOutline className=" !text-[16px] text-orange-500 ltr:ml-1 rtl:mr-1 align-text-bottom">
                        </IoLockClosedOutline>
                      )}
                    </label>
                    <div className="relative group">
                      <textarea
                        value={formData.descriptionEn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            descriptionEn: e.target.value,
                          })
                        }
                        disabled={isFreeUser}
                        rows={3}
                        placeholder={
                          isFreeUser
                            ? "Available for subscribers only"
                            : "Product description in English..."
                        }
                        className={`w-full rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 py-3 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none ${isFreeUser ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                      />
                      {isFreeUser && (
                        <div className="absolute hidden group-hover:block hover:block bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-xl p-4 z-50 w-[280px] ltr:left-0 rtl:right-0 top-full mt-2 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <IoLockClosedOutline className=" !text-[20px] text-primary-500">
                              </IoLockClosedOutline>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm mb-1">
                                {locale === "ar"
                                  ? "ميزة متاحة للمشتركين"
                                  : "Premium Feature"}
                              </p>
                              <p className="text-xs text-gray-300">
                                {locale === "ar"
                                  ? "اشترك لإضافة وصف للمنتجات"
                                  : "Subscribe to add product descriptions"}
                              </p>
                            </div>
                          </div>
                          <Link
                            href={`/${locale}/dashboard/profile/user-profile`}
                            className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-md text-xs transition-colors"
                          >
                            {locale === "ar" ? "اشترك الآن" : "Subscribe Now"}
                          </Link>
                          <div className="absolute -top-2 ltr:left-4 rtl:right-4 w-4 h-4 bg-gray-900 dark:bg-gray-800 transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                      {t("Products.price") || "Price"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="0.00"
                        className="w-full h-[50px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] pl-4 pr-16 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                        {getCurrencyByCode(menuCurrency)?.symbol || menuCurrency}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                      {t("Products.category") || "Category"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      required
                      className="w-full h-[50px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-4 text-black dark:text-white outline-0 transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                    >
                      <option value="">
                        {t("Products.selectCategory") || "Select Category"}
                      </option>
                      {Array.isArray(categories) &&
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {locale === "ar" ? cat.nameAr : cat.nameEn}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Product Image */}
                <div>
                  <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                    {t("Products.image") || "Product Image"}
                  </label>
                  <div className="relative">
                    <div className="border-2 border-dashed border-gray-300 dark:border-[#172036] rounded-lg p-6 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {imagePreview ? (
                        <div className="flex flex-col items-center gap-3">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={120}
                            height={120}
                            className="rounded-md object-cover"
                          />
                          <p className="text-sm text-primary-500 font-medium">
                            {t("Products.clickToChange") ||
                              "Click to change image"}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-[#15203c] rounded-full flex items-center justify-center">
                            <IoCloudUploadOutline className=" !text-[32px] text-primary-500">
                            </IoCloudUploadOutline>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-black dark:text-white">
                              {t("Products.clickToUpload") || "Click to upload"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              PNG, JPG, WEBP (MAX. 1MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="bg-gray-50 dark:bg-[#15203c] rounded-lg p-4 border border-gray-200 dark:border-[#172036]">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.isAvailable
                          ? "bg-primary-500/10"
                          : "bg-gray-200 dark:bg-[#0c1427]"
                          }`}
                      >
                        <IoCheckmarkCircleOutline className={` !text-[20px] ${formData.isAvailable
                          ? "text-primary-500"
                          : "text-gray-400"
                          }`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black dark:text-white">
                          {t("Products.availability") || "Product Availability"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formData.isAvailable
                            ? t("Products.availableForOrder") ||
                            "Available for customers to order"
                            : t("Products.unavailableForOrder") ||
                            "Hidden from customers"}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="isAvailableEdit"
                        checked={formData.isAvailable}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isAvailable: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-[#0c1427] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-[#172036] mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 h-[50px] rounded-md border-2 border-gray-300 dark:border-gray-600 text-black dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("Products.cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-[50px] rounded-md bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {t("Products.updating") || "Updating..."}
                    </>
                  ) : (
                    <>
                      <IoCheckmarkCircleOutline className=" !text-[20px] text-white"/>
                      {t("Products.update") || "Update Product"}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
