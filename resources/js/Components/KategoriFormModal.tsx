import React, { useEffect, useState } from "react";
import { CategoryItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

interface KategoriFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: CategoryItem | null;
    onSave: (data: { id?: number; name: string }) => void;
}

export default function KategoriFormModal({
    isOpen,
    onClose,
    category,
    onSave,
}: KategoriFormModalProps) {
    const isEdit = Boolean(category);
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (category) {
                setName(category.name || "");
            } else {
                setName("");
            }
        }
    }, [isOpen, category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Nama kategori wajib diisi");
            return;
        }

        onSave({
            ...(category ? { id: category.id } : {}),
            name: name.trim(),
        });

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md flex flex-col bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-xl font-bold text-[#1e293b]">
                        {isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[#64748b]">
                        {isEdit
                            ? "Perbarui informasi dan nama kategori menu."
                            : "Masukkan nama kategori baru untuk mengelompokkan menu Anda."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col mt-3 space-y-4"
                >
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#334155] mb-1">
                            Nama Kategori{" "}
                            <span className="text-[#ef4444]">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Makanan, Minuman, Dessert"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#ef4444] text-[#1e293b] text-sm placeholder:text-[#94a3b8] transition-all"
                            autoFocus
                        />
                    </div>

                    <DialogFooter className="pt-3 flex gap-2 sm:justify-end border-t border-[#f1f5f9]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-[#cbd5e1] text-[#475569] hover:bg-[#f8fafc] rounded-lg"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#D91A20] hover:bg-[#b91c1c] text-white font-medium rounded-lg px-5 shadow-sm transition-all"
                        >
                            {isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
