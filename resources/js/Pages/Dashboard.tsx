import { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Wallet,
    ClipboardList,
    TrendingUp,
    BarChart2,
    Utensils,
    User,
    Clock,
    LucideProps,
    TrendingDown,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import {
    OrderItem,
    PaginatedData,
    PerformanceItem,
    TopSellingItem,
    DashboardPageProps,
    DashboardMetrics,
    PerformanceData,
} from "@/types/dashboard";
import Pagination from "@/Components/Pagination";
import OrderDetailModal from "@/Components/OrderDetailModal";
import { formatIDR, getImageSrc } from "@/lib/utils";
import { ImageWithFallback } from "@/Components/ui/ImageWithFallback";
const TopSelling = ({
    color = "currentColor",
    size = 31,
    className = "",
    ...props
}: LucideProps) => (
    <svg
        width={size}
        height={(Number(size) * 28) / 31}
        viewBox="0 0 34 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lucide ${className}`}
        {...props}
    >
        <path
            d="M15.4327 22.7746C11.4913 22.7746 7.89352 23.3297 5.15335 24.2431M24.2435 15.4323C25.1607 15.4319 26.0651 15.2168 26.8843 14.8041C27.7034 14.3914 28.4145 13.7927 28.9607 13.0557C29.5068 12.3188 29.8727 11.4642 30.0292 10.5605C30.1857 9.65668 30.1283 8.72881 29.8618 7.85118C29.5952 6.97354 29.1268 6.17054 28.494 5.50648C27.8613 4.84242 27.0819 4.33576 26.2182 4.02709C25.3544 3.71842 24.4304 3.61631 23.5201 3.72894C22.6098 3.84157 21.7386 4.16582 20.9761 4.6757C20.5722 3.52801 19.822 2.53398 18.829 1.83081C17.8361 1.12764 16.6494 0.75 15.4327 0.75C14.216 0.75 13.0292 1.12764 12.0363 1.83081C11.0433 2.53398 10.2931 3.52801 9.88918 4.6757C9.12673 4.16582 8.25547 3.84157 7.34519 3.72894C6.4349 3.61631 5.51089 3.71842 4.64716 4.02709C3.78343 4.33576 3.00399 4.84242 2.37128 5.50648C1.73856 6.17054 1.27015 6.97354 1.00356 7.85118C0.73698 8.72881 0.679631 9.65668 0.836109 10.5605C0.992588 11.4642 1.35855 12.3188 1.90467 13.0557C2.4508 13.7927 3.16191 14.3914 3.98105 14.8041C4.80019 15.2168 5.7046 15.4319 6.62183 15.4323V23.5089M28.6489 23.5089H19.8381M28.6489 23.5089C28.6489 24.5368 25.7208 26.459 24.9777 27.18M28.6489 23.5089C28.6489 22.4809 25.7208 20.5587 24.9777 19.8377"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke={color}
        />
    </svg>
);
const PelangganIcon = ({
    color = "currentColor",
    size = 45,
    className = "",
    ...props
}: LucideProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 45 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lucide ${className}`}
        {...props}
    >
        <path
            d="M22.5 0C10.1025 0 0 10.1025 0 22.5C0 34.8975 10.1025 45 22.5 45C34.8975 45 45 34.8975 45 22.5C45 10.1025 34.8975 0 22.5 0ZM22.5 11.25C26.3925 11.25 29.25 14.1075 29.25 18C29.25 21.8925 26.3925 24.75 22.5 24.75C18.6075 24.75 15.75 21.8925 15.75 18C15.75 14.1075 18.6075 11.25 22.5 11.25ZM22.5 40.5C17.9144 40.4995 13.5029 38.7445 10.17 35.595C11.9925 31.86 15.8175 29.25 20.25 29.25H24.75C29.1825 29.25 32.985 31.86 34.8075 35.595C31.4853 38.747 27.0795 40.5029 22.5 40.5Z"
            fill={color}
        />
    </svg>
);

export default function Dashboard({
    auth,
    metrics,
    performance,
    topSelling,
    recentOrders,
}: DashboardPageProps) {
    const [period, setPeriod] = useState<"7" | "30">("7");
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

    const activePerformanceData =
        period === "7" ? performance?.days7 || [] : performance?.days30 || [];

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Dashboard">
            <Head title="Dashboard" />

            <div className="flex flex-col gap-5 max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
                        <div className="w-10 h-10 rounded-lg bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-[#475569]">
                            Pendapatan Hari Ini
                        </span>
                        <span className="text-2xl font-bold text-[#1e293b]">
                            {formatIDR(metrics?.today_revenue || 0)}
                        </span>
                        <div
                            className={`flex items-center gap-1 text-xs font-semibold  ${metrics?.revenue_growth >= 0 ? "text-[#16a34a]" : "text-[#D91A20]"}`}
                        >
                            {metrics?.revenue_growth >= 0 ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            <span>
                                {metrics?.revenue_growth >= 0 ? "+" : ""}
                                {metrics?.revenue_growth || 0}% dari kemarin
                            </span>
                        </div>
                    </div>

                    <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
                        <div className="w-10 h-10 rounded-lg bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                            <ClipboardList className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-[#475569]">
                            Pesanan Hari Ini
                        </span>
                        <span className="text-2xl font-bold text-[#1e293b]">
                            {metrics?.today_orders || 0}
                        </span>
                        <div
                            className={`flex items-center gap-1 text-xs font-semibold  ${metrics?.revenue_growth >= 0 ? "text-[#16a34a]" : "text-[#D91A20]"}`}
                        >
                            {metrics?.revenue_growth >= 0 ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            <span>
                                {metrics?.orders_growth >= 0 ? "+" : ""}
                                {metrics?.orders_growth || 0}% dari kemarin
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    <div className="lg:col-span-7 border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col justify-between shadow-xs">
                        <div className="flex items-start justify-between gap-2 mb-4 flex-wrap">
                            <div>
                                <div className="flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-[#D91A20]" />
                                    <h3 className="font-bold text-base text-[#1e293b]">
                                        Performa Penjualan
                                    </h3>
                                </div>
                                <p className="text-xs text-[#94a3b8] mt-1">
                                    Perbandingan pendapatan dan jumlah pesanan
                                    dalam{" "}
                                    {period === "7" ? "7 hari" : "30 hari"}{" "}
                                    terakhir
                                </p>
                            </div>

                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full text-xs">
                                <button
                                    type="button"
                                    onClick={() => setPeriod("7")}
                                    className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                                        period === "7"
                                            ? "bg-[#D91A20] text-white shadow-xs"
                                            : "text-gray-500 hover:text-gray-800"
                                    }`}
                                >
                                    7 hari
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPeriod("30")}
                                    className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                                        period === "30"
                                            ? "bg-[#D91A20] text-white shadow-xs"
                                            : "text-gray-500 hover:text-gray-800"
                                    }`}
                                >
                                    30 hari
                                </button>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="w-full h-64 mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={activePerformanceData}
                                    barGap={8}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -15,
                                        bottom: 0,
                                    }}
                                >
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                    />
                                    {/* Sumbu Y Kiri untuk Pendapatan */}
                                    <YAxis
                                        yAxisId="pendapatan"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        domain={[0, "auto"]}
                                        tickFormatter={(val) => {
                                            if (val >= 1000000)
                                                return `${(val / 1000000).toFixed(1)}M`;
                                            if (val >= 1000)
                                                return `${Math.round(val / 1000)}k`;
                                            return val;
                                        }}
                                    />

                                    <YAxis
                                        yAxisId="pesanan"
                                        orientation="right"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        allowDecimals={false}
                                        domain={[0, "auto"]}
                                    />
                                    <Tooltip
                                        formatter={(value: any, name: any) => {
                                            if (name === "jumlah pendapatan") {
                                                return [
                                                    formatIDR(value),
                                                    "Pendapatan",
                                                ];
                                            }
                                            return [
                                                `${value} pesanan`,
                                                "Jumlah Pesanan",
                                            ];
                                        }}
                                        labelFormatter={(label) => {
                                            const date = new Date(label);
                                            return date.toLocaleDateString(
                                                "id-ID",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                },
                                            );
                                        }}
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "8px",
                                            border: "1px solid #e2e8f0",
                                            fontSize: "12px",
                                        }}
                                    />

                                    <Bar
                                        yAxisId="pendapatan"
                                        dataKey="pendapatan"
                                        name="jumlah pendapatan"
                                        fill="#D91A20"
                                        radius={[2, 2, 0, 0]}
                                        barSize={24}
                                        minPointSize={4}
                                    />
                                    <Bar
                                        yAxisId="pesanan"
                                        dataKey="pesanan"
                                        name="jumlah pesanan"
                                        fill="#1e293b"
                                        radius={[2, 2, 0, 0]}
                                        barSize={24}
                                        minPointSize={4}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-[#f1f5f9] text-xs text-[#475569]">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b]" />
                                <span>jumlah pesanan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#D91A20]" />
                                <span>jumlah pendapatan</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col justify-between shadow-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <TopSelling className="w-7 h-7 text-[#D91A20]" />
                            <h3 className="font-bold text-base text-[#1e293b]">
                                Top - Selling
                            </h3>
                        </div>

                        {topSelling && topSelling.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3 my-auto">
                                {topSelling.map((menu) => (
                                    <div
                                        key={menu.id}
                                        className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden mb-1.5 p-1">
                                            {menu.image ? (
                                                <ImageWithFallback
                                                    src={
                                                        getImageSrc(
                                                            menu.image,
                                                        ) || ""
                                                    }
                                                    alt={menu.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <Utensils className="w-6 h-6 text-gray-300" />
                                            )}
                                        </div>
                                        <span
                                            className="text-xs font-semibold text-[#1e293b] leading-tight line-clamp-2 max-w-full"
                                            title={menu.name}
                                        >
                                            {menu.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-400 text-xs">
                                Belum ada menu terjual.
                            </div>
                        )}
                    </div>
                </div>

                <div className="border border-[#e5e7eb] rounded-xl p-4 bg-white flex flex-col gap-3 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr>
                                    <th
                                        scope="col"
                                        className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        PELANGGAN
                                    </th>
                                    <th
                                        scope="col"
                                        className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        PESANAN
                                    </th>
                                    <th
                                        scope="col"
                                        className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        WAKTU
                                    </th>
                                    <th
                                        scope="col"
                                        className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] text-center w-[120px]"
                                    >
                                        STATUS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders &&
                                recentOrders.data &&
                                recentOrders.data.length > 0 ? (
                                    recentOrders.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50/60 transition-colors"
                                        >
                                            {/* PELANGGAN */}
                                            <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm text-[#334155]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full  flex items-center justify-center flex-shrink-0">
                                                        <PelangganIcon className="text-[#D91A20]" />
                                                    </div>
                                                    <span className="font-semibold text-[#1e293b]">
                                                        {item.customer_name ||
                                                            `Pelanggan #${item.id}`}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* ID */}
                                            <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm font-semibold text-[#475569]">
                                                #{item.id}
                                            </td>

                                            {/* PESANAN (Tombol Detail Pesanan) */}
                                            <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedOrder(item)
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

                                            {/* STATUS */}
                                            <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-center">
                                                {item.order_status ===
                                                "cancelled" ? (
                                                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#ef4444] inline-block">
                                                        Dibatalkan
                                                    </span>
                                                ) : item.order_status ===
                                                  "completed" ? (
                                                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#16a34a] inline-block">
                                                        Selesai
                                                    </span>
                                                ) : (
                                                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#d97706] inline-block">
                                                        Diproses
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center py-8 text-gray-400 text-sm"
                                        >
                                            Belum ada transaksi riwayat pesanan
                                            di database.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {recentOrders && (
                        <Pagination
                            links={recentOrders.links}
                            from={recentOrders.from}
                            to={recentOrders.to}
                            total={recentOrders.total}
                            itemName="riwayat"
                        />
                    )}
                </div>
            </div>

            {/* Modal Detail Pesanan */}
            <OrderDetailModal
                isOpen={Boolean(selectedOrder)}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />
        </AuthenticatedLayout>
    );
}
