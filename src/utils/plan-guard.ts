/**
 * Plan Guard Utility
 * Check if user has access to pro features
 */

import { User } from "@/services/user.service";

export function isProUser(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.planType !== "free";
}

export function requireProPlan(user: User | null | undefined): void {
  if (!isProUser(user)) {
    throw new Error("This feature is only available for Pro users");
  }
}

export function checkFeatureAccess(
  user: User | null | undefined,
  feature: "customization" | "ads" | "analytics"
): { hasAccess: boolean; reason?: string } {
  if (!user) {
    return {
      hasAccess: false,
      reason: "User not authenticated",
    };
  }

  const isPro = isProUser(user);

  switch (feature) {
    case "customization":
    case "ads":
    case "analytics":
      return {
        hasAccess: isPro,
        reason: isPro ? undefined : "Upgrade to Pro to access this feature",
      };
    default:
      return { hasAccess: true };
  }
}
