import { BarChart2 } from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

interface PerformanceItem {
    day_index: number;
    label: string;
    date: string;
    pesanan: number;
    pendapatan: number;
}

interface PerformanceChartProps {
    data: PerformanceItem[];
    period: "7" | "30";
    onPeriodChange: (period: "7" | "30") => void;
    formatIDR: (value: number | string) => string;
}

export default function PerformanceChart({
    data,
    period,
    onPeriodChange,
    formatIDR,
}: PerformanceChartProps) {
    return (
        <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between gap-2 mb-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-[#D91A20]" />
                        <h3 className="font-bold text-base text-[#1e293b]">
                            Performa Penjualan
                        </h3>
                    </div>
                    <p className="text-xs text-[#94a3b8] mt-1">
                        Perbandingan pendapatan dan jumlah pesanan dalam{" "}
                        {period === "7" ? "7 hari" : "30 hari"}{" "}
                        terakhir
                    </p>
                </div>

                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full text-xs">
                    <button
                        type="button"
                        onClick={() => onPeriodChange("7")}
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
                        onClick={() => onPeriodChange("30")}
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

            <div className="w-full h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="label"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="pendapatan"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            domain={[0, "auto"]}
                            tickFormatter={(val) => {
                                if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                                if (val >= 1000) return `${Math.round(val / 1000)}k`;
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
                                    return [formatIDR(value), "Pendapatan"];
                                }
                                return [`${value} pesanan`, "Jumlah Pesanan"];
                            }}
                            labelFormatter={(label) => `Hari ke-${label}`}
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
                            radius={[4, 4, 0, 0]}
                            barSize={14}
                            minPointSize={4}
                        />
                        <Bar
                            yAxisId="pesanan"
                            dataKey="pesanan"
                            name="jumlah pesanan"
                            fill="#1e293b"
                            radius={[4, 4, 0, 0]}
                            barSize={14}
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
    );
}