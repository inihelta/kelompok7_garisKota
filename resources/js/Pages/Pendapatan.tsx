import { useState, useRef, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Wallet,
    ClipboardList,
    TrendingUp,
    FileText,
    Calendar,
    ChevronDown,
    BarChart2,
    PieChart as PieChartIcon,
    User,
    Clock,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    OrderItem,
    PaginatedData,
    PerformanceItem,
    PaymentSourceItem,
    PendapatanPageProps,
    PendapatanMetrics,
    PerformanceData,
    PaymentSourcesData,
} from "@/types/dashboard";
import Pagination from "@/Components/Pagination";
import OrderDetailModal from "@/Components/OrderDetailModal";

export default function Pendapatan({
    auth,
    metrics,
    performance,
    paymentSources,
    recentOrders,
}: PendapatanPageProps) {
    const [period, setPeriod] = useState<"7" | "30">("7");
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

    // Filter tanggal dropdown di frontend
    const [dateRangeLabel, setDateRangeLabel] = useState<string>(
        "16 Sept 2026 - 16 Sept 2026",
    );
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDateDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatIDR = (value: number | string) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(Number(value) || 0);

    const activePerformanceData =
        period === "7" ? performance?.days7 || [] : performance?.days30 || [];

    // Color mapping for payment methods (frontend concern)
    const paymentColorMap: Record<string, string> = {
        cash: "#991b1b",
        qris: "#D91A20",
        bank_transfer: "#334155",
        e_wallet: "#94a3b8",
    };

    // Donut chart data fallback jika database belum terisi payment
    const defaultPaymentSources: PaymentSourceItem[] = [
        { key: "cash", name: "Cash", value: 5964000, percentage: 56 },
        { key: "qris", name: "Qris", value: 2553000, percentage: 24 },
        {
            key: "bank_transfer",
            name: "Transfer Bank",
            value: 1278000,
            percentage: 12,
        },
        { key: "e_wallet", name: "Debit", value: 855000, percentage: 8 },
    ];

    const donutData =
        paymentSources?.items && paymentSources.items.some((i) => i.value > 0)
            ? paymentSources.items.map((item) => ({
                  ...item,
                  color: paymentColorMap[item.key] || "#94a3b8",
              }))
            : defaultPaymentSources.map((item) => ({
                  ...item,
                  color: paymentColorMap[item.key] || "#94a3b8",
              }));

    const totalRevenueSource =
        paymentSources?.total > 0 ? paymentSources.total : 10650000;

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Pendapatan">
            <Head title="Pendapatan" />

            <div className="flex flex-col gap-5 max-w-full">
                {/* Header Title & Date Range Filter Dropdown */}
                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-bold text-[#1e293b]">
                        Pendapatan
                    </h1>

                    <div
                        className="relative inline-block w-fit"
                        ref={dropdownRef}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setIsDateDropdownOpen(!isDateDropdownOpen)
                            }
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#D91A20] text-white text-xs font-semibold shadow-xs hover:bg-[#b91c1c] transition-all cursor-pointer"
                        >
                            <Calendar className="w-4 h-4 text-white" />
                            <span>{dateRangeLabel}</span>
                            <ChevronDown className="w-4 h-4 ml-1 text-white/90" />
                        </button>

                        {isDateDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-64 bg-white border border-[#e2e8f0] rounded-xl shadow-lg z-30 py-1.5 text-xs">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDateRangeLabel("Hari Ini");
                                        setIsDateDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                                >
                                    Hari Ini
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDateRangeLabel("7 Hari Terakhir");
                                        setIsDateDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                                >
                                    7 Hari Terakhir
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDateRangeLabel("30 Hari Terakhir");
                                        setIsDateDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                                >
                                    30 Hari Terakhir
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDateRangeLabel("Bulan Ini");
                                        setIsDateDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium"
                                >
                                    Bulan Ini
                                </button>
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDateRangeLabel(
                                            "16 Sept 2026 - 16 Sept 2026",
                                        );
                                        setIsDateDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-semibold text-[#D91A20]"
                                >
                                    16 Sept 2026 - 16 Sept 2026 (Default)
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Pendapatan Hari Ini */}
                    <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
                        <div className="w-10 h-10 rounded-lg bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-[#475569]">
                            Pendapatan Hari Ini
                        </span>
                        <span className="text-xl font-bold text-[#1e293b]">
                            {formatIDR(metrics?.today_revenue || 10650000)}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>
                                {metrics?.revenue_growth >= 0 ? "+" : ""}
                                {metrics?.revenue_growth || 15}% dari kemarin
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Pesanan Hari Ini */}
                    <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
                        <div className="w-10 h-10 rounded-lg bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                            <ClipboardList className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-[#475569]">
                            Pesanan Hari Ini
                        </span>
                        <span className="text-xl font-bold text-[#1e293b]">
                            {metrics?.today_orders || 150}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>
                                {metrics?.orders_growth >= 0 ? "+" : ""}
                                {metrics?.orders_growth || 8}% dari kemarin
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Rata-rata Transaksi */}
                    <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
                        <div className="w-10 h-10 rounded-lg bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-[#475569]">
                            Rata-rata Transaksi
                        </span>
                        <span className="text-xl font-bold text-[#1e293b]">
                            {formatIDR(metrics?.average_transaction || 65000)}
                        </span>
                    </div>

                    {/* Card 4: Total Biaya */}
                    <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
                        <div className="w-10 h-10 rounded-lg bg-[#fee2e2] flex items-center justify-center text-[#D91A20]">
                            <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-[#475569]">
                            Total Biaya
                        </span>
                        <span className="text-xl font-bold text-[#1e293b]">
                            {formatIDR(metrics?.total_cost || 5650000)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    {/* Left Card: Performa Penjualan (7 Cols on desktop) */}
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

                            {/* Toggle 7 hari / 30 hari */}
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

                        {/* Chart Area dengan Dual Y-Axis */}
                        <div className="w-full h-64 mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={activePerformanceData}
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
                                    {/* Sumbu Y Kanan untuk Pesanan */}
                                    <YAxis
                                        yAxisId="pesanan"
                                        orientation="right"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        allowDecimals={false}
                                        domain={[0, "auto"]}
                                    />
                                    <RechartsTooltip
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
                                    {/* Red Bars: Pendapatan */}
                                    <Bar
                                        yAxisId="pendapatan"
                                        dataKey="pendapatan"
                                        name="jumlah pendapatan"
                                        fill="#D91A20"
                                        radius={[2, 2, 0, 0]}
                                        barSize={24}
                                        minPointSize={4}
                                    />
                                    {/* Black Bars: Jumlah Pesanan */}
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

                    {/* Right Card: Sumber Pendapatan (Donut Chart & Breakdown) */}
                    <div className="lg:col-span-5 border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col justify-between shadow-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <PieChartIcon className="w-5 h-5 text-[#D91A20]" />
                            <h3 className="font-bold text-base text-[#1e293b]">
                                Sumber Pendapatan
                            </h3>
                        </div>

                        {/* Donut Chart & Breakdown Rows */}
                        <div className="flex items-center justify-between gap-4 my-auto">
                            {/* Donut Chart */}
                            <div className="w-[140px] h-[140px] flex-shrink-0 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            dataKey="percentage"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={45}
                                            outerRadius={65}
                                            paddingAngle={2}
                                        >
                                            {donutData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(
                                                value: any,
                                                name: any,
                                            ) => [`${value}%`, name]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Breakdown List */}
                            <div className="flex flex-col gap-2.5 flex-1 pr-1">
                                {donutData.map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex items-center justify-between text-xs"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="font-medium text-[#1e293b]">
                                                {item.name}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span
                                                className="font-bold text-[11px]"
                                                style={{ color: item.color }}
                                            >
                                                {item.percentage}%
                                            </span>
                                            <span className="text-[11px] text-[#64748b]">
                                                {formatIDR(item.value)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total Pendapatan Footer di Bawah Donut */}
                        <div className="pt-3 border-t border-[#f1f5f9] mt-3">
                            <span className="text-base font-extrabold text-[#1e293b] block">
                                {formatIDR(totalRevenueSource)}
                            </span>
                            <span className="text-xs text-[#94a3b8] block -mt-0.5">
                                Total pendapatan
                            </span>
                        </div>
                    </div>
                </div>

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
