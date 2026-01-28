"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/queries/useUserQuery";
import { useLogout as useLogoutMutation } from "@/hooks/queries/useAuthQuery";
import { loginAction, signupAction, logoutAction } from "@/app/[locale]/actions";
import { setTokens, clearTokens } from "@/lib/api-client";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  phoneNumber?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  profileImage?: string;
  planType?: "free" | "monthly" | "yearly";
  menusLimit?: number;
  currentMenusCount?: number;
  emailVerified?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (
    email: string,
    password: string,
    name: string,
    phoneNumber: string
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: userData, isLoading, refetch } = useCurrentUser();
  const user = userData?.user || null;
  const logoutMutation = useLogoutMutation();

  const login = async (email: string, password: string) => {
    try {
      // Use Server Action (لا يظهر في Network tab)
      const result = await loginAction(email, password);
      
      // CRITICAL: Set tokens in api-client state + cookies immediately
      if (result.accessToken && result.refreshToken) {
        setTokens(result.accessToken, result.refreshToken);
      }
      
      // Refresh user data after login
      await refetch();

      // Return user data for redirect logic
      return result;
    } catch (error: any) {
      console.error("❌ Login error:", error);
      toast.error(error.message || "فشل تسجيل الدخول");
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    phoneNumber: string
  ): Promise<boolean> => {
    try {
      // Use Server Action (لا يظهر في Network tab)
      await signupAction({ email, password, name, phoneNumber });

      // CRITICAL: Auto-login after successful signup
      // This ensures tokens are set before redirecting to /menus
      try {
        const loginResult = await loginAction(email, password);
        
        // Set tokens in api-client state + cookies immediately
        if (loginResult.accessToken && loginResult.refreshToken) {
          setTokens(loginResult.accessToken, loginResult.refreshToken);
        }
        
        // Small delay to ensure cookies are set before refetch
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Refresh user data after auto-login
        await refetch();
        
        toast.success("تم إنشاء الحساب بنجاح");
        return true;
      } catch (loginError: any) {
        console.error("❌ Auto-login after signup error:", loginError);
        // If auto-login fails, still show success but user will need to login manually
        toast.success("تم إنشاء الحساب بنجاح. يرجى تسجيل الدخول");
        return false;
      }
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      toast.error(error.message || "فشل إنشاء الحساب");
      return false;
    }
  };

  const logout = async () => {
    try {
      // 1. Clear client-side tokens and storage FIRST
      clearTokens();
      
      if (typeof window !== "undefined") {
        // Clear all possible storage locations
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; SameSite=Lax";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; SameSite=Lax";
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("accessToken");
      }
      
      // 2. Cancel all ongoing queries to prevent auto-refetch
      queryClient.cancelQueries();
      
      // 3. Clear React Query cache
      queryClient.clear();
      
      // 4. Call server action to clear server-side cookies
      await logoutAction();
      
      // 5. Force redirect (using location.href for clean state)
      if (typeof window !== "undefined") {
        const locale = window.location.pathname.split('/')[1] || 'en';
        window.location.href = `/${locale}/authentication/sign-in`;
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, still redirect
      if (typeof window !== "undefined") {
        const locale = window.location.pathname.split('/')[1] || 'en';
        window.location.href = `/${locale}/authentication/sign-in`;
      }
    }
  };

  const value: AuthContextType = {
    user: user || null,
    loading: isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
