"use client";

import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { useGoogleOAuth } from "@/providers/GoogleOAuthProvider";
import { tokenCookies } from "@/lib/cookies";

interface GoogleAuthButtonProps {
  mode: "signin" | "signup";
}

// Inner component - only rendered when GoogleOAuthProvider is available
const GoogleAuthButtonInner: React.FC<GoogleAuthButtonProps> = ({ mode }) => {
  const locale = useLocale();
  const tSignIn = useTranslations("SignIn");
  const tSignUp = useTranslations("SignUp");
  const t = mode === "signin" ? tSignIn : tSignUp;
  const [loading, setLoading] = React.useState(false);

  const handleGoogleAuth = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error(t("googleSignInFailed"));
      return;
    }

    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const apiKeyResponse = await fetch(`/api/api-key`);
      let apiKeyText = "";
      if (apiKeyResponse.ok) {
        const { apiKey } = await apiKeyResponse.json();
        apiKeyText = apiKey;
      }

      // Send the credential (ID token) instead of access token
      const response = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKeyText,
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      tokenCookies.setAccessToken(data.accessToken);
      tokenCookies.setRefreshToken(data.refreshToken);

      const successMessage = data.isNew
        ? t("accountCreatedSuccess")
        : t("loginSuccess");

      toast.success(successMessage);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const redirectPath = data.user.role === "admin" ? "admin" : "menus";
      window.location.href = `/${locale}/${redirectPath}`;
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast.error(error.message || t("googleSignInFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-14 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 dark:border-slate-600 border-t-purple-600"></div>
          <span className="text-slate-600 dark:text-slate-300">
            {locale === "ar" ? "جاري التحميل..." : "Loading..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleAuth}
        onError={() => {
          toast.error(t("googleSignInFailed"));
        }}
        theme="outline"
        size="large"
        width="400"
        text={mode === "signin" ? "signin_with" : "signup_with"}
        shape="pill"
      />
    </div>
  );
};

// Wrapper component - checks if provider is available
const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ mode }) => {
  const locale = useLocale();
  const tSignIn = useTranslations("SignIn");
  const tSignUp = useTranslations("SignUp");
  const t = mode === "signin" ? tSignIn : tSignUp;
  const { isGoogleOAuthAvailable, isLoading: isGoogleLoading } =
    useGoogleOAuth();

  // Loading state
  if (isGoogleLoading) {
    return (
      <div className="w-full h-14 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 dark:border-slate-600 border-t-purple-600"></div>
      </div>
    );
  }

  // Not configured state
  if (!isGoogleOAuthAvailable) {
    return (
      <div className="w-full p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full text-center">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {t("googleOAuthNotConfigured")}
        </p>
      </div>
    );
  }

  // Render inner component only when provider is available
  return <GoogleAuthButtonInner mode={mode} />;
};

export default GoogleAuthButton;
