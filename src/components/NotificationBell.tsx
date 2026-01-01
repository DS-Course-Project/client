import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, X, Ticket, MessageSquare, RefreshCw, AlertCircle } from "lucide-react";

interface Notification {
    id: string;
    eventType: string;
    message: string;
    ticketId: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:3000/notifications", {
                withCredentials: true,
            });
            console.log(response.data)
            setNotifications(response.data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await axios.patch(
                `http://localhost:3000/notifications/${notificationId}/read`,
                {},
                { withCredentials: true }
            );
            setNotifications(
                notifications.map((n) =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                )
            );
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Helper function to parse notification message
    const parseMessage = (message: string) => {
        try {
            return JSON.parse(message);
        } catch {
            return null;
        }
    };

    // Get icon and color based on event type
    const getEventStyle = (eventType: string) => {
        switch (eventType) {
            case "ticket_created":
                return {
                    icon: Ticket,
                    bgColor: "bg-green-50",
                    iconColor: "text-green-600",
                    borderColor: "border-l-green-500",
                };
            case "ticket_comment_added":
                return {
                    icon: MessageSquare,
                    bgColor: "bg-blue-50",
                    iconColor: "text-blue-600",
                    borderColor: "border-l-blue-500",
                };
            case "ticket_status_changed":
                return {
                    icon: RefreshCw,
                    bgColor: "bg-purple-50",
                    iconColor: "text-purple-600",
                    borderColor: "border-l-purple-500",
                };
            default:
                return {
                    icon: AlertCircle,
                    bgColor: "bg-gray-50",
                    iconColor: "text-gray-600",
                    borderColor: "border-l-gray-500",
                };
        }
    };

    // Format notification content based on event type
    const formatNotificationContent = (notification: Notification) => {
        const data = parseMessage(notification.message);
        if (!data) return { title: "Notification", description: notification.message, ticketInfo: null };

        switch (notification.eventType) {
            case "ticket_created":
                return {
                    title: "New Ticket Created",
                    description: data.ticket?.description || data.ticket?.title || "New ticket",
                    ticketInfo: data.ticket?.title || `Ticket #${notification.ticketId.slice(0, 8)}`,
                };
            case "ticket_comment_added":
                return {
                    title: "New Comment Added",
                    description: data.comment || "Comment added",
                    ticketInfo: data.ticket?.title || `Ticket #${notification.ticketId.slice(0, 8)}`,
                };
            case "ticket_status_changed":
                return {
                    title: "Ticket Status Updated",
                    description: `Status changed to ${data.status}`,
                    ticketInfo: data.ticket?.title || `Ticket #${notification.ticketId.slice(0, 8)}`,
                };
            default:
                return {
                    title: "Notification",
                    description: notification.message,
                    ticketInfo: null,
                };
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 max-h-96 overflow-hidden flex flex-col">
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Notifications
                            </h3>
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500">
                                    No notifications
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {notifications.map((notification) => {
                                        const style = getEventStyle(notification.eventType);
                                        const content = formatNotificationContent(notification);
                                        const Icon = style.icon;

                                        return (
                                            <div
                                                key={notification.id}
                                                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${style.borderColor} ${!notification.isRead ? style.bgColor : ""
                                                    }`}
                                                onClick={() => {
                                                    if (!notification.isRead) {
                                                        markAsRead(notification.id);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {/* Icon */}
                                                    <div className={`shrink-0 ${style.iconColor} mt-0.5`}>
                                                        <Icon size={20} />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1">
                                                                <p className={`text-sm font-semibold ${!notification.isRead
                                                                    ? "text-gray-900"
                                                                    : "text-gray-700"
                                                                    }`}>
                                                                    {content.title}
                                                                </p>
                                                                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                                                    {content.description}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1.5">
                                                                    <p className="text-xs text-gray-500">
                                                                        {new Date(notification.createdAt).toLocaleString()}
                                                                    </p>
                                                                    {content.ticketInfo && (
                                                                        <>
                                                                            <span className="text-xs text-gray-400">•</span>
                                                                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${notification.eventType === "ticket_created"
                                                                                ? "bg-green-100 text-green-700"
                                                                                : "bg-gray-100 text-gray-600"
                                                                                }`}>
                                                                                {content.ticketInfo}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Unread indicator */}
                                                            {!notification.isRead && (
                                                                <div className="shrink-0">
                                                                    <div className={`w-2 h-2 rounded-full ${notification.eventType === "ticket_created"
                                                                        ? "bg-green-600"
                                                                        : notification.eventType === "ticket_comment_added"
                                                                            ? "bg-blue-600"
                                                                            : notification.eventType === "ticket_status_changed"
                                                                                ? "bg-purple-600"
                                                                                : "bg-gray-600"
                                                                        }`} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
