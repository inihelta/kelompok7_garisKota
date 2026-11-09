import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Check,
    X,
    LayoutGrid,
    Home,
    CookingPot,
    CheckCircle,
    User,
    Clock,
} from "lucide-react";
import { OrderItem, PaginatedData } from "@/types/dashboard";
import Pagination from "@/Components/Pagination";
import OrderDetailModal from "@/Components/OrderDetailModal";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

interface PesananPageProps {
    auth: any;
    activeOrders?: OrderItem[];
    historyOrders?: PaginatedData<OrderItem>;
    stats?: {
        processing_count: number;
        completed_count: number;
    };
}

export default function Pesanan({
    auth,
    activeOrders,
    historyOrders,
    stats,
}: PesananPageProps) {
    const [activeTab, setActiveTab] = useState<"pesanan" | "riwayat">(
        "pesanan",
    );

    const activeList = activeOrders ?? [];
    const historyList = historyOrders?.data ?? [];

    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const [orderToCancel, setOrderToCancel] = useState<OrderItem | null>(null);

    const handleCompleteOrder = (order: OrderItem) => {
        router.put(
            `/orders/${order.id}/complete`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => router.reload(),
                onError: () => {},
            },
        );
    };

    const handleConfirmCancel = () => {
        if (!orderToCancel) return;
        router.put(
            `/orders/${orderToCancel.id}/cancel`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOrderToCancel(null);
                    router.reload();
                },
                onError: () => setOrderToCancel(null),
            },
        );
    };

    const formatIDR = (value: number | string) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value) || 0);

    const processingCount = stats?.processing_count ?? activeList.length;
    const completedCount = stats?.completed_count ?? historyOrders?.total ?? 0;

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Pesanan">
            <Head
                title={activeTab === "pesanan" ? "Pesanan" : "Riwayat Pesanan"}
            />

            <div className="flex flex-col gap-5 max-w-full">
                {/* 2 Stat Cards Header (Screenshot 1) */}
                {activeTab === "pesanan" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Card 1: Pesanan Diproses */}
                        <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                                <CookingPot className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-[#475569]">
                                Pesanan Diproses
                            </span>
                            <span className="text-2xl font-bold text-[#1e293b]">
                                {processingCount}
                            </span>
                        </div>

                        {/* Card 2: Pesanan Selesai */}
                        <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
                            <div className="w-10 h-10 rounded-lg bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-[#475569]">
                                Pesanan Selesai
                            </span>
                            <span className="text-2xl font-bold text-[#1e293b]">
                                {completedCount}
                            </span>
                        </div>
                    </div>
                )}

                {/* Tab Switcher Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab("pesanan")}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            activeTab === "pesanan"
                                ? "bg-[#D91A20] text-white shadow-xs"
                                : "bg-white text-[#475569] border border-[#d1d5db] hover:bg-gray-50"
                        }`}
                    >
                        Pesanan
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("riwayat")}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            activeTab === "riwayat"
                                ? "bg-[#D91A20] text-white shadow-xs"
                                : "bg-white text-[#475569] border border-[#d1d5db] hover:bg-gray-50"
                        }`}
                    >
                        Riwayat Pesanan
                    </button>
                </div>

                {activeTab === "pesanan" && (
                    <div>
                        {activeList.length === 0 ? (
                            <div className="border border-[#e5e7eb] rounded-xl p-12 text-center text-gray-400 bg-white">
                                Tidak ada pesanan yang sedang diproses.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activeList.map((order) => (
                                    <div
                                        key={order.id}
                                        className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col justify-between gap-4 shadow-xs transition-colors"
                                    >
                                        {/* Card Header */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-[#1e293b] text-base">
                                                    Pesanan #{order.id}
                                                </h3>
                                            </div>
                                            <span className="text-xs text-[#94a3b8]">
                                                {order.formatted_time ||
                                                    "16 Sept 2026, 12.21 PM"}
                                            </span>
                                        </div>

                                        {/* Badges Meja & Lokasi */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f1f5f9] text-[#475569] text-xs font-medium">
                                                <LayoutGrid className="w-3.5 h-3.5 text-[#64748b]" />
                                                <span>
                                                    Meja #
                                                    {order.table_number &&
                                                    order.table_number < 10
                                                        ? `0${order.table_number}`
                                                        : order.table_number ||
                                                          "01"}
                                                </span>
                                            </div>

                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f1f5f9] text-[#475569] text-xs font-medium capitalize">
                                                <Home className="w-3.5 h-3.5 text-[#64748b]" />
                                                <span>
                                                    {order.location || "Indoor"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Ringkasan Item & Total */}
                                        <div className="border-t border-[#f1f5f9] pt-3 flex flex-col gap-1.5 text-xs">
                                            <div className="flex justify-between text-[#64748b]">
                                                <span>
                                                    X{" "}
                                                    {order.order_items
                                                        ?.length ?? 1}{" "}
                                                    Items
                                                </span>
                                                <span className="font-medium text-[#1e293b]">
                                                    {formatIDR(
                                                        order.total_price,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-bold pt-1 border-t border-dashed border-[#f1f5f9]">
                                                <span className="text-[#1e293b]">
                                                    Total :
                                                </span>
                                                <span className="text-[#D91A20] text-base">
                                                    {formatIDR(
                                                        order.total_price,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons: ✓, ✕, Detail pesanan */}
                                        <div className="flex items-center justify-between gap-2 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                {/* Tombol ✓ Selesai */}
                                                <button
                                                    type="button"
                                                    title="Selesaikan pesanan"
                                                    onClick={() =>
                                                        handleCompleteOrder(
                                                            order,
                                                        )
                                                    }
                                                    className="w-9 h-9 rounded-lg bg-[#D91A20] hover:bg-[#b91c1c] text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>

                                                {/* Tombol ✕ Batalkan */}
                                                <button
                                                    type="button"
                                                    title="Batalkan pesanan"
                                                    onClick={() =>
                                                        setOrderToCancel(order)
                                                    }
                                                    className="w-9 h-9 rounded-lg border border-[#d1d5db] bg-white hover:bg-gray-50 text-[#64748b] flex items-center justify-center transition-all cursor-pointer"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Tombol Detail Pesanan */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedOrder(order)
                                                }
                                                className="px-4 h-9 rounded-lg bg-[#D91A20] hover:bg-[#b91c1c] text-white text-xs font-semibold flex items-center justify-center transition-all cursor-pointer shadow-xs"
                                            >
                                                Detail pesanan
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "riwayat" && (
                    <div className="border border-[#e5e7eb] rounded-xl p-4 bg-white flex flex-col gap-3 shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr>
                                        <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                            PELANGGAN
                                        </th>
                                        <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                            ID
                                        </th>
                                        <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                            NAMA MENU
                                        </th>
                                        <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                            WAKTU
                                        </th>
                                        <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] text-center w-[120px]">
                                            STATUS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(historyOrders?.data ?? []).length ===
                                    0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-center py-8 text-gray-400 text-sm"
                                            >
                                                Tidak ada riwayat pesanan.
                                            </td>
                                        </tr>
                                    ) : (
                                        (historyOrders?.data ?? []).map(
                                            (item) => (
                                                <tr
                                                    key={item.id}
                                                    className="hover:bg-gray-50/60 transition-colors"
                                                >
                                                    {/* Kolom PELANGGAN: Avatar bulat merah + Nama */}
                                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm text-[#334155]">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-[#D91A20] text-white flex items-center justify-center flex-shrink-0 font-bold">
                                                                <User className="w-5 h-5 text-white" />
                                                            </div>
                                                            <span className="font-semibold text-[#1e293b]">
                                                                {item.customer_name ||
                                                                    `Pelanggan #${item.id}`}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Kolom ID: #150 */}
                                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm font-semibold text-[#475569]">
                                                        #{item.id}
                                                    </td>

                                                    {/* Kolom NAMA MENU: Tombol Detail Pesanan */}
                                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedOrder(
                                                                    item,
                                                                )
                                                            }
                                                            className="px-3.5 py-1.5 rounded-full bg-[#D91A20] hover:bg-[#b91c1c] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1"
                                                        >
                                                            Detail Pesanan
                                                        </button>
                                                    </td>

                                                    {/* Kolom WAKTU: e.g. 15 Menit */}
                                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm text-[#475569]">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                            <span>
                                                                {item.relative_time ||
                                                                    item.formatted_time ||
                                                                    "-"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Kolom STATUS: Selesai / Dibatalkan */}
                                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-center">
                                                        {item.order_status ===
                                                        "cancelled" ? (
                                                            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#ef4444] inline-block">
                                                                Dibatalkan
                                                            </span>
                                                        ) : (
                                                            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#16a34a] inline-block">
                                                                Selesai
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Reusable Pagination di Footer Riwayat Pesanan */}
                        <Pagination
                            links={historyOrders?.links}
                            currentPage={historyOrders?.current_page ?? 1}
                            totalPages={historyOrders?.last_page ?? 1}
                            from={historyOrders?.from ?? 0}
                            to={historyOrders?.to ?? 0}
                            total={historyOrders?.total ?? 0}
                            itemName="pesanan"
                            onPageChange={(page) =>
                                router.get(
                                    `/dashboard/pesanan?page=${page}&tab=riwayat`,
                                    {
                                        preserveScroll: true,
                                    },
                                )
                            }
                        />
                    </div>
                )}
            </div>

            {/* Modal Detail Pesanan */}
            <OrderDetailModal
                isOpen={Boolean(selectedOrder)}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />

            {/* Dialog Konfirmasi Pembatalan Pesanan */}
            <Dialog
                open={Boolean(orderToCancel)}
                onOpenChange={(open) => {
                    if (!open) setOrderToCancel(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Batalkan Pesanan #{orderToCancel?.id}?
                        </DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan membatalkan pesanan milik{" "}
                            <span className="font-semibold text-gray-800">
                                {orderToCancel?.customer_name ||
                                    `Pelanggan #${orderToCancel?.id}`}
                            </span>
                            . Pesanan akan dipindahkan ke Riwayat dengan status
                            Dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOrderToCancel(null)}
                        >
                            Kembali
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmCancel}
                            className="bg-[#D91A20] hover:bg-[#b91c1c] text-white"
                        >
                            Ya, Batalkan Pesanan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
