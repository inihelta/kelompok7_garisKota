import React, { useState, useEffect, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import {
    ShoppingBag,
    AlertTriangle,
    Package,
    Coffee,
    CheckCircle2,
    Bell,
    Check,
    Loader2,
    CookingPot,
    XCircle,
    LayoutGrid,
    Utensils,
    RefreshCw,
} from "lucide-react";
import { NotificationItem, NotificationCounts } from "@/types/dashboard";
import { echo } from "@laravel/echo-react";

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onUnreadCountChange?: (count: number) => void;
}

export default function NotificationDropdown({
    isOpen,
    onClose,
    onUnreadCountChange,
}: NotificationDropdownProps) {
    const [tab, setTab] = useState<"all" | "unread" | "order" | "stock" | "changes">("all");
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [counts, setCounts] = useState<NotificationCounts>({
        all: 0,
        unread: 0,
        order: 0,
        stock: 0,
        changes: 0,
    });
    const [loading, setLoading] = useState(false);
    const [echoConnected, setEchoConnected] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch notifications from API
    const fetchNotifications = async (selectedTab = tab) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/notifications?tab=${selectedTab}&limit=15`);
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setCounts(data.counts || { all: 0, unread: 0, order: 0, stock: 0 });
                if (onUnreadCountChange) {
                    onUnreadCountChange(data.unread_count || 0);
                }
            }
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    // Start polling fallback (every 30s) when Echo is not connected
    useEffect(() => {
        if (!echoConnected) {
            // Initial fetch
            fetchNotifications(tab);
            
            // Poll every 30 seconds
            pollIntervalRef.current = setInterval(() => {
                fetchNotifications(tab);
            }, 30000);
        }
        
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [echoConnected, tab]);

    // Close on click outside

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Initial load and tab change
    useEffect(() => {
        fetchNotifications(tab);
    }, [tab]);

    // Real-time listener via Laravel Echo & Reverb
    useEffect(() => {
        let channel: any = null;
        try {
            channel = echo().channel("notifications");
            
            // Mark Echo as connected when we successfully subscribe
            channel.listen(".NotificationCreated", (newNotif: NotificationItem) => {
                setNotifications((prev) => [newNotif, ...prev]);
                const isChange = [
                    "order_processing",
                    "order_ready",
                    "order_cancelled",
                    "order_change",
                    "stock_update",
                    "table_update",
                    "menu_update",
                ].includes(newNotif.category);

                setCounts((prev) => ({
                    ...prev,
                    all: prev.all + 1,
                    unread: prev.unread + 1,
                    order: newNotif.type === "order" ? prev.order + 1 : prev.order,
                    stock: newNotif.type === "stock" ? prev.stock + 1 : prev.stock,
                    changes: isChange ? (prev.changes || 0) + 1 : prev.changes,
                }));
                if (onUnreadCountChange) {
                    onUnreadCountChange((counts.unread || 0) + 1);
                }
            });
            
            // Set connected state after a short delay to allow subscription
            const connectTimer = setTimeout(() => setEchoConnected(true), 1000);
            
            return () => {
                clearTimeout(connectTimer);
                if (channel) {
                    try {
                        echo().leaveChannel("notifications");
                    } catch (e) {}
                    setEchoConnected(false);
                }
            };
        } catch (e) {
            console.warn("Echo notifications channel not available:", e);
            setEchoConnected(false);
        }
    }, []);

    // Mark single notification as read
    const handleItemClick = async (notif: NotificationItem) => {
        if (!notif.is_read) {
            try {
                // Optimistic update
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
                );
                const nextUnread = Math.max(0, counts.unread - 1);
                setCounts((prev) => ({ ...prev, unread: nextUnread }));
                if (onUnreadCountChange) {
                    onUnreadCountChange(nextUnread);
                }

                // API call
                const csrfToken =
                    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                        ?.content || "";
                await fetch(`/api/notifications/${notif.id}/read`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                        Accept: "application/json",
                    },
                });
            } catch (err) {
                console.error("Failed to mark notification as read:", err);
            }
        }

        onClose();
        if (notif.action_url) {
            router.visit(notif.action_url);
        }
    };

    // Mark all as read
    const handleMarkAllRead = async () => {
        try {
            // Optimistic update
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setCounts((prev) => ({ ...prev, unread: 0 }));
            if (onUnreadCountChange) {
                onUnreadCountChange(0);
            }

            const csrfToken =
                (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                    ?.content || "";
            const res = await fetch(`/api/notifications/mark-all-read`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
            });

            if (res.ok) {
                if (tab === "unread") {
                    setNotifications([]);
                }
            } else {
                console.error("Failed to mark all as read: HTTP", res.status);
            }
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    if (!isOpen) return null;

    // Helper for category icon & color theme
    const renderIcon = (category: string) => {
        switch (category) {
            case "new_order":
                return (
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                    </div>
                );
            case "order_processing":
                return (
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center flex-shrink-0">
                        <CookingPot className="w-4 h-4" />
                    </div>
                );
            case "order_ready":
                return (
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Coffee className="w-4 h-4" />
                    </div>
                );
            case "order_cancelled":
                return (
                    <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-4 h-4" />
                    </div>
                );
            case "stock_empty":
                return (
                    <div className="w-9 h-9 rounded-full bg-red-50 text-[#D91A20] border border-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                );
            case "stock_low":
                return (
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4" />
                    </div>
                );
            case "stock_update":
                return (
                    <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                        <RefreshCw className="w-4 h-4" />
                    </div>
                );
            case "table_update":
                return (
                    <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0">
                        <LayoutGrid className="w-4 h-4" />
                    </div>
                );
            case "menu_update":
                return (
                    <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center flex-shrink-0">
                        <Utensils className="w-4 h-4" />
                    </div>
                );
            default:
                return (
                    <div className="w-9 h-9 rounded-full bg-gray-50 text-gray-600 border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4" />
                    </div>
                );
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-10 mt-2 w-[340px] sm:w-[420px] bg-white border border-[#e5e7eb] rounded-2xl shadow-xl z-50 overflow-hidden text-[#1e293b] animate-in fade-in zoom-in-95 duration-150"
        >
            {/* Header */}
            <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-[#f1f5f9]">
                <h3 className="font-bold text-sm text-[#1e293b]">Notifikasi</h3>
                {counts.unread > 0 && (
                    <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-xs font-semibold text-[#D91A20] hover:text-[#b91c1c] hover:underline cursor-pointer transition-colors"
                    >
                        Tandai semua dibaca
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-3.5 px-4 pt-2.5 pb-2 border-b border-[#f1f5f9] text-xs font-semibold text-[#64748b] overflow-x-auto no-scrollbar">
                <button
                    type="button"
                    onClick={() => setTab("all")}
                    className={`pb-1 transition-colors relative cursor-pointer shrink-0 ${
                        tab === "all"
                            ? "text-[#D91A20] font-bold border-b-2 border-[#D91A20] -mb-[9px]"
                            : "hover:text-[#1e293b]"
                    }`}
                >
                    Semua
                </button>

                <button
                    type="button"
                    onClick={() => setTab("unread")}
                    className={`pb-1 flex items-center gap-1.5 transition-colors relative cursor-pointer shrink-0 ${
                        tab === "unread"
                            ? "text-[#D91A20] font-bold border-b-2 border-[#D91A20] -mb-[9px]"
                            : "hover:text-[#1e293b]"
                    }`}
                >
                    <span>Belum dibaca</span>
                    {counts.unread > 0 && (
                        <span className="bg-[#D91A20] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                            {counts.unread}
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setTab("order")}
                    className={`pb-1 transition-colors relative cursor-pointer shrink-0 ${
                        tab === "order"
                            ? "text-[#D91A20] font-bold border-b-2 border-[#D91A20] -mb-[9px]"
                            : "hover:text-[#1e293b]"
                    }`}
                >
                    Pesanan
                </button>

                <button
                    type="button"
                    onClick={() => setTab("stock")}
                    className={`pb-1 transition-colors relative cursor-pointer shrink-0 ${
                        tab === "stock"
                            ? "text-[#D91A20] font-bold border-b-2 border-[#D91A20] -mb-[9px]"
                            : "hover:text-[#1e293b]"
                    }`}
                >
                    Stok
                </button>

                <button
                    type="button"
                    onClick={() => setTab("changes")}
                    className={`pb-1 transition-colors relative cursor-pointer shrink-0 ${
                        tab === "changes"
                            ? "text-[#D91A20] font-bold border-b-2 border-[#D91A20] -mb-[9px]"
                            : "hover:text-[#1e293b]"
                    }`}
                >
                    Perubahan
                </button>
            </div>

            {/* Notification Items List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-[#f1f5f9]">
                {loading && notifications.length === 0 ? (
                    <div className="flex items-center justify-center py-10 text-gray-400 text-xs gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#D91A20]" />
                        <span>Memuat notifikasi...</span>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-10 px-4 text-gray-400 text-xs">
                        Tidak ada notifikasi {tab === "unread" ? "belum dibaca" : ""}.
                    </div>
                ) : (
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`p-3.5 flex items-start gap-3 hover:bg-[#f8fafc] transition-colors cursor-pointer ${
                                !item.is_read ? "bg-[#fef2f2]/40" : ""
                            }`}
                        >
                            {renderIcon(item.category)}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-xs font-semibold text-[#1e293b] truncate">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="text-[11px] text-gray-400">
                                            {item.time_ago || "baru saja"}
                                        </span>
                                        {!item.is_read && (
                                            <span className="w-2 h-2 rounded-full bg-[#D91A20]" />
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs text-[#64748b] mt-1 line-clamp-2 leading-relaxed">
                                    {item.message}
                                </p>

                                {item.tag && (
                                    <div className="mt-2">
                                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#f1f5f9] border border-[#e2e8f0] text-[10px] font-medium text-[#475569]">
                                            {item.tag}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#f1f5f9] bg-[#f8fafc]">
                <Link
                    href="/dashboard/notifikasi"
                    onClick={onClose}
                    className="block w-full py-2.5 text-center text-xs font-semibold text-[#D91A20] hover:text-[#b91c1c] hover:bg-[#fee2e2]/40 transition-colors cursor-pointer"
                >
                    Lihat semua notifikasi
                </Link>
            </div>
        </div>
    );
}
