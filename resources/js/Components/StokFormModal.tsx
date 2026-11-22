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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-xl font-bold text-[#1e293b]">
                        {isEdit
                            ? "Edit Stok Bahan"
                            : "Tambah Bahan Baku Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[#64748b]">
                        {isEdit
                            ? "Perbarui rincian, jumlah stok, dan batas minimum bahan."
                            : "Isi data formulir berikut untuk mendaftarkan bahan baku baru ke stok."}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="flex items-center gap-2 p-3 mt-3 bg-red-50 border border-red-200 text-[#ef4444] rounded-lg text-sm">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-hidden min-h-0 mt-2"
                >
                    <div className="space-y-4 overflow-y-auto overflow-x-hidden flex-1 pr-1 py-1">
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                                Nama Bahan Baku{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: House Blend Beans, Fresh Milk 1L..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20] text-[#1e293b]"
                                autoFocus={!isEdit}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="min-w-0">
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Kode SKU{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: SKU-COF-01"
                                    value={sku}
                                    onChange={(e) =>
                                        setSku(e.target.value.toUpperCase())
                                    }
                                    className="w-full px-3.5 py-2 rounded-lg border text-sm uppercase transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20] font-mono text-[#1e293b]"
                                />
                            </div>

                            <div className="min-w-0">
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Kategori Bahan{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={categoryId ? String(categoryId) : undefined}
                                    onValueChange={(val) =>
                                        setCategoryId(Number(val))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={String(cat.id)}
                                            >
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="min-w-0">
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Stok Saat Ini{" "}
                                    <span className="text-red-500">*</span>
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
                                    className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20] text-[#1e293b] font-semibold"
                                />
                            </div>

                            <div className="min-w-0">
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Satuan (Unit){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={unit || undefined}
                                    onValueChange={(val) => setUnit(val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Satuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from(
                                            new Set([
                                                ...standardUnits,
                                                ...(unit ? [unit] : []),
                                            ])
                                        ).map((u) => (
                                            <SelectItem key={u} value={u}>
                                                {u}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="min-w-0">
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Batas Minimum Stok{" "}
                                    <span className="text-red-500">*</span>
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
                                    className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20] text-[#1e293b]"
                                />
                                <span className="text-xs text-[#64748b] block mt-1">
                                    Notifikasi restock jika di bawah angka ini.
                                </span>
                            </div>

                            <div className="min-w-0">
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Estimasi Pemakaian/Hari
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    min="0"
                                    placeholder="1"
                                    value={estDaily}
                                    onChange={(e) =>
                                        setEstDaily(parseFloat(e.target.value) || 0)
                                    }
                                    className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20] text-[#1e293b]"
                                />
                                <span className="text-xs text-[#64748b] block mt-1">
                                    Pemakaian rata-rata per hari.
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-3 mt-3 border-t border-gray-100 flex-shrink-0 gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="text-[#64748b] hover:text-[#1e293b] cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#D91A20] hover:bg-[#b91c1c] text-white px-5 rounded-lg transition-all duration-200 cursor-pointer text-sm font-semibold"
                        >
                            {isEdit ? "Simpan Perubahan" : "Tambah Bahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
