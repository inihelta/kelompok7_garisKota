import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { echo } from "@laravel/echo-react";
import { OrderStatusData } from "@/types/customer";
import { formatIDR } from "@/lib/utils";
import { ErrorBoundary } from "@/Components/ErrorBoundary";
import {
    ArrowLeft,
    ThumbsUp,
    Coffee,
    UtensilsCrossed,
    Check,
    Store,
    RotateCw,
    PlusCircle,
    Copy,
    CheckCheck,
    MessageSquare,
    HelpCircle,
    Utensils,
    AlertTriangle,
    X,
    Loader2,
    MapPin,
    CreditCard,
} from "lucide-react";

interface OrderStatusProps {
    order: OrderStatusData;
}

function OrderStatusContent({ order }: OrderStatusProps) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [copied, setCopied] = useState(false);

    const isCompleted = order.order_status === "completed";
    const isCancelled = order.order_status === "cancelled";
    const isProcessing = order.order_status === "processing";
    const isPending = order.order_status === "pending";
    const isAwaitingPayment = order.order_status === "awaiting_payment";

    const canCancel = isAwaitingPayment;

    // Real-time updates via Laravel Reverb WebSocket (Zero Polling!)
    useEffect(() => {
        if (isCompleted || isCancelled) return;

        try {
            const channel = echo().channel("orders");

            channel.listen(".OrderStatusUpdated", (e: any) => {
                if (Number(e.id) === Number(order.id)) {
                    router.reload({
                        only: ["order"],
                    });
                }
            });

            return () => {
                echo().leaveChannel("orders");
            };
        } catch (err) {
            console.warn("Reverb WebSocket error:", err);
        }
    }, [order.id, isCompleted, isCancelled]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ["order"],
            onFinish: () => setIsRefreshing(false),
        });
    };

    const handleCancelOrder = () => {
        setIsCancelling(true);
        router.put(
            `/order/${order.id}/cancel`,
            {},
            {
                onSuccess: () => {
                    setShowCancelModal(false);
                },
                onError: (errors) => {
                    alert(errors.cancel || "Gagal membatalkan pesanan.");
                },
                onFinish: () => {
                    setIsCancelling(false);
                    setShowCancelModal(false);
                },
            },
        );
    };

    // Order Reference Code
    const orderRefCode =
        order.payment.ref || `GK-${String(order.id).padStart(5, "0")}`;

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(orderRefCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    // Current active step index in horizontal timeline (0 to 3)
    const currentStepIndex = isCancelled
        ? -1
        : isCompleted
          ? 3
          : isProcessing
            ? 2
            : isPending
              ? 1
              : isAwaitingPayment
                ? 0
                : 0;

    const timelineSteps = [
        {
            title: "Menunggu Bayar",
            label: "Bayar",
            icon: CreditCard,
        },
        {
            title: "Pesanan Diterima",
            label: "Diterima",
            icon: ThumbsUp,
        },
        {
            title: "Sedang Diracik",
            label: "Diracik",
            icon: Coffee,
        },
        {
            title: "Selesai",
            label: "Selesai",
            icon: Check,
        },
    ];

    // Progress percentage
    const progressWidth = isCancelled
        ? 0
        : isCompleted
          ? 100
          : isProcessing
            ? 75
            : isPending
              ? 35
              : isAwaitingPayment
                ? 10
                : 10;

    const whatsappKasirUrl = `https://wa.me/?text=${encodeURIComponent(
        `Halo Garis Kota Workspace & Coffee, saya pelanggan dari Meja #${order.table_number} (ID Pesanan: ${orderRefCode}). Saya ingin menanyakan status pesanan saya.`,
    )}`;

    return (
        <div className="min-h-screen bg-[#F6F7F9] text-gray-900 font-sans antialiased py-4 sm:py-6 lg:py-8 px-4 sm:px-6 overflow-x-hidden">
            <Head title={`Status Pesanan #${order.id}`} />

            <div className="max-w-6xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 space-y-4">
                        <div className="relative w-full h-36 md:h-44 rounded-2xl bg-gradient-to-r from-gray-100 via-gray-200/80 to-gray-100 border border-gray-200/80 shadow-xs flex items-center justify-center overflow-hidden">
                            <Link
                                href={
                                    order.table_token
                                        ? `/order/${order.table_token}`
                                        : "/"
                                }
                                className="absolute top-3 left-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-800 backdrop-blur-xs hover:bg-white hover:text-black active:scale-95 transition-all border border-gray-200/60"
                                title="Kembali ke Buku Menu"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Link>

                            <div className="text-center text-gray-400 select-none flex flex-col items-center justify-center">
                                <img
                                    src="/bnr6y75trf.jpeg"
                                    className="h-full w-full object-cover"
                                    alt=""
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-r from-[#BE1A1A] to-[#991515] p-5 text-white shadow-md flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-white/80">
                                    Status Pesanan
                                </p>
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                                    {isCancelled
                                        ? "Pesanan Dibatalkan"
                                        : isCompleted
                                          ? "Pesanan Selesai"
                                          : isProcessing
                                            ? "Sedang Diracik"
                                            : isAwaitingPayment
                                              ? "Menunggu Pembayaran"
                                              : "Pesanan Diterima"}
                                </h2>
                                <p className="text-[11px] text-white/80 font-medium mt-1">
                                    Dipesan: {order.formatted_time}
                                </p>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#BE1A1A] px-3.5 py-1 text-xs sm:text-sm font-black shadow-xs">
                                    <span>Meja #{order.table_number}</span>
                                </div>
                                <span className="text-[11px] text-white/80 font-medium capitalize mt-1">
                                    Area {order.location} • Dine-In
                                </span>
                            </div>
                        </div>

                        {/* 3. ORDER STATUS PROGRESS CARD */}
                        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-xs space-y-5">
                            {/* Status Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                                        {isCancelled
                                            ? "Pesanan telah dibatalkan"
                                            : isCompleted
                                              ? "Pesanan telah disajikan ke meja!"
                                              : isProcessing
                                                ? "Lagi memproses pembelianmu..."
                                                : isAwaitingPayment
                                                  ? "Menunggu pembayaran di kasir..."
                                                  : "Pesanan masuk ke dapur & barista..."}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {isCancelled
                                            ? "Pesanan ini tidak diproses."
                                            : isCompleted
                                              ? "Silakan nikmati hidanganmu. Terima kasih!"
                                              : isProcessing
                                                ? "Barista & koki sedang menyiapkan pesananmu."
                                                : isAwaitingPayment
                                                  ? "Silakan bayar di kasir (Tunai/QRIS) agar pesanan diproses."
                                                  : "Menunggu konfirmasi antrean barista."}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 active:scale-95 transition-all shrink-0 ml-2"
                                    title="Perbarui status"
                                >
                                    <RotateCw
                                        className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#BE1A1A]" : ""}`}
                                    />
                                </button>
                            </div>

                            {/* Horizontal Stepper Timeline */}
                            {!isCancelled && (
                                <div className="pt-2 pb-1">
                                    <div className="grid grid-cols-4">
                                        {timelineSteps.map((step, idx) => {
                                            const StepIcon = step.icon;
                                            const isPast =
                                                currentStepIndex > idx;
                                            const isCurrent =
                                                currentStepIndex === idx;
                                            const isPastOrCurrent =
                                                currentStepIndex >= idx;
                                            const isLast =
                                                idx ===
                                                timelineSteps.length - 1;

                                            return (
                                                <div
                                                    key={step.title}
                                                    className="relative flex flex-col items-center text-center"
                                                    title={step.title}
                                                >
                                                    {/* Connecting Line to next step */}
                                                    {!isLast && (
                                                        <div className="absolute top-5 sm:top-5.5 left-1/2 w-full h-1 -translate-y-1/2 z-0">
                                                            <div className="w-full h-full bg-gray-100" />
                                                            <div
                                                                className={`absolute top-0 left-0 h-full bg-[#BE1A1A] transition-all duration-500 ${
                                                                    isPast
                                                                        ? "w-full"
                                                                        : "w-0"
                                                                }`}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Step Circle */}
                                                    <div className="relative z-10">
                                                        <div
                                                            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all duration-300 ${
                                                                isPastOrCurrent
                                                                    ? "bg-[#BE1A1A] text-white shadow-sm ring-4 ring-red-100"
                                                                    : "bg-gray-100 text-gray-400 border border-gray-200"
                                                            } ${isCurrent && !isCompleted ? "scale-105" : ""}`}
                                                        >
                                                            <StepIcon className="h-4 sm:h-5 w-4 sm:w-5" />
                                                        </div>
                                                    </div>

                                                    {/* Step Label (Centering guaranteed directly under icon) */}
                                                    <span
                                                        className={`mt-2.5 text-[11px] sm:text-xs font-semibold px-0.5 leading-tight transition-colors ${
                                                            isPastOrCurrent
                                                                ? "text-[#BE1A1A] font-bold"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Store Location & Table Info Row */}
                            <div className="border-t border-dashed border-gray-200 pt-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#BE1A1A] border border-red-100">
                                        <Store className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                                            Garis Kota Workspace & Coffee
                                        </p>
                                        <p className="text-[11px] text-gray-400 capitalize">
                                            Meja #{order.table_number} • Area{" "}
                                            {order.location} • Pemesan:{" "}
                                            {order.customer_name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {canCancel && (
                                <div className="pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowCancelModal(true)}
                                        disabled={isCancelling}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/70 py-2.5 px-4 text-xs font-bold text-[#BE1A1A] hover:bg-red-100/70 active:scale-[0.99] transition-all disabled:opacity-50"
                                    >
                                        <span>Batalkan pembelian</span>
                                        {isCancelling && (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#BE1A1A]" />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 4. DESTINATION & TABLE CARD */}
                        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-xs">
                            <div className="relative pl-7 space-y-5">
                                {/* Connecting vertical line */}
                                <div className="absolute left-[13px] top-3.5 bottom-3.5 w-0.5 bg-gray-200" />

                                <div className="relative flex items-start gap-3">
                                    <div className="absolute -left-7 flex size-7.5 items-center justify-center rounded-full bg-red-50 text-[#BE1A1A] ring-4 ring-white shadow-2xs">
                                        <Store className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-xs font-bold text-gray-900 leading-tight">
                                            Garis Kota Workspace & Coffee
                                        </p>
                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            Dapur & Barista Counter
                                        </p>
                                    </div>
                                </div>

                                <div className="relative flex items-start gap-3">
                                    <div className="absolute -left-7 flex size-7.5 items-center justify-center rounded-full bg-[#BE1A1A] text-white shadow-xs ring-4 ring-white">
                                        <MapPin className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-xs font-bold text-gray-900 leading-tight">
                                            Meja #{order.table_number}{" "}
                                            <span className="font-semibold text-gray-500 uppercase text-[11px]">
                                                ({order.location})
                                            </span>
                                        </p>
                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            Pesanan akan diantar langsung oleh
                                            staf ke mejamu
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-xs flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-gray-900">
                                    Ada yang bisa dibantu?
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Staf dan barista kami siap membantumu di
                                    Meja #{order.table_number}.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowHelpModal(true)}
                                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#BE1A1A] text-[#BE1A1A] px-4 py-1.5 text-xs font-bold hover:bg-red-50 active:scale-95 transition-all"
                                >
                                    <HelpCircle className="h-3.5 w-3.5" />
                                    <span>Buka Pusat Bantuan</span>
                                </button>
                            </div>
                            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#BE1A1A]">
                                <MessageSquare className="h-7 w-7 opacity-80" />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
                        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-xs flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-semibold text-gray-400 block">
                                    ID Pesanan
                                </span>
                                <h4 className="text-base font-black tracking-tight text-gray-900 mt-0.5 font-mono">
                                    {orderRefCode}
                                </h4>
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                    {order.formatted_time}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopyCode}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                                    copied
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                }`}
                                title="Salin ID Pesanan"
                            >
                                {copied ? (
                                    <>
                                        <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                                        <span>Tersalin</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5 text-gray-500" />
                                        <span>Salin</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                                    Pembelian
                                </h3>
                                <span className="text-xs font-semibold text-gray-400">
                                    {order.order_items.reduce(
                                        (acc, i) => acc + i.quantity,
                                        0,
                                    )}{" "}
                                    Item
                                </span>
                            </div>

                            <div className="space-y-3.5">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900">
                                            <span className="truncate pr-2">
                                                {item.name}
                                            </span>
                                            <span className="shrink-0 font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>

                                        <div className="rounded-xl bg-gray-50/90 border border-gray-100 p-2.5 sm:p-3 text-[11px] text-gray-600 space-y-1 leading-relaxed">
                                            {item.notes ? (
                                                <p className="text-gray-700">
                                                    - Catatan :{" "}
                                                    <span className="font-medium text-[#BE1A1A]">
                                                        {item.notes}
                                                    </span>
                                                </p>
                                            ) : (
                                                <p className="text-gray-400 italic">
                                                    - Tanpa catatan khusus
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between text-gray-500 pt-0.5">
                                                <span>- Harga Satuan</span>
                                                <span className="font-medium">
                                                    {formatIDR(item.unit_price)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between font-bold text-gray-800 border-t border-gray-200/50 pt-1 mt-1">
                                                <span>- Subtotal</span>
                                                <span>
                                                    {formatIDR(
                                                        item.unit_price *
                                                            item.quantity,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white border border-gray-200/80 p-3.5 shadow-xs flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#BE1A1A]">
                                <Utensils className="h-4 w-4" />
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                                Peralatan makan, sedotan & tissue akan disiapkan
                                di meja
                            </span>
                        </div>

                        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-xs space-y-3.5">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900">
                                Ringkasan Pembayaran
                            </h3>

                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>Harga (Subtotal)</span>
                                    <span className="font-medium text-gray-800">
                                        {formatIDR(order.total_price)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Biaya Layanan & Meja</span>
                                    <span className="font-medium text-emerald-600">
                                        Gratis
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Metode Pembayaran</span>
                                    <span className="font-semibold text-gray-900">
                                        Bayar di Kasir (
                                        {order.payment.method.toUpperCase()})
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <span>Status Tagihan</span>
                                    <span
                                        className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-full ${
                                            order.payment.status === "done"
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : isAwaitingPayment
                                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                                        }`}
                                    >
                                        {order.payment.status === "done"
                                            ? "Lunas"
                                            : isAwaitingPayment
                                              ? "Menunggu Pembayaran di Kasir"
                                              : "Menunggu Pembayaran di Kasir"}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-900">
                                    Total Pembayaran
                                </span>
                                <span className="text-lg sm:text-xl font-black text-[#BE1A1A]">
                                    {formatIDR(order.total_price)}
                                </span>
                            </div>

                            {/* Informational Notice */}
                            <div className="rounded-xl bg-amber-50/70 border border-amber-200/60 p-3 text-[11px] text-amber-800 flex items-start gap-2">
                                <CreditCard className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                                <span>
                                    Pembayaran dapat dilakukan di meja kasir
                                    setelah hidangan disajikan atau sebelum
                                    meninggalkan kafe.
                                </span>
                            </div>
                        </div>

                        {/* 10. ACTION BUTTONS: Pesan Tambahan & Refresh */}
                        <div className="space-y-2.5 pt-1 pb-4">
                            {order.table_token && !isCancelled && (
                                <Link
                                    href={`/order/${order.table_token}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#BE1A1A] py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-red-900/20 hover:bg-[#a51515] active:scale-[0.98] transition-all"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Pesan Menu Tambahan</span>
                                </Link>
                            )}

                            {isCancelled && order.table_token && (
                                <Link
                                    href={`/order/${order.table_token}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#BE1A1A] py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-red-900/20 hover:bg-[#a51515] active:scale-[0.98] transition-all"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Pesan Menu Baru</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm sm:text-base">
                                <AlertTriangle className="h-5 w-5" />
                                <span>Batalkan Pesanan?</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCancelModal(false)}
                                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Pesanan ini masih berstatus <strong>Menunggu Pembayaran</strong>. Jika dibatalkan, stok menu akan dikembalikan dan pesanan tidak akan diracik oleh dapur.
                        </p>

                        <div className="pt-2 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                            >
                                Tidak, Tetap Pesan
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelOrder}
                                disabled={isCancelling}
                                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                            >
                                {isCancelling && (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                )}
                                <span>Ya, Batalkan</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Help & Info Modal */}
            {showHelpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="w-full max-w-sm sm:max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm sm:text-base">
                                <HelpCircle className="h-5 w-5 text-[#BE1A1A]" />
                                <span>
                                    Pusat Bantuan Meja #{order.table_number}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowHelpModal(false)}
                                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-2.5 text-xs text-gray-600 leading-relaxed">
                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <p className="font-semibold text-gray-800 mb-0.5">
                                    ☕ Penyajian Pesanan
                                </p>
                                <p>
                                    Pesananmu akan disajikan langsung oleh staf
                                    kami ke Meja #{order.table_number} (
                                    {order.location}).
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <p className="font-semibold text-gray-800 mb-0.5">
                                    💳 Pembayaran di Kasir
                                </p>
                                <p>
                                    Pembayaran dapat dilakukan langsung di kasir
                                    (Tunai / QRIS) dengan menyebutkan ID Pesanan{" "}
                                    <strong>{orderRefCode}</strong> atau Meja #
                                    {order.table_number}.
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <p className="font-semibold text-gray-800 mb-0.5">
                                    🙋 Butuh Bantuan Tambahan?
                                </p>
                                <p>
                                    Jika membutuhkan sedotan, sendok, air
                                    hangat, atau ingin mengubah pesanan, silakan
                                    panggil staf terdekat di area kafe atau
                                    hubungi WhatsApp kasir.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setShowHelpModal(false)}
                                className="w-full rounded-xl bg-[#BE1A1A] py-2.5 text-xs font-bold text-white hover:bg-[#a51515] transition-all"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function OrderStatus(props: OrderStatusProps) {
    return (
        <ErrorBoundary>
            <OrderStatusContent {...props} />
        </ErrorBoundary>
    );
}
