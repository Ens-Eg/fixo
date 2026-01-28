"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { uploadImage } from "@/app/[locale]/actions/upload.actions";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from "./actions";
import { IoAddOutline, IoImageOutline, IoPencilOutline, IoSearchOutline, IoTrashOutline, IoWarningOutline, IoCheckmarkOutline, IoHourglassOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


// Define the data structure
interface Category {
  id: number;
  image?: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface CategoryFormData {
  nameAr: string;
  nameEn: string;
  image?: File | null;
  isActive: boolean;
}

const ITEMS_PER_PAGE = 5;

const CategoriesTable: React.FC = () => {
  const params = useParams();
  const menuId = params.id as string;
  const queryClient = useQueryClient();
  const t = useTranslations();
  const locale = useLocale();
  // Modal
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    nameAr: "",
    nameEn: "",
    isActive: true,
    image: null,
  });

  // Table
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // Store selected category IDs

  // Fetch categories from API (Server Action - لا يظهر في Network tab)
  const {
    data: categoriesData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", menuId],
    queryFn: async () => {

      const result = await getCategories(Number(menuId));

      return result;
    },
    enabled: !!menuId,
    retry: false, // Don't retry on 404
  });

  // Check for 404 error and redirect
  useEffect(() => {
    if (error) {
      const errorMessage = (error as Error).message || "";
      if (
        errorMessage.includes("not found") ||
        errorMessage.includes("404") ||
        errorMessage.includes("access denied") ||
        errorMessage.includes("do not have access")
      ) {
        notFound();
      }
    }
  }, [error]);

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      let imageUrl = "";



      // Upload image if selected
      if (data.image) {

        const uploadFormData = new FormData();
        uploadFormData.append("file", data.image);
        uploadFormData.append("type", "categories");



        const uploadResponse = await uploadImage(uploadFormData);



        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error || "Failed to upload image");
        }

        imageUrl = uploadResponse.data?.url || "";

      } else {
        console.log("⚠️ No image selected for category");
      }

      const categoryData = {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        imageUrl: imageUrl || undefined,
        sortOrder: 0,
      };



      const result = await createCategory(Number(menuId), categoryData);



      if (!result.success) {
        throw new Error(result.error || "Failed to create category");
      }



      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", menuId] });
      setOpen(false);
      resetForm();
      toast.success(
        t("Categories.createSuccess") || "Category created successfully!"
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
        t("Categories.saveError") ||
        "Failed to create category"
      );
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (data: { id: number; formData: CategoryFormData }) => {
      let imageUrl: string | undefined = undefined;



      // Upload image if selected
      if (data.formData.image) {

        const uploadFormData = new FormData();
        uploadFormData.append("file", data.formData.image);
        uploadFormData.append("type", "categories");



        const uploadResponse = await uploadImage(uploadFormData);



        if (!uploadResponse.success) {
          throw new Error(uploadResponse.error || "Failed to upload image");
        }

        imageUrl = uploadResponse.data?.url || "";

      } else {
        console.log("⚠️ No new image selected for category update");
      }

      const requestBody: any = {
        nameAr: data.formData.nameAr,
        nameEn: data.formData.nameEn,
        isActive: data.formData.isActive,
      };

      // Only include image if a new one was uploaded
      if (imageUrl !== undefined) {
        requestBody.imageUrl = imageUrl;
      }

      const result = await updateCategory(Number(menuId), data.id, requestBody);

      if (!result.success) {
        throw new Error(result.error || "Failed to update category");
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", menuId] });
      setOpen(false);
      resetForm();
      setEditingCategory(null);
      toast.success(
        t("Categories.updateSuccess") || "Category updated successfully!"
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
        t("Categories.saveError") ||
        "Failed to update category"
      );
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      const result = await deleteCategory(Number(menuId), categoryId);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete category");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", menuId] });
      toast.success(
        t("Categories.deleteSuccess") || "Category deleted successfully!"
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message ||
        t("Categories.deleteError") ||
        "Failed to delete category"
      );
    },
  });

  const resetForm = () => {
    setFormData({
      nameAr: "",
      nameEn: "",
      isActive: true,
      image: null,
    });
    setSelectedImages([]);
    setEditingCategory(null);
  };

  // Filter categories based on search query
  const filteredCategories = categoriesData.filter((category: Category) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      category.name?.toLowerCase().includes(searchLower) ||
      category.nameAr?.toLowerCase().includes(searchLower) ||
      category.nameEn?.toLowerCase().includes(searchLower)
    );
  });


  // Calculate the indices of the categories to show based on the current page
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentCategories = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle individual category checkbox toggle
  const handleCheckboxChange = (id: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((categoryId) => categoryId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle "select all" checkbox toggle
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCategories(
        currentCategories.map((category: Category) => category.id)
      );
    } else {
      setSelectedCategories([]);
    }
  };

  // Function to delete a category
  const handleDelete = (category: Category) => {
    const categoryName = locale === "ar"
      ? category.nameAr || category.name || ""
      : category.nameEn || category.name || "";
    const id = category.id;
    toast.custom(
      (toastInstance) => (
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <IoWarningOutline className=" !text-[20px] text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="ml-3 flex-1 rtl:mr-3 rtl:ml-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("Categories.deleteConfirm") ||
                    "Are you sure you want to delete this category?"}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {categoryName}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      toast.dismiss(toastInstance.id);
                      deleteCategoryMutation.mutate(id);
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deleteCategoryMutation.isPending}
                  >
                    {deleteCategoryMutation.isPending
                      ? locale === "ar"
                        ? "جاري الحذف..."
                        : "Deleting..."
                      : t("Categories.delete") || "Delete"}
                  </button>
                  <button
                    onClick={() => toast.dismiss(toastInstance.id)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deleteCategoryMutation.isPending}
                  >
                    {t("Categories.cancel") || "Cancel"}
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

  // upload image
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];



      // Check file size (1MB = 1 * 1024 * 1024 bytes)
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        toast.error(
          locale === "ar"
            ? "حجم الصورة يجب أن لا يتجاوز 1 ميجابايت"
            : "Image size must not exceed 1MB"
        );
        // Reset the input
        event.target.value = "";
        return;
      }


      setFormData((prev) => {
        const updated = { ...prev, image: file };

        return updated;
      });
      setSelectedImages([file]);
    } else {
      console.log("❌ No file selected");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setSelectedImages([]);
  };

  // Handle edit category
  const handleEdit = async (category: Category) => {
    try {
      // Fetch full category data with both translations
      const response = await getCategory(Number(menuId), category.id);



      // Handle different response formats
      let fullCategory: any = response;
      if (response && typeof response === 'object' && 'data' in response) {
        fullCategory = (response as any).data;
      }
      if (response && typeof response === 'object' && 'category' in response) {
        fullCategory = (response as any).category;
      }



      setEditingCategory(category);
      setFormData({
        nameAr: fullCategory.nameAr || category.nameAr || "",
        nameEn: fullCategory.nameEn || category.nameEn || "",
        isActive: fullCategory.isActive !== undefined
          ? fullCategory.isActive
          : category.isActive !== undefined
            ? category.isActive
            : true,
        image: null,
      });
      setOpen(true);
    } catch (error) {
      console.error("❌ Error fetching category details:", error);

      // Fallback: use category data from list

      setEditingCategory(category);
      setFormData({
        nameAr: category.nameAr || "",
        nameEn: category.nameEn || "",
        isActive: category.isActive !== undefined ? category.isActive : true,
        image: null,
      });
      setOpen(true);

      toast.error(
        locale === "ar"
          ? "تعذر تحميل بعض البيانات، سيتم استخدام البيانات المتاحة"
          : "Could not load some data, using available data"
      );
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();



    if (!formData.nameAr.trim() || !formData.nameEn.trim()) {
      toast.error(
        t("Categories.requiredFields") ||
        "Please enter category names in both Arabic and English"
      );
      return;
    }

    if (editingCategory) {

      updateCategoryMutation.mutate({ id: editingCategory.id, formData });
    } else {

      createCategoryMutation.mutate(formData);
    }
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "1" : value,
    }));
  };

  return (
    <>
      <div className="ENS-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md">
        <div className="ENS-card-header mb-[20px] md:mb-[25px] sm:flex items-center justify-between">
          <div className="ENS-card-title">
            <form className="relative sm:w-[265px]">
              <label className="leading-none absolute ltr:left-[13px] rtl:right-[13px] text-black dark:text-white mt-px top-1/2 -translate-y-1/2">
                <IoSearchOutline className=" !text-[20px]" />
              </label>
              <input
                type="text"
                placeholder={
                  t("Categories.searchPlaceholder") || "Search category here..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-50 h-[36px] text-xs rounded-md w-full block text-black pt-[11px] pb-[12px] ltr:pl-[38px] rtl:pr-[38px] ltr:pr-[13px] ltr:md:pr-[16px] rtl:pl-[13px] rtl:md:pl-[16px] placeholder:text-gray-500 outline-0 dark:bg-[#15203c] dark:text-white dark:border-[#15203c] dark:placeholder:text-gray-400"
              />
            </form>
          </div>

          <div className="ENS-card-subtitle mt-[15px] sm:mt-0">
            <button
              type="button"
              className="inline-block transition-all rounded-md font-medium px-[13px] py-[6px] text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <span className="inline-block relative ltr:pl-[22px] rtl:pr-[22px]">
                <IoAddOutline className=" !text-[22px] absolute ltr:-left-[4px] rtl:-right-[4px] top-1/2 -translate-y-1/2" />
                {t("Categories.addCategory") || "Add New Category"}
              </span>
            </button>
          </div>
        </div>

        <div className="ENS-card-content">
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                {t("Categories.loading") || "Loading categories..."}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">
                {t("Categories.fetchError") ||
                  "Error loading categories. Please try again."}
              </p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                {t("Categories.noCategories") || "No categories found."}
              </p>
            </div>
          ) : (
            <>
              <div className="table-responsive overflow-x-auto">
                <table className="w-full">
                  <thead className="text-black dark:text-white">
                    <tr>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                        {t("Categories.image") || "Image"}
                      </th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                        {t("Categories.name") || "Name"}
                      </th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                        {t("Categories.status") || "Status"}
                      </th>
                      <th className="font-medium ltr:text-left rtl:text-right px-[20px] py-[11px] bg-gray-50 dark:bg-[#15203c] whitespace-nowrap ltr:first:rounded-tl-md ltr:last:rounded-tr-md rtl:first:rounded-tr-md rtl:last:rounded-tl-md">
                        {t("Categories.actions") || "Actions"}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-black dark:text-white">
                    {currentCategories.map((category: Category) => (
                      <tr key={category.id}>
                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {category.image ? (
                            <Image
                              alt={locale === "ar"
                                ? category.nameAr || category.name || "Category"
                                : category.nameEn || category.name || "Category"}
                              src={category.image}
                              className="rounded-full object-cover"
                              width={50}
                              height={50}
                            />
                          ) : (
                            <div className="w-[50px] h-[50px] rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <IoImageOutline className=" !text-[20px] text-gray-400" />
                            </div>
                          )}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          {locale === "ar"
                            ? category.nameAr || category.name || "-"
                            : category.nameEn || category.name || "-"}
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <span
                            className={`px-[8px] py-[3px] inline-block ${category.isActive
                              ? "bg-primary-50 dark:bg-[#15203c] text-primary-500"
                              : "bg-danger-50 dark:bg-[#15203c] text-danger-500"
                              } rounded-sm font-medium text-xs`}
                          >
                            {category.isActive
                              ? t("Categories.active") || "Active"
                              : t("Categories.inactive") || "Inactive"}
                          </span>
                        </td>

                        <td className="ltr:text-left rtl:text-right whitespace-nowrap px-[20px] py-[15px] border-b border-gray-100 dark:border-[#172036] ltr:first:border-l ltr:last:border-r rtl:first:border-r rtl:last:border-l">
                          <div className="flex items-center gap-[9px]">
                            <div className="relative group">
                              <button
                                type="button"
                                className="text-primary-500 leading-none"
                                onClick={() => handleEdit(category)}
                              >
                                <IoPencilOutline className=" !text-[20px] text-gray-400" />
                              </button>

                              {/* Tooltip */}
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {t("Categories.edit") || "Edit"}
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                              </div>
                            </div>

                            <div className="relative group">
                              <button
                                type="button"
                                className="text-danger-500 leading-none"
                                onClick={() => handleDelete(category)}
                                disabled={deleteCategoryMutation.isPending}
                              >
                                <IoTrashOutline className=" !text-[20px] text-gray-400" />
                              </button>

                              {/* Tooltip */}
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {t("Categories.delete") || "Delete"}
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-white dark:border-[#172036] border-t-gray-800 dark:border-t-gray-800"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-[20px] py-[12px] md:py-[14px] rounded-b-md border-l border-r border-b border-gray-100 dark:border-[#172036] sm:flex sm:items-center justify-between">
                <p className="!mb-0 !text-sm">
                  {locale === "ar" ? "معروض" : "Showing"}{" "}
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredCategories.length
                  )}{" "}
                  {locale === "ar" ? "من" : "of"} {filteredCategories.length}{" "}
                  {locale === "ar" ? "نتائج" : "results"}
                </p>

                <ol className="mt-[10px] sm:mt-0">
                  <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="opacity-0">0</span>
                      <IoIosArrowForward className=" !text-[20px] left-0 right-0 absolute top-1/2 -translate-y-1/2" />
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0"
                    >
                      <button
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border ${currentPage === index + 1
                          ? "bg-primary-500 text-white"
                          : "border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500"
                          }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  <li className="inline-block mx-[2px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="w-[31px] h-[31px] block leading-[29px] relative text-center rounded-md border border-gray-100 dark:border-[#172036] transition-all hover:bg-primary-500 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="opacity-0">0</span>
                      <IoIosArrowBack className=" !text-[20px] left-0 right-0 absolute top-1/2 -translate-y-1/2" />
                    </button>
                  </li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative w-full max-w-[95vw] sm:max-w-[550px] transform overflow-hidden rounded-lg bg-white dark:bg-[#0c1427]  ltr:text-left rtl:text-right shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="ENS-card w-full bg-white dark:bg-[#0c1427] p-[15px] sm:p-[20px] md:p-[25px] rounded-md">
                <div className="ENS-card-header bg-gray-50 dark:bg-[#15203c] mb-[15px] sm:mb-[20px] md:mb-[25px] flex items-center justify-between -mx-[15px] sm:-mx-[20px] md:-mx-[25px] -mt-[15px] sm:-mt-[20px] md:-mt-[25px] p-[15px] sm:p-[20px] md:p-[25px] rounded-t-md">
                  <div className="ENS-card-title flex-1">
                    <h5 className="!mb-0 text-base sm:text-lg md:text-xl truncate ltr:pr-2 rtl:pl-2">
                      {editingCategory
                        ? t("Categories.editCategory") || "Edit Category"
                        : t("Categories.addCategory") || "Add New Category"}
                    </h5>
                  </div>

                  <div className="ENS-card-subtitle flex-shrink-0">
                    <button
                      type="button"
                      className="text-[20px] sm:text-[23px] transition-all leading-none text-black dark:text-white hover:text-primary-500"
                      onClick={() => {
                        setOpen(false);
                        resetForm();
                      }}
                    >
                      <i className="ri-close-fill"></i>
                    </button>
                  </div>
                </div>

                <div className="ENS-card-content">
                  <form onSubmit={handleSubmit}>
                    <div className="sm:grid sm:grid-cols-2 sm:gap-[20px] md:gap-[25px]">
                      <div className="mb-[15px] sm:mb-0">
                        <label className="mb-[8px] text-sm sm:text-base text-black dark:text-white font-medium block">
                          {t("Categories.nameAr") || "Name (Arabic)"}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="nameAr"
                          value={formData.nameAr}
                          onChange={handleInputChange}
                          className="h-[45px] sm:h-[50px] md:h-[55px] text-sm sm:text-base rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] sm:px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="مثال: المقبلات"
                          required
                          dir="rtl"
                        />
                      </div>

                      <div className="mb-[15px] sm:mb-0">
                        <label className="mb-[8px] text-sm sm:text-base text-black dark:text-white font-medium block">
                          {t("Categories.nameEn") || "Name (English)"}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="nameEn"
                          value={formData.nameEn}
                          onChange={handleInputChange}
                          className="h-[45px] sm:h-[50px] md:h-[55px] text-sm sm:text-base rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] sm:px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                          placeholder="E.g. Appetizers"
                          required
                        />
                      </div>

                      <div className="mb-[15px] sm:mb-0 sm:col-span-2">
                        <label className="mb-[8px] text-sm sm:text-base text-black dark:text-white font-medium block">
                          {t("Categories.status") || "Status"}
                        </label>
                        <select
                          name="isActive"
                          value={formData.isActive ? "1" : "0"}
                          onChange={handleInputChange}
                          className="h-[45px] sm:h-[50px] md:h-[55px] text-sm sm:text-base rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[12px] sm:px-[14px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500"
                        >
                          <option value="1">
                            {t("Categories.active") || "Active"}
                          </option>
                          <option value="0">
                            {t("Categories.inactive") || "Inactive"}
                          </option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 mb-[15px] sm:mb-0">
                        <label className="mb-[8px] text-sm sm:text-base text-black dark:text-white font-medium block">
                          {t("Categories.image") || "Image"}
                        </label>
                        <div id="fileUploader">
                          <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[30px] sm:py-[40px] md:py-[48px] px-[15px] sm:px-[20px] border border-gray-200 dark:border-[#172036]">
                            <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left rtl:sm:text-right">
                              <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg mb-2 sm:mb-0 ltr:sm:mr-[12px] rtl:sm:ml-[12px]">
                                <i className="ri-upload-2-line"></i>
                              </div>
                              <p className="leading-[1.5] text-sm sm:text-base">
                                <strong className="text-black dark:text-white">
                                  {t("Categories.clickToUpload") ||
                                    "Click to upload"}
                                </strong>
                                <br />{" "}
                                <span className="text-xs sm:text-sm">
                                  {t("Categories.yourFileHere") ||
                                    "your file here"}
                                </span>
                              </p>
                            </div>
                            <input
                              type="file"
                              id="fileInput"
                              key={
                                open ? "file-input-open" : "file-input-closed"
                              }
                              accept="image/*"
                              onChange={handleFileChange}
                              className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                            />
                          </div>

                          {/* Image Previews */}
                          <div className="mt-[8px] sm:mt-[10px] flex flex-wrap gap-2">
                            {selectedImages.map((image, index) => (
                              <div
                                key={index}
                                className="relative w-[70px] h-[70px] sm:w-[80px] sm:h-[80px]"
                              >
                                <Image
                                  src={URL.createObjectURL(image)}
                                  alt="product-preview"
                                  width={80}
                                  height={80}
                                  className="rounded-md object-cover w-full h-full"
                                />
                                <button
                                  type="button"
                                  className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[22px] h-[22px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px] hover:bg-orange-600 transition-colors"
                                  onClick={handleRemoveImage}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-[15px] sm:mt-[20px] md:mt-[25px] flex flex-col sm:flex-row gap-2 sm:gap-0 ltr:sm:justify-end rtl:sm:justify-start">
                      <button
                        type="button"
                        className="w-full sm:w-auto rounded-md inline-block transition-all font-medium ltr:sm:mr-[15px] rtl:sm:ml-[15px] px-[26.5px] py-[12px] bg-danger-500 text-white hover:bg-danger-400 disabled:opacity-50"
                        onClick={() => {
                          setOpen(false);
                          resetForm();
                        }}
                        disabled={createCategoryMutation.isPending}
                      >
                        {locale === "ar" ? "ألغاء" : "Cancel"}
                      </button>

                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-block bg-primary-500 text-white py-[12px] px-[26.5px] transition-all rounded-md hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          createCategoryMutation.isPending ||
                          updateCategoryMutation.isPending
                        }
                      >
                        <span className="inline-block relative ltr:pl-[25px] rtl:pr-[25px]">
                          <span className="absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2">
                            {createCategoryMutation.isPending ||
                              updateCategoryMutation.isPending
                              ? <IoHourglassOutline className="!text-[20px]" />
                              : editingCategory
                                ? <IoCheckmarkOutline className="!text-[20px]" />
                                : <IoAddOutline className="!text-[20px]" />}
                          </span>
                          {createCategoryMutation.isPending ||
                            updateCategoryMutation.isPending
                            ? editingCategory
                              ? t("Categories.updating") || "Updating..."
                              : t("Categories.creating") || "Creating..."
                            : editingCategory
                              ? t("Categories.update") || "Update"
                              : t("Categories.create") || "Create"}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CategoriesTable;
