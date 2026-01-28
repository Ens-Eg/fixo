import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/[locale]/actions";
import { getAdminUsers } from "../actions";
import { toggleUserSuspend } from "./actions";
import { getTranslations } from "next-intl/server";
import SearchForm from "./SearchForm";
import SuspendButton from "./SuspendButton";
import PaginationControls from "./PaginationControls";

interface UsersManagementProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  planName?: string;
  planType?: string;
}

export default async function UsersManagement({
  params,
  searchParams,
}: UsersManagementProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
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

  // Get page from search params
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const search = resolvedSearchParams.search;

  // Fetch users
  const { users, pagination, stats } = await getAdminUsers(page, 10, search);

  // Get translations
  const t = await getTranslations("AdminUsers");

  return (
    <div className="py-5 px-5 sm:px-5 md:px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t("title")}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("subtitle")}
              </p>
            </div>
            <Link
              href={`/${locale}/admin`}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {locale === "ar" ? "← " : ""}
              {t("backButton")}
              {locale === "en" ? " →" : ""}
            </Link>
          </div>

          {/* Search */}
          <SearchForm currentSearch={search} locale={locale} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="ENS-card bg-white dark:bg-[#0c1427] p-4 rounded-md">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t("stats.totalUsers")}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalUsers}
            </div>
          </div>
          <div className="ENS-card bg-white dark:bg-[#0c1427] p-4 rounded-md">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t("stats.activeUsers")}
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeUsers}
            </div>
          </div>
          <div className="ENS-card bg-white dark:bg-[#0c1427] p-4 rounded-md">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t("stats.suspendedUsers")}
            </div>
            <div className="text-2xl font-bold text-red-600">
              {stats.suspendedUsers}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="ENS-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#15203c]">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {t("table.name")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {t("table.email")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {t("table.role")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {t("table.plan")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {t("table.status")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {t("table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      {t("noResults")}
                    </td>
                  </tr>
                ) : (
                  users.map((u: User) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {u.role === "admin" ? t("roles.admin") : t("roles.user")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            u.planName === "Yearly"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : u.planName === "Monthly"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {u.planName === "Yearly"
                            ? t("plans.yearly")
                            : u.planName === "Monthly"
                            ? t("plans.monthly")
                            : u.planName || t("plans.free")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            u.isSuspended
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {u.isSuspended ? t("status.suspended") : t("status.active")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Link
                            href={`/${locale}/admin/users/${u.id}`}
                            className="font-normal inline-block transition-all rounded-md md:text-md py-[10px] px-[20px] bg-primary-500 text-white hover:bg-primary-400"
                          >
                            {t("actions.view")}
                          </Link>
                          {u.role !== "admin" && (
                            <SuspendButton
                              userId={u.id}
                              userName={u.name}
                              isSuspended={u.isSuspended}
                              locale={locale}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              locale={locale}
            />
          )}
        </div>
      </div>
    </div>
  );
}
