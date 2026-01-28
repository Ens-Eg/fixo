"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import toast from "react-hot-toast";
import { getAdminList, createAdmin } from "../actions";

interface Admin {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface AdminsManagementContentProps {
  initialAdmins: Admin[];
  currentUserId: number;
}

export default function AdminsManagementContent({
  initialAdmins,
  currentUserId,
}: AdminsManagementContentProps) {
  const router = useRouter();
  const locale = useLocale();
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await getAdminList();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("فشل تحميل المشرفين");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createAdmin(formData);

      if (!response.success) {
        throw new Error(response.error || "Failed to create admin");
      }

      setShowAddForm(false);
      setFormData({ email: "", password: "", name: "" });
      fetchAdmins(); // Refresh list
      toast.success("تم إنشاء حساب الأدمن بنجاح ✨");
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
    }
  };

  return (
    <div className="py-5 px-5 sm:px-5 md:px-5 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                إدارة المشرفين
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                عرض وإدارة حسابات المشرفين
              </p>
            </div>
            <button
              onClick={() => router.push(`/${locale}/admin`)}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← رجوع
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="ENS-card bg-white dark:bg-[#0c1427] p-4 rounded-md">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              إجمالي المشرفين
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {admins.length}
            </div>
          </div>
          <div className="ENS-card bg-white dark:bg-[#0c1427] p-4 rounded-md">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              آخر تسجيل دخول
            </div>
            <div className="text-base font-medium text-gray-900 dark:text-white">
              {admins[0]?.lastLoginAt
                ? new Date(admins[0].lastLoginAt).toLocaleDateString("ar-EG")
                : "لا يوجد"}
            </div>
          </div>
        </div>

        {/* Add New Admin Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {showAddForm ? "إلغاء" : "+ إضافة مشرف جديد"}
          </button>
        </div>

        {/* Add Admin Form */}
        {showAddForm && (
          <div className="ENS-card bg-white dark:bg-[#0c1427] p-6 rounded-md mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              إضافة مشرف جديد
            </h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="مثال: أحمد محمد"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0c1427] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="كلمة مرور قوية"
                  minLength={8}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  إنشاء الحساب
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admins List */}
        <div className="ENS-card bg-white dark:bg-[#0c1427] rounded-md overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#15203c]">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    الاسم
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    البريد الإلكتروني
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    تاريخ الإضافة
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    آخر تسجيل دخول
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {admins.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      لا توجد حسابات مشرفين بعد
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#15203c] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {admin.name}
                        {admin.id === currentUserId && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                            أنت
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {admin.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(admin.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {admin.lastLoginAt
                          ? new Date(admin.lastLoginAt).toLocaleDateString("ar-EG")
                          : "لم يسجل دخول بعد"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
