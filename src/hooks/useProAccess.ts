/**
 * Use Pro Access Hook
 * Check and handle pro feature access
 */

import { useCurrentUser } from "./queries/useUserQuery";
import { isProUser } from "@/utils/plan-guard";

export function useProAccess() {
  const { data: userData } = useCurrentUser();
  const user = userData?.user;

  return {
    isPro: isProUser(user),
    user,
    isLoading: !userData,
  };
}
