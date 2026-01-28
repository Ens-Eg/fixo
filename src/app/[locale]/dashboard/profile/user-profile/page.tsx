import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/[locale]/actions";
import { getUserSubscription } from "@/lib/server-api";
import UserProfileContent from "./UserProfileContent";

interface UserProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Get current user
  const { user } = await getCurrentUser();

  // Redirect if not authenticated
  if (!user) {
    redirect(`/${locale}/authentication/sign-in`);
  }

  // Get user subscription
  const subscription = await getUserSubscription();

  return <UserProfileContent user={user} subscription={subscription} />;
}
