import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/[locale]/actions";
import { getAdminList } from "../actions";
import AdminsManagementContent from "./AdminsManagementContent";

interface AdminsManagementProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminsManagement({
  params,
}: AdminsManagementProps) {
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

  // Fetch admins
  const { admins } = await getAdminList();

  return (
    <AdminsManagementContent initialAdmins={admins} currentUserId={user.id} />
  );
}
