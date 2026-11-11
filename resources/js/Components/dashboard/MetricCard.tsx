import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
    label: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive?: boolean;
        label?: string;
    };
}

export default function MetricCard({
    icon: Icon,
    iconBgColor,
    iconColor,
    label,
    value,
    trend,
}: MetricCardProps) {
    return (
        <div className="border border-[#e5e7eb] rounded-xl p-5 bg-white flex flex-col gap-2 shadow-xs">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <span className="text-xs font-medium text-[#475569]">{label}</span>
            <span className="text-xl font-bold text-[#1e293b]">{value}</span>
            {trend && (
                <div className="flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>
                        {trend.isPositive !== false && trend.value >= 0 ? "+" : ""}
                        {trend.value}{trend.label || "% dari kemarin"}
                    </span>
                </div>
            )}
        </div>
    );
}

import { TrendingUp } from "lucide-react";