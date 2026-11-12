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
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                            <TrendingUp className="w-3.5 h-3.5" />
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
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                            <TrendingUp className="w-3.5 h-3.5" />
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
                                        dataKey="label"
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
                                        labelFormatter={(label) =>
                                            `Hari ke-${label}`
                                        }
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

                        {/* Chart Legend */}
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

                    {/* Right Card: Top - Selling (5 Cols on desktop) */}
                    <div className="lg:col-span-5 border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col justify-between shadow-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <Utensils className="w-5 h-5 text-[#D91A20]" />
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
                                                    src={getImageSrc(menu.image) || ""}
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
                                    <th scope="col" className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                        PELANGGAN
                                    </th>
                                    <th scope="col" className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                        ID
                                    </th>
                                    <th scope="col" className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                        PESANAN
                                    </th>
                                    <th scope="col" className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                        WAKTU
                                    </th>
                                    <th scope="col" className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] text-center w-[120px]">
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
                                                    <div className="w-9 h-9 rounded-full bg-[#D91A20] text-white flex items-center justify-center flex-shrink-0">
                                                        <User className="w-5 h-5 text-white" />
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

                                            {/* WAKTU */}
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

                    {/* Pagination Footer */}
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
