"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationAction,
} from "@/app/[locale]/notifications/actions";

interface Notification {
  id: number;
  type: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  isRead: boolean;
  metadata: any;
  createdAt: string;
  readAt: string | null;
}

interface NotificationBellProps {
  locale: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ locale }) => {
  const t = useTranslations("notifications");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastFetchRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const result = await getNotifications();
      if (result.success && result.data) {
        setNotifications(result.data.notifications || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      // Silently fail - don't show toast for background fetch
    }
  }, []);

  // Fetch unread count with debounce to avoid excessive requests
  const fetchUnreadCount = useCallback(async () => {
    const now = Date.now();
    // Prevent fetching if last fetch was less than 30 seconds ago
    if (now - lastFetchRef.current < 30000) {
      return;
    }
    lastFetchRef.current = now;

    try {
      const result = await getUnreadCount();
      if (result.success && result.data) {
        setUnreadCount(result.data.count || 0);
      }
    } catch (error: any) {
      console.error("Failed to fetch unread count:", error);
      // Silently fail - don't show toast for background fetch
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: number) => {
      try {
        const result = await markNotificationAsRead(notificationId);
        
        if (result.success) {
          // Update local state
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId
                ? { ...n, isRead: true, readAt: new Date().toISOString() }
                : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } else {
          toast.error(
            result.error || 
            (locale === "ar"
              ? "فشل تحديد الإشعار كمقروء"
              : "Failed to mark as read")
          );
        }
      } catch (error: any) {
        console.error("Failed to mark notification as read:", error);
        toast.error(
          locale === "ar"
            ? "فشل تحديد الإشعار كمقروء"
            : "Failed to mark as read"
        );
      }
    },
    [locale]
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      setLoading(true);
      const result = await markAllNotificationsAsRead();
      
      if (result.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            isRead: true,
            readAt: new Date().toISOString(),
          }))
        );
        setUnreadCount(0);
        toast.success(
          locale === "ar"
            ? "تم تحديد جميع الإشعارات كمقروءة"
            : "All notifications marked as read"
        );
      } else {
        toast.error(
          result.error ||
          (locale === "ar"
            ? "فشل تحديد جميع الإشعارات كمقروءة"
            : "Failed to mark all as read")
        );
      }
    } catch (error: any) {
      console.error("Failed to mark all as read:", error);
      toast.error(
        locale === "ar"
          ? "فشل تحديد جميع الإشعارات كمقروءة"
          : "Failed to mark all as read"
      );
    } finally {
      setLoading(false);
    }
  }, [locale]);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: number) => {
      try {
        const result = await deleteNotificationAction(notificationId);
        
        if (result.success) {
          // Update local state
          setNotifications((prev) => {
            const notification = prev.find((n) => n.id === notificationId);
            if (notification && !notification.isRead) {
              setUnreadCount((count) => Math.max(0, count - 1));
            }
            return prev.filter((n) => n.id !== notificationId);
          });
          toast.success(
            locale === "ar" ? "تم حذف الإشعار" : "Notification deleted"
          );
        } else {
          toast.error(
            result.error ||
            (locale === "ar" ? "فشل حذف الإشعار" : "Failed to delete notification")
          );
        }
      } catch (error: any) {
        console.error("Failed to delete notification:", error);
        toast.error(
          locale === "ar" ? "فشل حذف الإشعار" : "Failed to delete notification"
        );
      }
    },
    [locale]
  );

  // Format time ago - memoized
  const timeAgo = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return locale === "ar" ? "الآن" : "Just now";
      if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return locale === "ar" ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
      }
      if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return locale === "ar" ? `منذ ${hours} ساعة` : `${hours}h ago`;
      }
      const days = Math.floor(seconds / 86400);
      return locale === "ar" ? `منذ ${days} يوم` : `${days}d ago`;
    },
    [locale]
  );

  // Get notification icon and color based on type - memoized
  const getNotificationStyle = useCallback((type: string) => {
    switch (type) {
      case "subscription_created":
        return { icon: "✅", color: "text-green-600", bg: "bg-green-50" };
      case "subscription_expiring":
        return { icon: "⚠️", color: "text-yellow-600", bg: "bg-yellow-50" };
      case "subscription_expired":
        return { icon: "⏰", color: "text-orange-600", bg: "bg-orange-50" };
      case "downgraded_to_free":
        return { icon: "📉", color: "text-red-600", bg: "bg-red-50" };
      default:
        return { icon: "🔔", color: "text-blue-600", bg: "bg-blue-50" };
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Fetch on mount and set up polling
  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();
    
    // Set up polling - every 2 minutes
    intervalRef.current = setInterval(fetchUnreadCount, 120000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchUnreadCount]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        aria-label={locale === "ar" ? "الإشعارات" : "Notifications"}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute ${
            locale === "ar" ? "left-0" : "right-0"
          } mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {locale === "ar" ? "الإشعارات" : "Notifications"}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
              >
                {locale === "ar" ? "تحديد الكل كمقروء" : "Mark all as read"}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p>
                  {locale === "ar" ? "لا توجد إشعارات" : "No notifications"}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  locale={locale}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  getNotificationStyle={getNotificationStyle}
                  timeAgo={timeAgo}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Memoized notification item component to prevent unnecessary re-renders
const NotificationItem = React.memo<{
  notification: Notification;
  locale: string;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  getNotificationStyle: (type: string) => {
    icon: string;
    color: string;
    bg: string;
  };
  timeAgo: (date: string) => string;
}>(
  ({
    notification,
    locale,
    onMarkAsRead,
    onDelete,
    getNotificationStyle,
    timeAgo,
  }) => {
    const style = getNotificationStyle(notification.type);
    const title = locale === "ar" ? notification.titleAr : notification.title;
    const message =
      locale === "ar" ? notification.messageAr : notification.message;

    return (
      <div
        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
          !notification.isRead ? "bg-blue-50 dark:bg-blue-900/10" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full ${style.bg} flex items-center justify-center text-xl`}
          >
            {style.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4
                className={`text-sm font-semibold ${style.color} dark:opacity-90`}
              >
                {title}
              </h4>
              <button
                onClick={() => onDelete(notification.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                aria-label="Delete"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {message}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {timeAgo(notification.createdAt)}
              </span>
              {!notification.isRead && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {locale === "ar" ? "تحديد كمقروء" : "Mark as read"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

export default NotificationBell;
