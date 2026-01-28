"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "next-intl";
import SignUpForm from "@/components/Authentication/SignUpForm";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // إذا المستخدم مسجل دخول بالفعل، نحوله حسب role
    if (!loading && user) {
      if (user.role === "admin") {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}/menus`);
      }
    }
  }, [user, loading, router, locale]);

  // عرض شاشة تحميل أثناء فحص حالة المصادقة
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0d1117]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // إذا المستخدم مسجل دخول، لا نعرض محتوى الصفحة
  if (user) {
    return null;
  }

  return <SignUpForm />;
}
