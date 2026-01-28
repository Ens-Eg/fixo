"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import GoogleAuthButton from "./GoogleAuthButton";
import { Logo } from "@/components/common/Logo";
import { ArrowLeft, ArrowRight, Moon, Sun, Globe } from "@/components/icons/Icons";

// Modern Background Component
const AuthBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div
      className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]"
      style={{
        backgroundImage: `linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
        WebkitMaskImage:
          "radial-gradient(circle at center, black 0%, transparent 80%)",
        maskImage:
          "radial-gradient(circle at center, black 0%, transparent 80%)",
      }}
    >
      <motion.div
        animate={{ y: [0, 50] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />
    </div>

    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`orb-${i}`}
        animate={{
          x: [
            Math.random() * 80 - 40 + "%",
            Math.random() * 80 - 40 + "%",
          ],
          y: [
            Math.random() * 60 - 30 + "%",
            Math.random() * 60 - 30 + "%",
          ],
          backgroundColor: ["#7c3aed", "#4f46e5", "#c026d3", "#7c3aed"],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{
          duration: 20 + i * 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute rounded-full blur-[140px] w-[400px] h-[400px] opacity-[0.1] dark:opacity-[0.15]"
      />
    ))}

    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#0d1117] to-transparent" />
  </div>
);

const SignInForm: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { login } = useAuth();
  const t = useTranslations("SignIn");
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode initialization
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      document.documentElement.classList.toggle("dark", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  // Toggle language
  const toggleLanguage = () => {
    const cleanPath = pathname.replace(/^\/(ar|en)/, "") || "/";
    window.location.href = `/${locale === "ar" ? "en" : "ar"}${cleanPath}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t("fillAllFields"));
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      toast.success(t("loginSuccess"));
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (result?.user?.role === "admin") {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}/menus`);
      }
    } catch (error: any) {
      console.error("❌ Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-white dark:bg-[#0d1117]">
      <AuthBackground />

      {/* Header with Logo and Controls */}
      <div className="relative z-10 container mx-auto px-6 py-4">
        <div className="flex items-center justify-between ">
          <Link href={`/${locale}`}>
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle language"
              className="w-9 h-9 flex items-center justify-center rounded-full font-bold text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
            >
              <Globe size={18} />
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-full font-bold text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/20 transition-all border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Back Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all font-semibold text-sm flex-row-reverse"
              >
                <ArrowIcon size={16} className="rtl:rotate-180" />
                <span>{locale === "ar" ? "العودة" : "Back"}</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 flex items-center justify-center h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Welcome Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-block px-5 py-2 rounded-full bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold text-sm mb-6 border border-purple-100 dark:border-purple-500/30 shadow-sm">
              {locale === "ar" ? "مرحباً بك مرة أخرى 👋" : "Welcome Back 👋"}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">
              {t("title") || (locale === "ar" ? "تسجيل الدخول" : "Sign In")}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {locale === "ar"
                ? "أدخل بياناتك للوصول إلى حسابك"
                : "Enter your credentials to access your account"}
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/80 dark:bg-[#0d1117]/80 border border-purple-200/40 dark:border-purple-500/20 rounded-3xl p-8 md:p-10 shadow-2xl shadow-purple-500/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Google Sign In Button */}
              <div>
                <GoogleAuthButton mode="signin" />
              </div>

              {/* Divider */}
              <div className="flex items-center">
                <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
                <span className="px-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t("orContinueWith") || (locale === "ar" ? "أو" : "or")}
                </span>
                <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t("email") || (locale === "ar" ? "البريد الإلكتروني" : "Email")}
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 flex items-center ${
                      isRTL ? "right-0 pr-4" : "left-0 pl-4"
                    } pointer-events-none`}
                  >
                    <i className="ri-mail-line text-slate-400 dark:text-slate-500 text-xl"></i>
                  </div>
                  <input
                    type="email"
                    className={`h-14 rounded-xl text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 ${
                      isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
                    } block w-full outline-0 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-500/30 group-hover:border-slate-300 dark:group-hover:border-slate-600`}
                    placeholder={
                      t("emailPlaceholder") || "example@email.com"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t("password") || (locale === "ar" ? "كلمة المرور" : "Password")}
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 flex items-center ${
                      isRTL ? "right-0 pr-4" : "left-0 pl-4"
                    } pointer-events-none`}
                  >
                    <i className="ri-lock-password-line text-slate-400 dark:text-slate-500 text-xl"></i>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`h-14 rounded-xl text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 ${
                      isRTL ? "pr-12 pl-14" : "pl-12 pr-14"
                    } block w-full outline-0 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-500/30 group-hover:border-slate-300 dark:group-hover:border-slate-600`}
                    placeholder={
                      t("passwordPlaceholder") ||
                      (locale === "ar" ? "••••••••" : "••••••••")
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      isRTL ? "left-4" : "right-4"
                    } text-xl text-slate-400 dark:text-slate-500 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
                  >
                    <i
                      className={
                        showPassword ? "ri-eye-line" : "ri-eye-off-line"
                      }
                    ></i>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full h-14 rounded-full font-black text-white bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl shadow-purple-200 dark:shadow-purple-900/50 hover:shadow-purple-300 dark:hover:shadow-purple-800/60 disabled:shadow-none mt-8"
                disabled={loading}
              >
                <span className="flex items-center justify-center gap-2.5 text-lg">
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-2xl"></i>
                      <span>
                        {t("signingIn") ||
                          (locale === "ar"
                            ? "جاري تسجيل الدخول..."
                            : "Signing in...")}
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="ri-login-box-line text-2xl"></i>
                      <span>
                        {t("signInButton") ||
                          (locale === "ar" ? "تسجيل الدخول" : "Sign In")}
                      </span>
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                {t("noAccount") ||
                  (locale === "ar"
                    ? "ليس لديك حساب؟"
                    : "Don't have an account?")}{" "}
                <Link
                  href={`/${locale}/authentication/sign-up`}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                >
                  {t("createAccount") ||
                    (locale === "ar" ? "إنشاء حساب جديد" : "Create Account")}
                  <i className="ri-arrow-left-line rtl:rotate-180"></i>
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInForm;
