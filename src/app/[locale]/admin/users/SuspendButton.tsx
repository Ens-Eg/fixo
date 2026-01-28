"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toggleUserSuspend } from "./actions";
import toast from "react-hot-toast";

interface SuspendButtonProps {
  userId: number;
  userName: string;
  isSuspended: boolean;
  locale: string;
}

export default function SuspendButton({
  userId,
  userName,
  isSuspended,
  locale,
}: SuspendButtonProps) {
  const t = useTranslations("AdminUsers");
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await toggleUserSuspend(userId, !isSuspended, locale);
        toast.success(
          isSuspended ? "تم تفعيل المستخدم بنجاح" : "تم تعليق المستخدم بنجاح"
        );
        setShowModal(false);
      } catch (error: any) {
        console.error("Error toggling suspend:", error);
        toast.error(error.message || "حدث خطأ أثناء تحديث حالة المستخدم");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className={`font-normal inline-block transition-all rounded-md md:text-md py-[10px] px-[20px] text-white ${
          isSuspended
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{locale === "ar" ? "جاري المعالجة..." : "Processing..."}</span>
          </div>
        ) : (
          <span>{isSuspended ? t("actions.activate") : t("actions.suspend")}</span>
        )}
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-[#0c1427] rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t("confirmModal.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isSuspended ? (
                <>
                  {t("confirmModal.activateMessage")}{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {userName}
                  </span>
                  ؟
                </>
              ) : (
                <>
                  {t("confirmModal.suspendMessage")}{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {userName}
                  </span>
                  {t("confirmModal.suspendWarning")}
                </>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                {t("confirmModal.cancel")}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className={`px-4 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-50 ${
                  isSuspended
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <span>
                    {isSuspended ? t("actions.activate") : t("actions.suspend")}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
