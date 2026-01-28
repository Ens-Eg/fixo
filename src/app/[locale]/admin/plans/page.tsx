import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/[locale]/actions";
import { getAdminPlans } from "../actions";
import PlansManagementContent from "./PlansManagementContent";

interface PlansManagementProps {
  params: Promise<{ locale: string }>;
}

export default async function PlansManagement({ params }: PlansManagementProps) {
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

  // Fetch plans
  const { plans } = await getAdminPlans();

  return <PlansManagementContent initialPlans={plans} />;
}
