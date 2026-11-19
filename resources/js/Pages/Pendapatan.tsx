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
    LucideProps,
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

const Rata2Transaksi = ({
    color = "currentColor",
    size = 34,
    className = "",
    ...props
}: LucideProps) => (
    <svg
        width={size}
        height={(Number(size) * 33) / 34}
        viewBox="0 0 34 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lucide ${className}`}
        {...props}
    >
        <path
            d="M31.66 8.775C31.3417 8.88921 30.9975 8.91068 30.6675 8.83691C30.3375 8.76315 30.0352 8.59719 29.7958 8.35833L28.4815 7.04167L18.4886 17.0345C18.3228 17.2005 18.1259 17.3321 17.9091 17.4219C17.6924 17.5117 17.4601 17.558 17.2255 17.558C16.9909 17.558 16.7586 17.5117 16.5419 17.4219C16.3252 17.3321 16.1283 17.2005 15.9624 17.0345L12.1505 13.2226L3.06956 22.3036C2.90476 22.474 2.70765 22.61 2.48974 22.7035C2.27183 22.797 2.03749 22.8461 1.80038 22.8481C1.56328 22.85 1.32816 22.8047 1.10874 22.7148C0.889329 22.6249 0.690014 22.4922 0.522428 22.3245C0.354843 22.1568 0.222342 21.9573 0.132658 21.7378C0.0429746 21.5183 -0.00209652 21.2832 7.48853e-05 21.0461C0.00224629 20.8089 0.0516168 20.5746 0.145306 20.3568C0.238994 20.139 0.375125 19.942 0.545755 19.7774L10.8839 9.43214C11.0497 9.2662 11.2466 9.13457 11.4633 9.04475C11.68 8.95494 11.9123 8.90872 12.1469 8.90872C12.3815 8.90872 12.6138 8.95494 12.8306 9.04475C13.0473 9.13457 13.2442 9.2662 13.41 9.43214L17.2243 13.2464L25.9553 4.51548L24.641 3.20119C24.4017 2.96215 24.2351 2.66006 24.1608 2.33006C24.0865 2.00007 24.1074 1.65576 24.2212 1.3372C24.3349 1.01864 24.5368 0.738942 24.8034 0.530663C25.0699 0.322383 25.3901 0.194089 25.7267 0.160714C27.9005 -0.0535714 29.1505 -0.0535714 31.2434 0.160714C31.6518 0.202946 32.0332 0.384646 32.3233 0.675212C32.6135 0.965777 32.7946 1.34745 32.8362 1.75595C33.0529 3.84643 33.0505 5.09881 32.8362 7.27024C32.8027 7.60668 32.6744 7.9267 32.4662 8.19308C32.258 8.45946 31.9784 8.66126 31.66 8.775ZM27.7958 12.3655C28.0655 12.1039 28.411 11.934 28.7829 11.8802C29.1548 11.8263 29.5343 11.8912 29.8672 12.0655L32.1815 13.2798C32.4809 13.4374 32.7294 13.6768 32.898 13.9702C33.0667 14.2636 33.1484 14.5988 33.1339 14.9369L32.4767 30.6226C32.4577 31.0833 32.2611 31.5188 31.9283 31.8379C31.5954 32.157 31.1521 32.3349 30.691 32.3345H25.9958C25.8379 32.3345 25.6865 32.2718 25.5749 32.1602C25.4632 32.0486 25.4005 31.8972 25.4005 31.7393V14.9393C25.4004 14.8594 25.4163 14.7802 25.4474 14.7066C25.4785 14.633 25.5241 14.5663 25.5815 14.5107L27.7958 12.3655ZM22.4243 31.7393C22.4243 31.8972 22.3616 32.0486 22.25 32.1602C22.1384 32.2718 21.987 32.3345 21.8291 32.3345H12.9005C12.7427 32.3345 12.5912 32.2718 12.4796 32.1602C12.368 32.0486 12.3053 31.8972 12.3053 31.7393V17.8964C12.3053 17.8488 12.341 17.8107 12.3886 17.8155C12.7767 17.8345 13.1577 17.9821 13.4719 18.256L17.3886 21.6941C17.5009 21.7929 17.6463 21.8458 17.7959 21.8423C17.9455 21.8388 18.0882 21.779 18.1958 21.675L21.4148 18.5512C21.4988 18.4697 21.605 18.4149 21.7201 18.3934C21.8351 18.372 21.954 18.385 22.0617 18.4307C22.1694 18.4764 22.2613 18.5529 22.3258 18.6506C22.3903 18.7482 22.4246 18.8627 22.4243 18.9798V31.7393ZM8.30766 21.1131L0.902898 28.675C0.575178 29.0086 0.391379 29.4574 0.390993 29.925V30.5488C0.390993 31.5345 1.19099 32.3345 2.17671 32.3345H8.73385C8.89172 32.3345 9.04312 32.2718 9.15475 32.1602C9.26638 32.0486 9.32909 31.8972 9.32909 31.7393V21.5298C9.32931 21.4113 9.29419 21.2955 9.2282 21.1971C9.16221 21.0987 9.06837 21.0222 8.95868 20.9775C8.84899 20.9327 8.72844 20.9217 8.61247 20.9459C8.49649 20.9701 8.39036 21.0283 8.30766 21.1131Z"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill={color}
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
                            <Rata2Transaksi className="w-5 h-5" />
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
