import React, { useState } from "react";
import { Utensils, X, ChevronRight } from "lucide-react";
import { CustomerCategory, CustomerMenu } from "@/types/customer";

interface CategoryJumpModalProps {
    categories: CustomerCategory[];
    menus: CustomerMenu[];
    onSelectCategory: (categoryName: string) => void;
}

export default function CategoryJumpModal({
    categories,
    menus,
    onSelectCategory,
}: CategoryJumpModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Count items per category
    const categoryCounts: Record<string, number> = {};
    menus.forEach((m) => {
        const cat = m.category_name || "Lainnya";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const handleSelect = (categoryName: string) => {
        onSelectCategory(categoryName);
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Menu Button (Floating Red Pill like reference) */}
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 active:scale-95 transition-all hover:bg-rose-700"
                >
                    <Utensils className="h-4 w-4" />
                    <span>Menu</span>
                </button>
            </div>

            {/* Modal / Bottom Sheet */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity">
                    <div
                        className="fixed inset-0"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Daftar Kategori
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Pilih kategori untuk loncat ke menu
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Category List */}
                        <div className="mt-3 max-h-72 space-y-1 overflow-y-auto">
                            <button
                                type="button"
                                onClick={() => handleSelect("Semua Menu")}
                                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                            >
                                <span>Semua Menu</span>
                                <span className="text-xs font-normal text-gray-400">
                                    {menus.length} item
                                </span>
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleSelect(cat.name)}
                                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                >
                                    <span>{cat.name}</span>
                                    <div className="flex items-center gap-1.5 text-xs font-normal text-gray-400">
                                        <span>{categoryCounts[cat.name] || 0} item</span>
                                        <ChevronRight className="h-4 w-4 text-gray-300" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

