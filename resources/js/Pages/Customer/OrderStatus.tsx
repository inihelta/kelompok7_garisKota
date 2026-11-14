import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { OrderStatusData } from "@/types/customer";
import { formatIDR, getImageSrc } from "@/lib/utils";
import { ImageWithFallback } from "@/Components/ui/ImageWithFallback";
import {
    CheckCircle2,
    Clock,
    CookingPot,
    Store,
    RotateCw,
    PlusCircle,
    ArrowLeft,
    Sparkles,
    AlertCircle,
    MapPin,
    User,
} from "lucide-react";

interface OrderStatusProps {
    order: OrderStatusData;
}

export default function OrderStatus({ order }: OrderStatusProps) {
    const isCompleted = order.order_status === "completed";
    const isCancelled = order.order_status === "cancelled";
    const isProcessing = order.order_status === "processing";
    const isPending = order.order_status === "pending";

    const handleRefresh = () => {
        router.reload();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans antialiased py-6 px-4">
            <Head title={`Status Pesanan #${order.id} - Garis Kota`} />

            <div className="mx-auto max-w-md space-y-4">
                {/* Top Success Banner */}
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-3 shadow-xs">
                        {isCompleted ? (
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        ) : isCancelled ? (
                            <AlertCircle className="h-8 w-8 text-rose-500" />
                        ) : isProcessing ? (
                            <CookingPot className="h-8 w-8 text-amber-500 animate-bounce" />
                        ) : (
                            <Sparkles className="h-8 w-8 text-emerald-600 animate-pulse" />
                        )}
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        Pesanan Terkirim
                    </span>
                    <h1 className="mt-2 text-xl font-black text-gray-900">
                        {isCompleted
                            ? "Pesanan Telah Selesai!"
                            : isCancelled
                            ? "Pesanan Dibatalkan"
                            : isProcessing
                            ? "Pesanan Sedang Disiapkan"
                            : "Pesanan Diterima Dapur"}
                    </h1>
                    <p className="mt-1 text-xs text-gray-500">
                        ID Pesanan: <span className="font-bold text-gray-800">#ORD-{order.id}</span>
                        {" • "}
                        {order.formatted_time}
                    </p>

                    {/* Refresh status button */}
                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-2xs hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <RotateCw className="h-3.5 w-3.5" />
                        <span>Perbarui Status</span>
                    </button>
                </div>

                {/* Progress Steps Card */}
                {!isCancelled && (
                    <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                            Lacak Pesanan
                        </h3>

                        <div className="space-y-4">
                            {/* Step 1: Pesanan Masuk */}
                            <div className="flex items-start gap-3">
                                <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                        isPending || isProcessing || isCompleted
                                            ? "bg-emerald-600 text-white"
                                            : "bg-gray-100 text-gray-400"
                                    }`}
                                >
                                    ✓
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-gray-900">
                                        Pesanan Diterima
                                    </h4>
                                    <p className="text-[11px] text-gray-500">
                                        Pesananmu sudah masuk ke sistem kasir & dapur.
                                    </p>
                                </div>
                            </div>

                            {/* Connecting Line */}
                            <div className="ml-4 h-4 w-0.5 bg-emerald-200" />

                            {/* Step 2: Dibuat oleh Barista/Koki */}
                            <div className="flex items-start gap-3">
                                <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                        isProcessing || isCompleted
                                            ? "bg-emerald-600 text-white"
                                            : "bg-gray-100 text-gray-400"
                                    }`}
                                >
                                    {isProcessing ? "⏳" : isCompleted ? "✓" : "2"}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-gray-900">
                                        Sedang Disiapkan
                                    </h4>
                                    <p className="text-[11px] text-gray-500">
                                        Barista & koki sedang meracik hidanganmu.
                                    </p>
                                </div>
                            </div>

                            {/* Connecting Line */}
                            <div
                                className={`ml-4 h-4 w-0.5 ${
                                    isCompleted ? "bg-emerald-200" : "bg-gray-200"
                                }`}
                            />

                            {/* Step 3: Siap Disajikan */}
                            <div className="flex items-start gap-3">
                                <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                        isCompleted
                                            ? "bg-emerald-600 text-white"
                                            : "bg-gray-100 text-gray-400"
                                    }`}
                                >
                                    {isCompleted ? "✓" : "3"}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-gray-900">
                                        Disajikan ke Meja
                                    </h4>
                                    <p className="text-[11px] text-gray-500">
                                        Pesanan diantar ke mejamu. Selamat menikmati!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Meja & Pemesan */}
                <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-2xl bg-gray-50 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Meja
                        </span>
                        <p className="mt-1 font-bold text-gray-900 text-sm">
                            Meja #{order.table_number}
                        </p>
                        <p className="text-[11px] text-gray-500 capitalize">
                            Area {order.location}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <User className="h-3 w-3" /> Pemesan
                        </span>
                        <p className="mt-1 font-bold text-gray-900 text-sm truncate">
                            {order.customer_name}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-medium">
                            Dine-In
                        </p>
                    </div>
                </div>

                {/* Items Summary Card */}
                <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                        Item yang Dipesan
                    </h3>

                    <div className="divide-y divide-gray-100">
                        {order.order_items.map((item) => (
                            <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-gray-900">
                                        {item.quantity}x {item.name}
                                    </h4>
                                    {item.notes && (
                                        <p className="text-[11px] text-emerald-700 italic">
                                            Catatan: {item.notes}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs font-semibold text-gray-800">
                                    {formatIDR(item.unit_price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Ringkasan Biaya */}
                    <div className="mt-4 border-t border-dashed border-gray-200 pt-3 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-500">Total Pembayaran</span>
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                                <Store className="h-3.5 w-3.5" />
                                <span>Bayar di Kasir ({order.payment.status === "done" ? "Lunas" : "Belum Bayar"})</span>
                            </div>
                        </div>
                        <span className="text-base font-black text-gray-900">
                            {formatIDR(order.total_price)}
                        </span>
                    </div>
                </div>

                {/* Bottom Action: Pesan Lagi */}
                {order.table_token && (
                    <div className="pt-2">
                        <Link
                            href={`/order/${order.table_token}`}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 px-4 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-700 active:scale-[0.98] transition-all"
                        >
                            <PlusCircle className="h-4 w-4" />
                            <span>Pesan Menu Tambahan</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

