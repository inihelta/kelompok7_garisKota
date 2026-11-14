import React from "react";
import { CustomerMenu } from "@/types/customer";
import { formatIDR, getImageSrc } from "@/lib/utils";
import { ImageWithFallback } from "@/Components/ui/ImageWithFallback";
import { Plus, Minus, MessageSquarePlus } from "lucide-react";

interface MenuItemCardProps {
    menu: CustomerMenu;
    quantity: number;
    notes?: string;
    onAdd: () => void;
    onRemove: () => void;
    onOpenNotes?: () => void;
}

export default function MenuItemCard({
    menu,
    quantity,
    notes,
    onAdd,
    onRemove,
    onOpenNotes,
}: MenuItemCardProps) {
    const isOutOfStock = menu.stock <= 0;

    return (
        <div className="relative flex items-center justify-between gap-4 p-4 bg-white border-b border-gray-100 transition-colors hover:bg-gray-50/50">
            {/* Left Content */}
            <div className="flex-1 min-w-0 pr-1">
                <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1">
                    {menu.name}
                </h3>
                {menu.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {menu.description}
                    </p>
                )}
                <div className="mt-2.5 flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm tracking-tight">
                        {formatIDR(menu.price)}
                    </span>
                    {menu.stock <= 5 && !isOutOfStock && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                            Sisa {menu.stock}
                        </span>
                    )}
                </div>

                {/* Per-item note indicator if exists */}
                {quantity > 0 && notes && (
                    <p className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md italic line-clamp-1">
                        <span>Catatan:</span> {notes}
                    </p>
                )}
            </div>

            {/* Right Content: Thumbnail & Action Button */}
            <div className="flex flex-col items-end shrink-0 w-28">
                {/* Product Image */}
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-xs">
                    <ImageWithFallback
                        src={getImageSrc(menu.image)}
                        alt={menu.name}
                        className="h-full w-full object-cover object-center"
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                Habis
                            </span>
                        </div>
                    )}
                </div>

                {/* Add / Stepper Button */}
                <div className="mt-2.5 flex items-center justify-end w-full">
                    {isOutOfStock ? (
                        <span className="text-xs font-semibold text-gray-400 py-1">
                            Habis
                        </span>
                    ) : quantity === 0 ? (
                        <button
                            type="button"
                            onClick={onAdd}
                            className="w-full max-w-[80px] rounded-full border border-emerald-600 bg-white py-1 px-3 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-50 active:scale-95 shadow-2xs"
                        >
                            Tambah
                        </button>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            {onOpenNotes && (
                                <button
                                    type="button"
                                    onClick={onOpenNotes}
                                    title="Tambah Catatan"
                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-300 active:scale-95 transition-all"
                                >
                                    <MessageSquarePlus className="h-3.5 w-3.5" />
                                </button>
                            )}
                            <div className="flex items-center rounded-full border border-emerald-600 bg-white p-0.5 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={onRemove}
                                    className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-50 active:scale-90 transition-all"
                                >
                                    <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-emerald-800">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={onAdd}
                                    disabled={quantity >= menu.stock}
                                    className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-50 active:scale-90 disabled:opacity-40 transition-all"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

