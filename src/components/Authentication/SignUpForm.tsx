"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  signupSchema,
  getZodErrorMessage,
} from "@/lib/validators/auth.validator";
import type { SignupFormData } from "@/lib/validators/auth.validator";
import { useAvailabilityCheck } from "@/hooks/useAvailabilityCheck";
import { Logo } from "@/components/common/Logo";
import { FormInput } from "./FormInput";
import GoogleAuthButton from "./GoogleAuthButton";
import { ArrowLeft, ArrowRight, Moon, Sun, Globe } from "@/components/icons/Icons";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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

/**
 * Sign Up Form Component
 * Features:
 * - Real-time email and phone availability checking
 * - Zod validation
 * - Password visibility toggle
 * - Loading states
 * - Accessibility support
 */
const SignUpForm: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { signup } = useAuth();
  const isRTL = locale === "ar";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

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

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Real-time availability checking with custom hooks
  const { isAvailable: emailAvailable, isChecking: checkingEmail } =
    useAvailabilityCheck({
      value: formData.email,
      type: "email",
    });

  const { isAvailable: phoneAvailable, isChecking: checkingPhone } =
    useAvailabilityCheck({
      value: formData.phoneNumber,
      type: "phone",
      minLength: 8,
    });

  // Update form field
  const updateFormField = useCallback(
    (field: keyof SignupFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Real-time password validation
        if (field === "password") {
          setPasswordValidation({
            minLength: value.length >= 8,
            hasUpperCase: /[A-Z]/.test(value),
            hasLowerCase: /[a-z]/.test(value),
            hasNumber: /\d/.test(value),
            hasSpecialChar: /[@$!%*?&#^()_+=\-\[\]{};:'",.<>\/\\|`~]/.test(
              value
            ),
          });
        }
      },
    []
  );

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod
    try {
      signupSchema.parse(formData);
    } catch (error: any) {
      const errorMessage = getZodErrorMessage(error);
      toast.error(errorMessage);
      return;
    }

    // Check recaptcha verification
    if (!recaptchaVerified) {
      toast.error(locale === "ar" ? "الرجاء إكمال التحقق من أنك لست روبوت" : "Please complete the captcha verification");
      return;
    }

    // Check availability before submitting
    if (emailAvailable === false) {
      toast.error("البريد الإلكتروني مستخدم بالفعل");
      return;
    }

    if (phoneAvailable === false) {
      toast.error("رقم الهاتف مستخدم بالفعل");
      return;
    }

    // Prevent submission while checking
    if (checkingEmail || checkingPhone) {
      toast.error("الرجاء الانتظار حتى يتم التحقق من البيانات");
      return;
    }

    setLoading(true);

    try {
      const success = await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.phoneNumber
      );

      if (success) {
        toast.success("تم إنشاء الحساب بنجاح!");
        setRecaptchaVerified(false);
        // Redirect directly to menus page (email verification disabled)
        router.push(`/${locale}/menus`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

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
                  <span>
                    {locale === "ar" ? "العودة" : "Back"}
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 flex items-center justify-center h-[calc(100vh-80px)] py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left Side - Welcome */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center lg:text-right hidden lg:block"
              >
                <div className="inline-block px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold text-xs mb-4 border border-purple-100 dark:border-purple-500/30 shadow-sm">
                  {locale === "ar" ? "ابدأ مجاناً الآن 🚀" : "Start Free Now 🚀"}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-slate-900 dark:text-white">
                  {locale === "ar" ? "إنشاء حساب جديد" : "Create Account"}
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-300 mb-6">
                  {locale === "ar"
                    ? "انضم إلينا اليوم وابدأ رحلتك معنا"
                    : "Join us today and start your journey"}
                </p>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {locale === "ar" ? (
                    <>
                      لديك حساب بالفعل؟{" "}
                      <Link
                        href={`/${locale}/authentication/sign-in`}
                        className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                      >
                        تسجيل الدخول
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Link
                        href={`/${locale}/authentication/sign-in`}
                        className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Right Side - Form Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/90 dark:bg-[#0d1117]/90 border border-purple-200/40 dark:border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-500/10 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar"
              >
                {/* Mobile Title */}
                <div className="text-center lg:hidden mb-4">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                    {locale === "ar" ? "إنشاء حساب جديد" : "Create Account"}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {locale === "ar" ? "ابدأ مجاناً الآن" : "Start free now"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                {/* Google Sign Up Button */}
                <div>
                  <GoogleAuthButton mode="signup" />
                </div>

                {/* Divider */}
                <div className="flex items-center my-3">
                  <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
                  <span className="px-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {locale === "ar" ? "أو" : "or"}
                  </span>
                  <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
                </div>

                {/* Name Field */}
                <FormInput
                  label={locale === "ar" ? "الاسم الكامل" : "Full Name"}
                  type="text"
                  placeholder={locale === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                  value={formData.name}
                  onChange={updateFormField("name")}
                  disabled={loading}
                  required
                />

                {/* Email Field */}
                <FormInput
                  label={locale === "ar" ? "البريد الإلكتروني" : "Email"}
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={updateFormField("email")}
                  disabled={loading}
                  required
                  isAvailable={emailAvailable}
                  isChecking={checkingEmail}
                  availableMessage={locale === "ar" ? "البريد الإلكتروني متاح ✓" : "Email available ✓"}
                  unavailableMessage={locale === "ar" ? "البريد الإلكتروني مستخدم بالفعل" : "Email already in use"}
                />

                {/* Phone Field */}
                <FormInput
                  label={locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                  type="tel"
                  placeholder="+971"
                  value={formData.phoneNumber}
                  onChange={updateFormField("phoneNumber")}
                  disabled={loading}
                  required
                  isAvailable={phoneAvailable}
                  isChecking={checkingPhone}
                  availableMessage={locale === "ar" ? "رقم الهاتف متاح ✓" : "Phone available ✓"}
                  unavailableMessage={locale === "ar" ? "رقم الهاتف مستخدم بالفعل" : "Phone already in use"}
                />

                {/* Password Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <FormInput
                      label={locale === "ar" ? "كلمة المرور" : "Password"}
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={updateFormField("password")}
                      disabled={loading}
                      required
                      minLength={8}
                      showToggle
                      onToggle={togglePasswordVisibility}
                      showValue={showPassword}
                    />
                  </div>

                  <div>
                    <FormInput
                      label={locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={updateFormField("confirmPassword")}
                      disabled={loading}
                      required
                      showToggle
                      onToggle={togglePasswordVisibility}
                      showValue={showPassword}
                    />
                  </div>
                </div>

                {/* Compact Password Requirements */}
                {formData.password && (
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-[10px]">
                      <div className={`flex items-center gap-1 ${passwordValidation.minLength ? "text-green-600" : "text-slate-400"}`}>
                        <i className={`${passwordValidation.minLength ? "ri-checkbox-circle-fill" : "ri-close-circle-fill"}`}></i>
                        <span>{locale === "ar" ? "8+ حرف" : "8+ chars"}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasUpperCase ? "text-green-600" : "text-slate-400"}`}>
                        <i className={`${passwordValidation.hasUpperCase ? "ri-checkbox-circle-fill" : "ri-close-circle-fill"}`}></i>
                        <span>{locale === "ar" ? "A-Z" : "Upper"}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasLowerCase ? "text-green-600" : "text-slate-400"}`}>
                        <i className={`${passwordValidation.hasLowerCase ? "ri-checkbox-circle-fill" : "ri-close-circle-fill"}`}></i>
                        <span>{locale === "ar" ? "a-z" : "Lower"}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-600" : "text-slate-400"}`}>
                        <i className={`${passwordValidation.hasNumber ? "ri-checkbox-circle-fill" : "ri-close-circle-fill"}`}></i>
                        <span>{locale === "ar" ? "0-9" : "Number"}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-slate-400"}`}>
                        <i className={`${passwordValidation.hasSpecialChar ? "ri-checkbox-circle-fill" : "ri-close-circle-fill"}`}></i>
                        <span>{locale === "ar" ? "@#$" : "Symbol"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Match Indicator */}
                {formData.password && formData.confirmPassword && (
                  <div className={`p-2 rounded-lg border text-sm ${
                    formData.password === formData.confirmPassword
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                  }`}>
                    <div className="flex items-center gap-2">
                      <i className={`${
                        formData.password === formData.confirmPassword
                          ? "ri-checkbox-circle-fill"
                          : "ri-close-circle-fill"
                      }`}></i>
                      <span>
                        {formData.password === formData.confirmPassword
                          ? (locale === "ar" ? "كلمة المرور متطابقة ✓" : "Passwords match ✓")
                          : (locale === "ar" ? "كلمة المرور غير متطابقة" : "Passwords don't match")
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* HCaptcha */}
                <div className="flex justify-center">
                  <HCaptcha
                    languageOverride={locale}
                    sitekey="29aec278-e602-4efa-8578-f8144344a312"
                    onVerify={(token: string, ekey?: string) => {
                      setRecaptchaVerified(true);
                    }}
                    onExpire={() => {
                      setRecaptchaVerified(false);
                    }}
                    onError={() => {
                      setRecaptchaVerified(false);
                    }}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full h-12 rounded-full font-black text-white bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl shadow-purple-200 dark:shadow-purple-900/50 hover:shadow-purple-300 dark:hover:shadow-purple-800/60 disabled:shadow-none mt-4"
                  disabled={loading || checkingEmail || checkingPhone || !recaptchaVerified}
                  aria-label={locale === "ar" ? "إنشاء حساب جديد" : "Create new account"}
                >
                  <span className="flex items-center justify-center gap-2.5 text-base">
                    {loading ? (
                      <>
                        <i
                          className="ri-loader-4-line animate-spin text-xl"
                          aria-hidden="true"
                        ></i>
                        <span>
                          {locale === "ar"
                            ? "جاري الإنشاء..."
                            : "Creating..."}
                        </span>
                      </>
                    ) : checkingEmail || checkingPhone ? (
                      <>
                        <i
                          className="ri-loader-4-line animate-spin text-xl"
                          aria-hidden="true"
                        ></i>
                        <span>
                          {locale === "ar" ? "جاري التحقق..." : "Verifying..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <i
                          className="ri-user-add-line text-xl"
                          aria-hidden="true"
                        ></i>
                        <span>
                          {locale === "ar" ? "إنشاء حساب" : "Create Account"}
                        </span>
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              {/* Sign In Link - Mobile */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center lg:hidden">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {locale === "ar"
                    ? "لديك حساب بالفعل؟"
                    : "Already have an account?"}{" "}
                  <Link
                    href={`/${locale}/authentication/sign-in`}
                    className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                  >
                    {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
                  </Link>
                </p>
              </div>
            </motion.div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
