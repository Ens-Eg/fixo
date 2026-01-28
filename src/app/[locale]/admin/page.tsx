import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/[locale]/actions";
import { getAdminStats } from "./actions";
import AdminDashboardContent from "./AdminDashboardContent";

interface AdminDashboardProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminDashboard({ params }: AdminDashboardProps) {
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

  // Fetch admin stats
  const { stats } = await getAdminStats();

  return <AdminDashboardContent stats={stats} />;
}
