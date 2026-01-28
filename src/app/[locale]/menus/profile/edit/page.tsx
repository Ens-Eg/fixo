import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/[locale]/actions";
import EditProfileContent from "@/app/[locale]/dashboard/profile/edit/EditProfileContent";

interface EditProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function EditProfilePage({
  params,
}: EditProfilePageProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  // Get current user
  const { user } = await getCurrentUser();

  // Redirect if not authenticated
  if (!user) {
    redirect(`/${locale}/authentication/sign-in`);
  }

  return <EditProfileContent user={user} isMenusRoute={true} />;
}
