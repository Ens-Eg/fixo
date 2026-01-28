"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Menu } from "@/services/api.types";
import { IoWarningOutline, IoRestaurant, IoInformationCircleOutline, IoCloseCircleOutline, IoCheckmarkCircle, IoTrashOutline } from "react-icons/io5";

interface DeleteConfirmModalProps {
  menu: Menu;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({
  menu,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  const t = useTranslations("Menus.deleteModal");
  const locale = useLocale();
  const [confirmText, setConfirmText] = useState("");
  const isConfirmValid = confirmText === "DELETE";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirmValid && !isDeleting) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="ENS-card bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <IoWarningOutline className="text-red-600 dark:text-red-400 !text-[40px]" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t("title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t("subtitle")}
          </p>
        </div>

        {/* Menu Info */}
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50">
          <div className="flex items-center gap-3 mb-2">
            {menu.logo ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-red-200 dark:border-red-800 flex-shrink-0">
                <Image
                  src={menu.logo}
                  alt={(locale === "ar" ? menu.nameAr : menu.nameEn) || "Menu logo"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 flex items-center justify-center flex-shrink-0">
                <IoRestaurant className="text-red-600 dark:text-red-400 !text-[24px]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white truncate">
                {locale === "ar" ? menu.nameAr : menu.nameEn}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate">
                {menu.slug}
              </p>
            </div>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 font-medium flex items-start gap-2">
            <IoInformationCircleOutline className="!text-[18px] mt-0.5 flex-shrink-0" />
            <span>{t("warning")}</span>
          </p>
        </div>

        {/* Confirmation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("confirmPrompt")}{" "}
              <span className="font-mono text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded">
                {t("confirmKeyword")}
              </span>{" "}
              {t("confirmText")}
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all font-mono text-center text-lg ${
                confirmText && !isConfirmValid
                  ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                  : confirmText && isConfirmValid
                  ? "border-green-300 dark:border-green-600 focus:ring-green-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
              }`}
              placeholder={t("placeholder")}
              disabled={isDeleting}
              autoFocus
            />
            {confirmText && !isConfirmValid && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <IoCloseCircleOutline className="!text-[16px]" />
                {t("errorInvalid")}
              </p>
            )}
            {isConfirmValid && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <IoCheckmarkCircle className="!text-[16px]" />
                {t("successConfirmed")}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!isConfirmValid || isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("deleting")}
                </>
              ) : (
                <>
                  <IoTrashOutline className="!text-[20px]" />
                  {t("delete")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
