import { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import { echo } from "@laravel/echo-react";
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
    LucideProps,
    Volume2,
    VolumeX,
    RotateCw,
    Bell,
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
const PesananDiproses = ({
    color = "currentColor",
    size = 28,
    className = "",
    ...props
}: LucideProps) => (
    <svg
        width={size}
        height={(Number(size) * 27) / 28}
        viewBox="0 0 27 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lucide ${className}`}
        {...props}
    >
        <path
            d="M6.68327 5.51013C7.0125 3.9517 7.86737 2.55378 9.1046 1.55061C10.3418 0.547451 11.8863 0 13.4791 0C15.0719 0 16.6164 0.547451 17.8536 1.55061C19.0908 2.55378 19.9457 3.9517 20.2749 5.51013C21.6476 5.56919 22.9709 6.039 24.0735 6.85874C25.3999 7.85596 26.3263 9.32541 26.7277 10.9296C27.536 14.1685 26.1847 17.4101 23.2013 18.9615V19.4504H3.75688V18.9615C0.773544 17.4101 -0.577845 14.1685 0.230488 10.9296C0.631877 9.32541 1.55827 7.85596 2.88466 6.85874C3.98727 6.039 5.31059 5.56919 6.68327 5.51013ZM3.75688 23.6171V22.2282H23.2013V23.6171C23.2013 24.7221 22.7623 25.7819 21.9809 26.5634C21.1995 27.3448 20.1397 27.7837 19.0347 27.7837H7.92354C6.81848 27.7837 5.75867 27.3448 4.97727 26.5634C4.19586 25.7819 3.75688 24.7221 3.75688 23.6171Z"
            fill={color}
        />
    </svg>
);
const PesananSelesai = ({
    color = "currentColor",
    size = 34,
    className = "",
    ...props
}: LucideProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lucide ${className}`}
        {...props}
    >
        <g clip-path="url(#clip0_1204_3600)">
            <path
                d="M13.4861 23.7916C13.567 23.7566 13.6316 23.692 13.6666 23.6111C13.7014 23.5265 13.7014 23.4317 13.6666 23.3472L9.79164 14.875C7.63886 10.1527 8.33331 5.66663 11.5416 2.97218C11.6268 2.90393 11.6944 2.81619 11.7385 2.71636C11.7827 2.61653 11.8022 2.50754 11.7954 2.3986C11.7886 2.28965 11.7556 2.18394 11.6994 2.09039C11.6432 1.99683 11.5652 1.91818 11.4722 1.86107C10.4342 1.17397 9.23515 0.769088 7.99311 0.686285C6.75107 0.603482 5.50888 0.845618 4.38886 1.38885C0.222198 3.3194 -1.16669 7.93051 1.08331 12.8611L7.04164 25.9166C7.12022 26.085 7.2618 26.2157 7.43587 26.2807C7.60993 26.3456 7.80254 26.3396 7.9722 26.2638L13.4861 23.7916ZM8.83331 28.1944C8.6662 28.2711 8.53634 28.411 8.4722 28.5833C8.40193 28.757 8.40193 28.9512 8.4722 29.125L9.06942 30.4305C9.22284 30.7647 9.50255 31.0245 9.8472 31.1527C10.1853 31.2917 10.5646 31.2917 10.9028 31.1527L15.4861 29.0694C15.6491 28.9871 15.7772 28.8491 15.8472 28.6805C15.9167 28.5114 15.9167 28.3218 15.8472 28.1527L14.8194 25.9027C14.8029 25.8594 14.7776 25.82 14.745 25.787C14.7124 25.7541 14.6732 25.7283 14.6301 25.7113C14.587 25.6943 14.5408 25.6865 14.4945 25.6884C14.4481 25.6902 14.4027 25.7018 14.3611 25.7222L8.83331 28.1944Z"
                fill={color}
            />
            <path
                d="M30.8334 21.8194C30.9163 21.7821 30.9909 21.7285 31.0527 21.6619C31.1146 21.5952 31.1624 21.5169 31.1935 21.4314C31.2246 21.346 31.2382 21.2552 31.2336 21.1644C31.229 21.0735 31.2063 20.9846 31.1667 20.9027L30.8472 20.1805C30.6469 19.7461 30.598 19.2571 30.7084 18.7916L32.625 10.5972C32.7421 9.78531 32.5715 8.95808 32.1427 8.25882C31.7139 7.55956 31.054 7.03233 30.2774 6.7685C29.5007 6.50466 28.6562 6.52085 27.8902 6.81424C27.1242 7.10764 26.485 7.65977 26.0834 8.37494C26.0566 8.43335 26.0135 8.48279 25.9593 8.51728C25.9051 8.55178 25.8421 8.56987 25.7778 8.56939C25.7128 8.56543 25.6501 8.54398 25.5963 8.5073C25.5425 8.47063 25.4997 8.4201 25.4723 8.36105L25.2084 7.79161C22.9584 2.86105 18.5973 0.847163 14.375 2.77772C10.1528 4.70827 8.80558 9.36105 11.1111 14.2916L17.0834 27.3611C17.1591 27.5284 17.2982 27.6589 17.47 27.724C17.6418 27.7891 17.8324 27.7834 18 27.7083L30.8334 21.8194ZM32.5278 27.2083C32.6941 27.132 32.8436 27.0236 32.9679 26.8894C33.0921 26.7552 33.1886 26.5977 33.2519 26.4261C33.3151 26.2544 33.3438 26.072 33.3364 25.8892C33.3289 25.7065 33.2854 25.527 33.2084 25.3611L32.6111 24.0555C32.5745 23.9719 32.5211 23.8967 32.4542 23.8346C32.3873 23.7725 32.3083 23.7247 32.2223 23.6944C32.0532 23.6249 31.8635 23.6249 31.6945 23.6944L18.8056 29.5694C18.6382 29.6452 18.5077 29.7842 18.4426 29.956C18.3776 30.1278 18.3832 30.3184 18.4584 30.4861L19.0556 31.7916C19.1306 31.9591 19.238 32.11 19.3717 32.2357C19.5054 32.3614 19.6627 32.4594 19.8344 32.524C20.0062 32.5885 20.189 32.6184 20.3724 32.6119C20.5558 32.6054 20.7361 32.5626 20.9028 32.4861L32.5278 27.2083Z"
                fill={color}
            />
        </g>
        <defs>
            <clipPath id="clip0_1204_3600">
                <rect width="33.3333" height="33.3333" fill="white" />
            </clipPath>
        </defs>
    </svg>
);
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
    const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("admin_order_sound") !== "false";
        }
        return true;
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

    const isInitialMount = useRef(true);
    const prevOrderIdsRef = useRef<Set<number>>(
        new Set(activeList.map((o) => o.id)),
    );

    // Web Audio API: 3-tone harmonic cafe chime (C5 -> E5 -> G5)
    const playOrderChime = () => {
        try {
            const AudioContextClass =
                window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            if (ctx.state === "suspended") {
                ctx.resume();
            }

            const now = ctx.currentTime;

            // Tone 1: C5 (523.25 Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(523.25, now);
            gain1.gain.setValueAtTime(0.25, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.6);

            // Tone 2: E5 (659.25 Hz)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(659.25, now + 0.12);
            gain2.gain.setValueAtTime(0.3, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.12);
            osc2.stop(now + 0.9);

            // Tone 3: G5 (783.99 Hz)
            const osc3 = ctx.createOscillator();
            const gain3 = ctx.createGain();
            osc3.type = "sine";
            osc3.frequency.setValueAtTime(783.99, now + 0.24);
            gain3.gain.setValueAtTime(0.35, now + 0.24);
            gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            osc3.connect(gain3);
            gain3.connect(ctx.destination);
            osc3.start(now + 0.24);
            osc3.stop(now + 1.2);
        } catch (e) {
            console.warn("Could not play audio notification:", e);
        }
    };

    const toggleSound = () => {
        const next = !soundEnabled;
        setSoundEnabled(next);
        if (typeof window !== "undefined") {
            localStorage.setItem("admin_order_sound", String(next));
        }
        if (next) {
            playOrderChime(); // Play test chime to confirm & unlock browser audio permissions
        }
    };

    const handleManualRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ["activeOrders", "stats", "historyOrders"],
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsRefreshing(false),
        });
    };

    useEffect(() => {
        try {
            const channel = echo().channel("orders");

            channel.listen(".OrderPlaced", (e: any) => {
                if (soundEnabled) {
                    playOrderChime();
                }
                const tableStr =
                    e.table_number && Number(e.table_number) < 10
                        ? `0${Number(e.table_number)}`
                        : e.table_number || "01";
                setNewOrderAlert(
                    `Pesanan baru #${e.id} (Meja #${tableStr} • ${e.customer_name}) masuk ke antrean!`,
                );
                setTimeout(() => setNewOrderAlert(null), 6000);

                router.reload({
                    only: ["activeOrders", "stats", "historyOrders"],
                    preserveScroll: true,
                    preserveState: true,
                });
            });

            channel.listen(".OrderStatusUpdated", () => {
                router.reload({
                    only: ["activeOrders", "stats", "historyOrders"],
                    preserveScroll: true,
                    preserveState: true,
                });
            });

            return () => {
                echo().leaveChannel("orders");
            };
        } catch (err) {
            console.warn("Laravel Reverb WebSocket error:", err);
        }
    }, [soundEnabled]);

    const handleProcessOrder = (order: OrderItem) => {
        router.put(
            `/orders/${order.id}/process`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => router.reload(),
                onError: () => { },
            },
        );
    };

    const handleCompleteOrder = (order: OrderItem) => {
        router.put(
            `/orders/${order.id}/complete`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => router.reload(),
                onError: () => { },
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1: Pesanan Diproses */}
                    <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
                        <div className="w-10 h-10 rounded-lg bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                            <PesananDiproses className="w-5 h-5" />
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
                            <PesananSelesai className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-[#475569]">
                            Pesanan Selesai
                        </span>
                        <span className="text-2xl font-bold text-[#1e293b]">
                            {completedCount}
                        </span>
                    </div>
                </div>

                {/* Floating/Inline New Order Alert Banner */}
                {newOrderAlert && (
                    <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-red-600 to-[#D91A20] text-white shadow-lg animate-in slide-in-from-top duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/20">
                                <Bell className="w-5 h-5 animate-bounce" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">
                                    Pesanan Baru Masuk!
                                </h4>
                                <p className="text-xs text-white/90">
                                    {newOrderAlert}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setNewOrderAlert(null)}
                            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Tab Switcher & Live Controls */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("pesanan")}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "pesanan"
                                ? "bg-[#D91A20] text-white shadow-xs"
                                : "bg-white text-[#475569] border border-[#d1d5db] hover:bg-gray-50"
                                }`}
                        >
                            Pesanan
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("riwayat")}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "riwayat"
                                ? "bg-[#D91A20] text-white shadow-xs"
                                : "bg-white text-[#475569] border border-[#d1d5db] hover:bg-gray-50"
                                }`}
                        >
                            Riwayat Pesanan
                        </button>
                    </div>

                    {/* Live Realtime & Audio Controls */}
                    <div className="flex items-center gap-2">
                        {/* Sound Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleSound}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 ${soundEnabled
                                ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                                }`}
                            title={
                                soundEnabled
                                    ? "Notifikasi suara aktif. Klik untuk membisukan."
                                    : "Notifikasi suara mati. Klik untuk mengaktifkan."
                            }
                        >
                            {soundEnabled ? (
                                <>
                                    <Volume2 className="w-3.5 h-3.5 text-[#D91A20]" />
                                    <span>Suara: On</span>
                                </>
                            ) : (
                                <>
                                    <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                                    <span>Suara: Off</span>
                                </>
                            )}
                        </button>

                        {/* Manual Refresh Button */}
                        <button
                            type="button"
                            onClick={handleManualRefresh}
                            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 active:scale-95 transition-all cursor-pointer shadow-2xs"
                            title="Perbarui daftar pesanan sekarang"
                        >
                            <RotateCw
                                className={`w-3.5 h-3.5 ${isRefreshing
                                    ? "animate-spin text-[#D91A20]"
                                    : ""
                                    }`}
                            />
                        </button>
                    </div>
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
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${order.order_status ===
                                                        "processing"
                                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                        : "bg-amber-50 text-amber-700 border border-amber-200"
                                                        }`}
                                                >
                                                    {order.order_status ===
                                                        "processing"
                                                        ? "Sedang Diproses"
                                                        : "Baru Masuk"}
                                                </span>
                                            </div>
                                            <span className="text-xs text-[#94a3b8]">
                                                {order.formatted_time ||
                                                    "16 Sept 2026, 12.21 PM"}
                                            </span>
                                        </div>

                                        {/* Badges Meja & Lokasi */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md  bg-[#f1f5f9] text-[#374151] text-xs font-semibold">
                                                <LayoutGrid className="w-3.5 h-3.5 text-[#374151 " />
                                                <span>
                                                    Meja #
                                                    {order.table_number &&
                                                        order.table_number < 10
                                                        ? `0${order.table_number}`
                                                        : order.table_number ||
                                                        "01"}
                                                </span>
                                            </div>

                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f1f5f9] text-[#374151] text-xs font-semibold capitalize">
                                                <Home className="w-3.5 h-3.5 text-[#374151]" />
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

                                        {/* Action Buttons: Detail di kiri, Aksi Operasional Utama di kanan */}
                                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f1f5f9]">
                                            {/* Kiri: Tombol Detail Pesanan */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedOrder(order)
                                                }
                                                className="px-3.5 h-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-[#334155] text-xs font-semibold flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                                            >
                                                Detail
                                            </button>

                                            {/* Kanan: Aksi Operasional Utama dengan teks jelas & warna status */}
                                            {order.order_status ===
                                            "processing" ? (
                                                <button
                                                    type="button"
                                                    title="Selesaikan dan sajikan pesanan"
                                                    onClick={() =>
                                                        handleCompleteOrder(
                                                            order,
                                                        )
                                                    }
                                                    className="px-4 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span>Selesai</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    title="Terima dan mulai proses pesanan"
                                                    onClick={() =>
                                                        handleProcessOrder(
                                                            order,
                                                        )
                                                    }
                                                    className="px-4 h-9 rounded-lg bg-[#BE1A1A] hover:bg-[#a51515] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                                                >
                                                    <CookingPot className="w-4 h-4" />
                                                    <span>Terima Pesanan</span>
                                                </button>
                                            )}
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
                                            PESANAN
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

                                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm font-semibold text-[#475569]">
                                                        #{item.id}
                                                    </td>

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
                onCancelOrder={(order) => setOrderToCancel(order)}
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
