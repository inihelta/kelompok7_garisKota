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
    CreditCard,
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
    activeOrders?: PaginatedData<OrderItem>;
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
        height={(Number(size) * 28) / 28}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lucide ${className}`}
        {...props}
    >
        <path
            d="M21.0139 4.91667C19.9028 1.97222 17.1111 0 13.8889 0C10.6667 0 7.875 1.97222 6.76389 4.91667C4.9034 5.13302 3.18702 6.02465 1.94027 7.42244C0.693515 8.82023 0.00311101 10.627 0 12.5C0 15.375 1.63889 17.9861 4.16667 19.2778V22.2222C4.16667 22.9861 4.79167 23.6111 5.55556 23.6111H22.2222C22.9861 23.6111 23.6111 22.9861 23.6111 22.2222V19.2778C26.1389 17.9861 27.7778 15.375 27.7778 12.5C27.7778 8.58333 24.8194 5.34722 21.0139 4.91667ZM21.75 17.0694C21.1944 17.2639 20.8194 17.7917 20.8194 18.375V20.8472H6.94444V18.375C6.94444 17.7917 6.56944 17.2639 6.01389 17.0694C4.06944 16.375 2.77778 14.5417 2.77778 12.5139C2.77778 9.83333 4.95833 7.65278 7.52778 7.65278C7.58333 7.65278 7.72222 7.66667 7.77778 7.68056C8.45833 7.68056 9.02778 7.25 9.16667 6.59722C9.66667 4.36111 11.6111 2.80556 13.9028 2.80556C16.1944 2.80556 18.1389 4.36111 18.6389 6.59722C18.7778 7.25 19.3472 7.72222 20.0278 7.68056C20.1111 7.68056 20.1944 7.68056 20.1528 7.66667C22.8333 7.66667 25.0139 9.84722 25.0139 12.5278C25.0139 14.5694 23.7083 16.4028 21.7778 17.0833L21.75 17.0694ZM4.16667 25H23.6111V27.7778H4.16667V25Z"
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
        viewBox="0 0 34 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lucide ${className}`}
        {...props}
    >
        <path
            d="M13.0166 7.94451L14.3529 6.63796M14.3529 6.63796L14.9993 6.00601C18.5581 2.52656 24.3278 2.52656 27.8865 6.00601C31.4453 9.48549 31.4453 15.1269 27.8865 18.6063L18.4689 27.8142L18.4688 27.8143C16.5998 29.6416 15.665 30.5556 14.5036 30.5556C13.3422 30.5556 12.4076 29.6419 10.5383 27.8142L5.58166 22.9678C3.7124 21.1403 2.77777 20.2264 2.77777 19.0909C2.77777 18.3458 3.18016 17.6962 3.98494 16.8212C4.79599 15.9395 5.20648 15.4931 5.39541 15.0324L5.40233 15.0152C5.58806 14.5484 5.59312 14.0233 5.60323 12.9731V12.9731L5.64788 8.33232C5.60023 5.30189 7.55684 2.81525 10.0181 2.77825C12.0383 2.74787 13.7706 4.37726 14.3529 6.63796Z"
            stroke-width="3"
            stroke-linecap="round"
            stroke={color}
        />
        <path
            d="M18.4687 27.8143L5.39551 15.0322"
            stroke-width="3"
            stroke-linecap="round"
            stroke={color}
        />
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

    const activeList = activeOrders?.data ?? [];
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
                });
            });

            channel.listen(".OrderStatusUpdated", () => {
                router.reload({
                    only: ["activeOrders", "stats", "historyOrders"],
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
                onError: () => {},
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

    const handleConfirmPayment = (order: OrderItem) => {
        router.put(
            `/orders/${order.id}/confirm-payment`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => router.reload(),
                onError: () => {},
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

                    {/* Live Realtime & Audio Controls */}
                    <div className="flex items-center gap-2">
                        {/* Sound Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleSound}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                soundEnabled
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
                                className={`w-3.5 h-3.5 ${
                                    isRefreshing
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
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                        order.order_status === "processing"
                                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                            : order.order_status === "awaiting_payment"
                                                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                                    }`}
                                                >
                                                    {order.order_status === "processing"
                                                        ? "Sedang Diproses"
                                                        : order.order_status === "awaiting_payment"
                                                        ? "Menunggu Bayar"
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
                                            {order.order_status === "processing" ? (
                                                <button
                                                    type="button"
                                                    title="Selesaikan dan sajikan pesanan"
                                                    onClick={() =>
                                                        handleCompleteOrder(order)
                                                    }
                                                    className="px-4 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    <span>Selesai</span>
                                                </button>
                                            ) : order.order_status === "awaiting_payment" ? (
                                                <button
                                                    type="button"
                                                    title="Konfirmasi pembayaran diterima, pesanan masuk antrean dapur"
                                                    onClick={() =>
                                                        handleConfirmPayment(order)
                                                    }
                                                    className="px-4 h-9 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                                                >
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>Konfirmasi Bayar</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    title="Terima dan mulai proses pesanan"
                                                    onClick={() =>
                                                        handleProcessOrder(order)
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

                    {/* Pagination for Active Orders */}
                    {activeTab === "pesanan" && activeOrders && activeOrders.last_page > 1 && (
                        <Pagination
                            links={activeOrders.links}
                            currentPage={activeOrders.current_page}
                            totalPages={activeOrders.last_page}
                            from={activeOrders.from ?? 0}
                            to={activeOrders.to ?? 0}
                            total={activeOrders.total ?? 0}
                            itemName="pesanan"
                            onPageChange={(page) =>
                                router.get(
                                    "/dashboard/pesanan?page=" + page + "&tab=pesanan",
                                    {
                                        preserveScroll: true,
                                    },
                                )
                            }
                        />
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
                onConfirmPayment={handleConfirmPayment}
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
