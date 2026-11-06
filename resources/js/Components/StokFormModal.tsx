import React, { useEffect, useState } from "react";
import { StockItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

interface StokFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    stockItem: StockItem | null;
    onSave: (data: { id: number; stock: number; min_stock: number }) => void;
}

export default function StokFormModal({
    isOpen,
    onClose,
    stockItem,
    onSave,
}: StokFormModalProps) {
    const [stock, setStock] = useState<number>(0);
    const [minStock, setMinStock] = useState<number>(0);

    useEffect(() => {
        if (isOpen && stockItem) {
            setStock(stockItem.stock);
            setMinStock(stockItem.min_stock);
        }
    }, [isOpen, stockItem]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!stockItem) return;

        onSave({
            id: stockItem.id,
            stock: Number(stock),
            min_stock: Number(minStock),
        });

        onClose();
    };

    if (!stockItem) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Stok Bahan</DialogTitle>
                    <DialogDescription>
                        Perbarui jumlah stok saat ini dan batas minimum stok untuk{" "}
                        <strong className="text-gray-900">{stockItem.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 my-2">
                    <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                            Stok Saat Ini ({stockItem.unit})
                        </label>
                        <input
                            type="number"
                            step="any"
                            value={stock}
                            onChange={(e) => setStock(parseFloat(e.target.value) || 0)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-sm text-[#1e293b]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                            Batas Minimum Stok ({stockItem.unit})
                        </label>
                        <input
                            type="number"
                            step="any"
                            value={minStock}
                            onChange={(e) => setMinStock(parseFloat(e.target.value) || 0)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-sm text-[#1e293b]"
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#D91A20] hover:bg-[#b91c1c] text-white"
                        >
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
