"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface Stats {
  totalUsers: number;
  activeAccounts: number;
  paidPlans: number;
  trialUsers: number;
  monthlyRevenue: number;
  suspendedAccounts: number;
}

interface AdminDashboardContentProps {
  stats: Stats | null;
}

export default function AdminDashboardContent({
  stats,
}: AdminDashboardContentProps) {
  const router = useRouter();
  const locale = useLocale();

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-600 dark:text-gray-400">فشل تحميل البيانات</p>
      </div>
    );
  }

  const statsCards = [
    {
      title: "👤 Users",
      titleAr: "إجمالي المستخدمين",
      value: stats.totalUsers,
      color: "bg-blue-500",
    },
    {
      title: "🏪 Active Accounts",
      titleAr: "المطاعم / الشركات النشطة",
      value: stats.activeAccounts,
      color: "bg-green-500",
    },
    {
      title: "💳 Paid Plans",
      titleAr: "المشتركين المدفوعين",
      value: stats.paidPlans,
      color: "bg-purple-500",
    },
    {
      title: "📉 Trial Users",
      titleAr: "في فترة التجربة",
      value: stats.trialUsers,
      color: "bg-yellow-500",
    },
    {
      title: "💰 Revenue",
      titleAr: "الدخل الشهري",
      value: `$${stats.monthlyRevenue.toFixed(2)}`,
      color: "bg-green-600",
    },
    {
      title: "🚫 Suspended",
      titleAr: "حسابات موقوفة",
      value: stats.suspendedAccounts,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="py-5 px-5 sm:px-5 md:px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            لوحة تحكم الأدمن
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            إدارة المستخدمين والخطط والإعلانات
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => router.push(`/${locale}/admin/users`)}
            className="px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            👤 المستخدمين
          </button>
          <button
            onClick={() => router.push(`/${locale}/admin/plans`)}
            className="px-4 py-3 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            💳 الخطط
          </button>
          <button
            onClick={() => router.push(`/${locale}/admin/ads`)}
            className="px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            📢 الإعلانات
          </button>
          <button
            onClick={() => router.push(`/${locale}/admin/admins`)}
            className="px-4 py-3 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            👨‍💼 المشرفين
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="ENS-card bg-white dark:bg-[#0c1427] p-4 md:p-5 rounded-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.titleAr}
                </h3>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <span className="text-white text-xl">
                    {stat.title.slice(0, 2)}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="ENS-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
          <div className="ENS-card-header mb-[20px]">
            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
              الإحصائيات التفصيلية
            </h5>
          </div>
          <div className="ENS-card-content">
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              الرسوم البيانية متاحة قريباً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
