import React from "react";
import { OrderItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import {
    Check,
    X,
    LayoutGrid,
    Home,
    CookingPot,
    User,
    Clock,
} from "lucide-react";

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderItem | null;
}

export default function OrderDetailModal({
    isOpen,
    onClose,
    order,
}: OrderDetailModalProps) {
    if (!order) return null;

    const formatIDR = (value: number | string) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value) || 0);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
                <DialogHeader className="flex-shrink-0 pb-3 border-b border-[#f1f5f9]">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-lg font-bold text-[#1e293b]">
                                Detail Pesanan #{order.id}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-[#64748b]">
                                {order.formatted_time || order.created_at}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {/* Info Pelanggan & Meja */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-xs text-[#94a3b8] block mb-1">
                                Pelanggan
                            </span>
                            <span className="font-semibold text-[#1e293b]">
                                {order.customer_name ||
                                    `Pelanggan #${order.id}`}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-[#94a3b8] block mb-1">
                                Meja
                            </span>
                            <span className="font-semibold text-[#1e293b]">
                                {order.table_number
                                    ? order.table_number < 10
                                        ? `0${order.table_number}`
                                        : order.table_number
                                    : "01"}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-[#94a3b8] block mb-1">
                                Lokasi
                            </span>
                            <span className="font-semibold text-[#1e293b] capitalize">
                                {order.location || "Indoor"}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-[#94a3b8] block mb-1">
                                Tipe
                            </span>
                            <span className="font-semibold text-[#1e293b] capitalize">
                                {order.order_type}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-[#94a3b8] block mb-1">
                                Waktu
                            </span>
                            <span className="font-semibold text-[#1e293b]">
                                {order.formatted_time ||
                                    order.relative_time ||
                                    "-"}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-[#94a3b8] block mb-1">
                                Status
                            </span>
                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${
                                    order.order_status === "cancelled"
                                        ? "bg-[#fee2e2] text-[#ef4444]"
                                        : "bg-[#dcfce7] text-[#16a34a]"
                                }`}
                            >
                                {order.order_status === "cancelled"
                                    ? "Dibatalkan"
                                    : "Selesai"}
                            </span>
                        </div>
                    </div>

                    {/* Item Pesanan */}
                    <div className="border-t border-[#f1f5f9] pt-4">
                        <h3 className="font-semibold text-[#1e293b] mb-3">
                            Item Pesanan
                        </h3>
                        <div className="space-y-2">
                            {order.order_items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center py-2 border-b border-[#f1f5f9] last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.menu_image && (
                                            <img
                                                src={
                                                    item.menu_image.startsWith(
                                                        "http",
                                                    ) ||
                                                    item.menu_image.startsWith(
                                                        "/",
                                                    )
                                                        ? item.menu_image
                                                        : `/storage/${item.menu_image}`
                                                }
                                                alt={item.menu_name}
                                                className="w-12 h-12 rounded-lg object-cover bg-[#f1f5f9]"
                                            />
                                        )}
                                        <div>
                                            <span className="font-medium text-[#1e293b] block">
                                                {item.menu_name}
                                            </span>
                                            <span className="text-xs text-[#94a3b8]">
                                                {item.notes &&
                                                    `Catatan: ${item.notes}`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold text-[#1e293b] block">
                                            x{item.quantity}
                                        </span>
                                        <span className="text-sm text-[#64748b]">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(
                                                Number(item.unit_price) || 0,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total & Pembayaran */}
                    <div className="border-t border-[#f1f5f9] pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#64748b]">Subtotal</span>
                            <span className="font-medium text-[#1e293b]">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                }).format(Number(order.total_price) || 0)}
                            </span>
                        </div>
                        {order.payment && (
                            <div className="flex justify-between text-sm">
                                <span className="text-[#64748b]">
                                    Pembayaran ({order.payment.payment_method})
                                </span>
                                <span
                                    className={`font-medium ${
                                        order.payment.payment_status === "done"
                                            ? "text-[#16a34a]"
                                            : "text-[#ef4444]"
                                    }`}
                                >
                                    {order.payment.payment_status === "done"
                                        ? "Lunas"
                                        : "Pending"}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 border-t border-[#f1f5f9]">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto bg-[#D91A20] hover:bg-[#b91c1c] text-white px-5 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
