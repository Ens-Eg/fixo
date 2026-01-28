"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { forgotPassword } from "@/services/auth.service";
import toast, { Toaster } from "react-hot-toast";
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
          x: [Math.random() * 80 - 40 + "%", Math.random() * 80 - 40 + "%"],
          y: [Math.random() * 60 - 30 + "%", Math.random() * 60 - 30 + "%"],
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

const ForgotPasswordForm: React.FC = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

    if (!email) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك");
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ في الإرسال");
    }

    setLoading(false);
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="relative h-screen overflow-hidden bg-white dark:bg-[#0d1117]">
        <AuthBackground />

        {/* Header with Logo and Controls */}
        <div className="relative z-10 container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-row-reverse">
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
                  href={`/${locale}/authentication/sign-in`}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all font-semibold text-sm flex-row-reverse"
                >
                  <ArrowIcon size={16} className="rtl:rotate-180" />
                  <span>
                    {locale === "ar" ? "العودة" : "Back"}
                  </span>
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
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="inline-block px-5 py-2 rounded-full bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold text-sm mb-6 border border-purple-100 dark:border-purple-500/30 shadow-sm">
                {locale === "ar" ? "استعادة الحساب 🔐" : "Account Recovery 🔐"}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">
                {locale === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {success
                  ? locale === "ar"
                    ? "تم إرسال الرابط! تحقق من بريدك الإلكتروني"
                    : "Link sent! Check your email"
                  : locale === "ar"
                  ? "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين"
                  : "Enter your email and we'll send you a reset link"}
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-white/80 dark:bg-[#0d1117]/80 border border-purple-200/40 dark:border-purple-500/20 rounded-3xl p-8 md:p-10 shadow-2xl shadow-purple-500/10"
            >
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div className="relative group">
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
                      {locale === "ar" ? "البريد الإلكتروني" : "Email"}
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
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                        autoComplete="email"
                      />
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
                            {locale === "ar" ? "جاري الإرسال..." : "Sending..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <i className="ri-mail-send-line text-2xl"></i>
                          <span>
                            {locale === "ar"
                              ? "إرسال رابط إعادة التعيين"
                              : "Send Reset Link"}
                          </span>
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-400 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <i className="ri-checkbox-circle-fill text-3xl text-green-600 dark:text-green-400"></i>
                    <div>
                      <h3 className="font-bold text-lg text-green-900 dark:text-green-100 mb-2">
                        {locale === "ar" ? "تم الإرسال بنجاح!" : "Sent Successfully!"}
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {locale === "ar"
                          ? "تحقق من صندوق الوارد واضغط على الرابط لإعادة تعيين كلمة المرور"
                          : "Check your inbox and click the link to reset your password"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sign In Link */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  {locale === "ar"
                    ? "تذكرت كلمة المرور؟"
                    : "Remember your password?"}{" "}
                  <Link
                    href={`/${locale}/authentication/sign-in`}
                    className="text-purple-600 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 hover:underline inline-flex items-center gap-1"
                  >
                    {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
                    <i className="ri-arrow-left-line rtl:rotate-180"></i>
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
