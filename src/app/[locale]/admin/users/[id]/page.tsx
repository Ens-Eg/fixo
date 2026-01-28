import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/app/[locale]/actions";
import { getUserDetails, getSubscriptionPlans } from "../../actions";
import UserDetailsContent from "./UserDetailsContent";

interface UserDetailsPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;

  // Get current user
  const { user } = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!user) {
    redirect(`/${locale}/authentication/sign-in`);
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  // Fetch user details and plans
  const [{ user: userDetails, menus }, { plans }] = await Promise.all([
    getUserDetails(id),
    getSubscriptionPlans(),
  ]);

  if (!userDetails) {
    notFound();
  }

  // Combine user details with menus
  const fullUserDetails = {
    ...userDetails,
    menus: menus || [],
  };

  return (
    <UserDetailsContent
      initialUserDetails={fullUserDetails}
      initialPlans={plans}
      userId={id}
    />
  );
}
