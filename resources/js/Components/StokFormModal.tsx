import React, { useEffect, useState } from "react";
import { StockItem, StockCategoryItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { AlertCircle, Package } from "lucide-react";

interface StokFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    stockItem: StockItem | null;
    categories: StockCategoryItem[];
    onSave: (data: {
        id?: number;
        stock_category_id: number;
        name: string;
        sku: string;
        category: string;
        stock: number;
        unit: string;
        min_stock: number;
        est_daily: number;
    }) => void;
}

const standardUnits = ["kg", "Liter", "Botol", "Pcs", "Gram", "Box", "Pack"];

export default function StokFormModal({
    isOpen,
    onClose,
    stockItem,
    categories,
    onSave,
}: StokFormModalProps) {
    const isEdit = Boolean(stockItem);

    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [categoryId, setCategoryId] = useState<number>(
        categories[0]?.id || 1,
    );
    const [stock, setStock] = useState<number>(0);
    const [unit, setUnit] = useState("kg");
    const [minStock, setMinStock] = useState<number>(0);
    const [estDaily, setEstDaily] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (stockItem) {
                setName(stockItem.name || "");
                setSku(stockItem.sku || "");

                const matchedCategory = categories.find(
                    (c) =>
                        c.id === stockItem.stock_category_id ||
                        c.name === stockItem.category ||
                        (c.name === "Biji Kopi & Bubuk" &&
                            stockItem.category.includes("Biji Kopi")),
                );
                setCategoryId(matchedCategory?.id || categories[0]?.id || 1);

                setStock(Number(stockItem.stock) || 0);
                setUnit(stockItem.unit || "kg");
                setMinStock(Number(stockItem.min_stock) || 0);
                setEstDaily(Number(stockItem.est_daily) || 0);
            } else {
                setName("");
                setCategoryId(categories[0]?.id || 1);
                setStock(0);
                setUnit("kg");
                setMinStock(5);
                setEstDaily(1);

                const randNum = Math.floor(10 + Math.random() * 90);
                setSku(`SKU-ITM-${randNum}`);
            }
        }
    }, [isOpen, stockItem, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmedName = name.trim();
        const trimmedSku = sku.trim();

        if (!trimmedName) {
            setError("Nama bahan baku wajib diisi.");
            return;
        }

        if (!trimmedSku) {
            setError("Kode SKU wajib diisi.");
            return;
        }

        if (stock < 0) {
            setError("Jumlah stok tidak boleh bernilai negatif.");
            return;
        }

        if (minStock < 0) {
            setError("Batas minimum stok tidak boleh bernilai negatif.");
            return;
        }

        const selectedCategory = categories.find((c) => c.id === categoryId);
        const categoryName = selectedCategory ? selectedCategory.name : "Umum";

        onSave({
            ...(stockItem ? { id: stockItem.id } : {}),
            stock_category_id: categoryId,
            name: trimmedName,
            sku: trimmedSku,
            category: categoryName,
            stock: Number(stock),
            unit: unit.trim() || "Pcs",
            min_stock: Number(minStock),
            est_daily: Number(estDaily),
        });

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg bg-white p-6 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="flex-shrink-0 pb-3 border-b border-[#f1f5f9]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#ef4444]">
                            <Package className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-[#1e293b]">
                                {isEdit
                                    ? "Edit Stok Bahan"
                                    : "Tambah Bahan Baku Baru"}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-[#64748b]">
                                {isEdit
                                    ? "Perbarui rincian, jumlah stok, dan batas minimum bahan."
                                    : "Isi data formulir berikut untuk mendaftarkan bahan baku baru ke stok."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {error && (
                    <div className="flex items-center gap-2 p-2.5 mt-3 bg-red-50 border border-red-200 text-[#ef4444] rounded-lg text-xs">
                        <AlertCircle className="size-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-y-auto mt-3 pr-1 space-y-3.5 text-sm"
                >
                    <div>
                        <label className="block text-xs font-semibold text-[#334155] mb-1">
                            Nama Bahan Baku{" "}
                            <span className="text-[#ef4444]">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: House Blend Beans, Fresh Milk 1L..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-[#1e293b] text-sm placeholder:text-[#94a3b8] transition-all"
                            autoFocus={!isEdit}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#334155] mb-1">
                                Kode SKU{" "}
                                <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: SKU-COF-01"
                                value={sku}
                                onChange={(e) =>
                                    setSku(e.target.value.toUpperCase())
                                }
                                className="w-full px-3.5 py-2 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-[#1e293b] text-sm uppercase placeholder:text-[#94a3b8] transition-all font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#334155] mb-1">
                                Kategori Bahan{" "}
                                <span className="text-[#ef4444]">*</span>
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(Number(e.target.value))
                                }
                                className="w-full px-3.5 py-2 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-[#1e293b] text-sm transition-all bg-white"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#334155] mb-1">
                                Stok Saat Ini{" "}
                                <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                placeholder="0"
                                value={stock}
                                onChange={(e) =>
                                    setStock(parseFloat(e.target.value) || 0)
                                }
                                className="w-full px-3.5 py-2 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-[#1e293b] text-sm font-semibold transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#334155] mb-1">
                                Satuan (Unit){" "}
                                <span className="text-[#ef4444]">*</span>
                            </label>
                            <div className="flex gap-1.5">
                                <input
                                    type="text"
                                    placeholder="kg / Liter / Botol"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-[#1e293b] text-sm"
                                />
                                <select
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="px-2 py-2 border border-[#cbd5e1] rounded-lg text-xs bg-gray-50 text-gray-700 focus:outline-none"
                                >
                                    <option value="">Pilih</option>
                                    {standardUnits.map((u) => (
                                        <option key={u} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#334155] mb-1">
                                Batas Minimum Stok{" "}
                                <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                placeholder="5"
                                value={minStock}
                                onChange={(e) =>
                                    setMinStock(parseFloat(e.target.value) || 0)
                                }
                                className="w-full px-3.5 py-2 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-[#1e293b] text-sm transition-all"
                            />
                            <span className="text-[11px] text-[#64748b] block mt-0.5">
                                Notifikasi restock jika di bawah angka ini.
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#334155] mb-1">
                                Estimasi Pemakaian/Hari
                            </label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                placeholder="1.5"
                                value={estDaily}
                                onChange={(e) =>
                                    setEstDaily(parseFloat(e.target.value) || 0)
                                }
                                className="w-full px-3.5 py-2 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-[#1e293b] text-sm transition-all"
                            />
                            <span className="text-[11px] text-[#64748b] block mt-0.5">
                                Pemakaian rata-rata per hari.
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="pt-3 border-t border-[#f1f5f9] flex gap-2 justify-end mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-[#cbd5e1] text-[#475569] hover:bg-[#f8fafc] text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#D91A20] hover:bg-[#b91c1c] text-white text-xs font-medium px-4 shadow-sm"
                        >
                            {isEdit ? "Simpan Perubahan" : "Tambah Bahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
