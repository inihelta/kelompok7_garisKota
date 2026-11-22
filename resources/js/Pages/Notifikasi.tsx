import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Bell,
    ShoppingBag,
    AlertTriangle,
    Package,
    Coffee,
    Search,
    Check,
    CheckCheck,
    Clock,
} from "lucide-react";
import { NotificationItem, NotificationCounts, PaginatedData } from "@/types/dashboard";
import Pagination from "@/Components/Pagination";
import { toast } from "sonner";

interface NotifikasiPageProps {
    auth: any;
    notifications: PaginatedData<NotificationItem>;
    currentTab?: string;
    searchQuery?: string;
    unreadCount?: number;
    counts?: NotificationCounts;
}

export default function Notifikasi({
    auth,
    notifications,
    currentTab = "all",
    searchQuery = "",
    unreadCount = 0,
    counts = { all: 0, unread: 0, order: 0, stock: 0 },
}: NotifikasiPageProps) {
    const [search, setSearch] = useState(searchQuery);

    const handleTabChange = (newTab: string) => {
        router.get(
            "/dashboard/notifikasi",
            { tab: newTab, search: search || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/dashboard/notifikasi",
            { tab: currentTab, search: search || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleMarkAllRead = async () => {
        try {
            const csrfToken =
                (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                    ?.content || "";
            const res = await fetch("/api/notifications/mark-all-read", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
            });
            if (res.ok) {
                toast.success("Semua notifikasi ditandai sebagai dibaca");
                router.reload({ preserveScroll: true });
            }
        } catch (e) {
            toast.error("Gagal menandai semua dibaca");
        }
    };

    const handleItemClick = async (item: NotificationItem) => {
        if (!item.is_read) {
            try {
                const csrfToken =
                    (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                        ?.content || "";
                await fetch(`/api/notifications/${item.id}/read`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                        Accept: "application/json",
                    },
                });
            } catch (e) {}
        }

        if (item.action_url) {
            router.visit(item.action_url);
        }
    };

    const renderIcon = (category: string) => {
        switch (category) {
            case "new_order":
                return (
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                );
            case "order_ready":
                return (
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Coffee className="w-5 h-5" />
                    </div>
                );
            case "stock_empty":
                return (
                    <div className="w-10 h-10 rounded-full bg-red-50 text-[#D91A20] border border-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                );
            case "stock_low":
            default:
                return (
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5" />
                    </div>
                );
        }
    };

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Notifikasi">
            <Head title="Notifikasi" />

            <div className="flex flex-col gap-5 max-w-full">
                {/* Header Title & Actions */}
                <div className="flex items-center justify-between flex-wrap gap-4 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                            <Bell className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#1e293b]">
                                Notifikasi
                            </h1>
                            <p className="text-xs text-[#64748b]">
                                Riwayat seluruh aktivitas pesanan dan peringatan stok.
                            </p>
                        </div>
                    </div>

                    {counts.unread > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                            <CheckCheck className="w-4 h-4 text-[#D91A20]" />
                            <span>Tandai Semua Dibaca</span>
                        </button>
                    )}
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="border border-[#e5e7eb] rounded-2xl p-4 bg-white flex flex-col gap-4 shadow-xs">
                    <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-gray-100">
                        {/* Tabs */}
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                            {[
                                { key: "all", label: "Semua", count: counts.all },
                                { key: "unread", label: "Belum Dibaca", count: counts.unread },
                                { key: "order", label: "Pesanan", count: counts.order },
                                { key: "stock", label: "Stok", count: counts.stock },
                            ].map((tabItem) => (
                                <button
                                    key={tabItem.key}
                                    type="button"
                                    onClick={() => handleTabChange(tabItem.key)}
                                    className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        currentTab === tabItem.key
                                            ? "bg-[#D91A20] text-white shadow-xs"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    <span>{tabItem.label}</span>
                                    {tabItem.count > 0 && (
                                        <span
                                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                                currentTab === tabItem.key
                                                    ? "bg-white/20 text-white"
                                                    : "bg-gray-300 text-gray-800"
                                            }`}
                                        >
                                            {tabItem.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <form
                            onSubmit={handleSearchSubmit}
                            className="relative flex items-center w-full sm:w-64"
                        >
                            <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari notifikasi..."
                                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 outline-none focus:border-[#D91A20] transition-colors"
                            />
                        </form>
                    </div>

                    {/* Notification Cards List */}
                    <div className="divide-y divide-gray-100">
                        {notifications && notifications.data && notifications.data.length > 0 ? (
                            notifications.data.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className={`py-3.5 px-3 rounded-xl flex items-start gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer ${
                                        !item.is_read ? "bg-red-50/20" : ""
                                    }`}
                                >
                                    {renderIcon(item.category)}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-[#1e293b]">
                                                    {item.title}
                                                </h4>
                                                {!item.is_read && (
                                                    <span className="w-2 h-2 rounded-full bg-[#D91A20]" />
                                                )}
                                            </div>
                                            <span className="text-xs text-[#94a3b8] flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{item.time_ago || "baru saja"}</span>
                                            </span>
                                        </div>

                                        <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                                            {item.message}
                                        </p>

                                        {item.tag && (
                                            <div className="mt-2">
                                                <span className="inline-block px-2.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[11px] font-semibold text-gray-600">
                                                    {item.tag}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 text-gray-400 text-xs">
                                Belum ada notifikasi pada kategori ini.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {notifications && notifications.links && (
                        <div className="pt-2 border-t border-gray-100">
                            <Pagination
                                links={notifications.links}
                                from={notifications.from}
                                to={notifications.to}
                                total={notifications.total}
                                itemName="notifikasi"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
