import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/[locale]/actions";
import { getMenuAds, getPublicAds } from "@/lib/server-api";
import AdsContent from "./AdsContent";

interface AdsPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function AdsPage({ params }: AdsPageProps) {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;

  // Get current user
  const { user } = await getCurrentUser();

  // Redirect if not authenticated
  if (!user) {
    redirect(`/${locale}/authentication/sign-in`);
  }

  // Check if user is on free plan
  const isFreePlan = user?.planType === "free" || !user?.planType;

  // Fetch ads based on plan type
  let ads = [];
  try {
      if (isFreePlan) {
        // Free users: show only global ads
      ads = await getPublicAds("banner", 20);
      } else {
        // Pro users: show only menu-specific ads (no global ads)
      ads = await getMenuAds(id);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    // Continue with empty ads array instead of throwing
    ads = [];
  }

  return <AdsContent initialAds={ads} menuId={id} isFreePlan={isFreePlan} />;
}
