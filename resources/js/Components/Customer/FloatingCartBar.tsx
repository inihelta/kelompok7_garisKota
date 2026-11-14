import React from "react";
import { ShoppingBag } from "lucide-react";
import { formatIDR } from "@/lib/utils";

interface FloatingCartBarProps {
    totalItems: number;
    totalPrice: number;
    tableNumber: number;
    onClick: () => void;
}

export default function FloatingCartBar({
    totalItems,
    totalPrice,
    tableNumber,
    onClick,
}: FloatingCartBarProps) {
    if (totalItems <= 0) return null;

    return (
        <div className="fixed bottom-3 left-0 right-0 z-40 px-4 max-w-md mx-auto">
            <button
                type="button"
                onClick={onClick}
                className="w-full flex items-center justify-between rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-xl shadow-emerald-700/25 transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
                {/* Left Info */}
                <div className="flex flex-col items-start text-left">
                    <span className="text-xs font-bold leading-tight">
                        {totalItems} item
                    </span>
                    <span className="text-[11px] text-emerald-100 font-medium line-clamp-1">
                        Garis Kota • Meja #{tableNumber}
                    </span>
                </div>

                {/* Right Total & Bag Icon */}
                <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold tracking-tight">
                        {formatIDR(totalPrice)}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-xs">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                </div>
            </button>
        </div>
    );
}

