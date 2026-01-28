import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/[locale]/actions";
import { getAdminAds } from "../actions";
import AdsManagementContent from "./AdsManagementContent";

interface AdsManagementProps {
  params: Promise<{ locale: string }>;
}

export default async function AdsManagement({ params }: AdsManagementProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Get current user
  const { user } = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!user) {
    redirect(`/${locale}/authentication/sign-in`);
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  // Fetch ads
  const { ads } = await getAdminAds();

  return <AdsManagementContent initialAds={ads} />;
}
