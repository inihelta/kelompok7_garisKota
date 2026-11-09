import React, { useState } from "react";
import { CategoryItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import {
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    Layers,
    AlertCircle,
} from "lucide-react";

interface MenuCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: CategoryItem[];
    onAddCategory: (name: string) => void;
    onUpdateCategory: (id: number, name: string) => void;
    onDeleteCategory: (id: number) => void;
}

export default function MenuCategoryModal({
    isOpen,
    onClose,
    categories,
    onAddCategory,
    onUpdateCategory,
    onDeleteCategory,
}: MenuCategoryModalProps) {
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmed = newName.trim();
        if (!trimmed) {
            setError("Nama kategori tidak boleh kosong.");
            return;
        }

        if (
            categories.some(
                (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
            )
        ) {
            setError("Kategori dengan nama tersebut sudah ada.");
            return;
        }

        onAddCategory(trimmed);
        setNewName("");
    };

    const handleStartEdit = (category: CategoryItem) => {
        setEditingId(category.id);
        setEditingName(category.name);
        setError(null);
    };

    const handleSaveEdit = (id: number) => {
        const trimmed = editingName.trim();
        if (!trimmed) {
            setError("Nama kategori tidak boleh kosong.");
            return;
        }

        if (
            categories.some(
                (c) =>
                    c.id !== id &&
                    c.name.toLowerCase() === trimmed.toLowerCase(),
            )
        ) {
            setError("Kategori dengan nama tersebut sudah ada.");
            return;
        }

        onUpdateCategory(id, trimmed);
        setEditingId(null);
        setEditingName("");
        setError(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg bg-white p-6 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="flex-shrink-0 pb-3 border-b border-[#f1f5f9]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#ef4444]">
                            <Layers className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-[#1e293b]">
                                Kelola kategori menu.
                            </DialogTitle>
                            <DialogDescription className="text-xs text-[#64748b]">
                                Tambah, hapus, atau Edit kategori menu restoran.
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
                    onSubmit={handleAdd}
                    className="mt-4 flex flex-col gap-2.5"
                >
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nama kategori baru (misal: Biji Kopi & Bubuk)..."
                            className="flex-1 px-3.5 py-2 rounded-lg border border-[#cbd5e1] text-sm text-[#1e293b] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#ef4444] transition-all"
                        />
                        <Button
                            type="submit"
                            className="bg-[#D91A20] hover:bg-[#b91c1c] text-white flex items-center gap-1.5 px-4 rounded-lg font-medium shadow-sm transition-all text-xs"
                        >
                            <Plus className="size-4" />
                            Tambah
                        </Button>
                    </div>
                </form>

                <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1 min-h-[160px]">
                    <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider block mb-2">
                        Daftar Kategori ({categories.length})
                    </span>

                    {categories.length === 0 ? (
                        <div className="text-center py-8 text-xs text-gray-400">
                            Belum ada kategori yang dibuat.
                        </div>
                    ) : (
                        categories.map((cat, index) => {
                            const isEditing = editingId === cat.id;

                            return (
                                <div
                                    key={cat.id || index}
                                    className="flex flex-col p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white transition-colors gap-2"
                                >
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) =>
                                                        setEditingName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    autoFocus
                                                    className="w-full px-2.5 py-1.5 rounded-md border border-[#cbd5e1] text-sm text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#ef4444]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSaveEdit(cat.id)
                                                    }
                                                    className="p-1.5 bg-[#d2ffe2] border border-[#aafcc7] text-[#16a34a] hover:bg-[#bbf7d0] rounded-md transition"
                                                    title="Simpan"
                                                >
                                                    <Check className="size-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    className="p-1.5 bg-gray-200 border border-gray-200 text-gray-600 hover:bg-gray-300 rounded-md transition"
                                                    title="Batal"
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="size-8 rounded-lg bg-[#fee2e2] flex items-center justify-center flex-shrink-0"></div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-semibold text-sm text-[#1e293b] truncate">
                                                        {cat.name}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStartEdit(cat)
                                                    }
                                                    className="w-8 h-8 rounded-md border border-[#e2e8f0] bg-white flex items-center justify-center text-[#475569] hover:bg-gray-100 transition"
                                                    title="Ubah kategori & ikon"
                                                >
                                                    <Pencil className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDeleteCategory(cat.id)
                                                    }
                                                    className="w-8 h-8 rounded-md border border-[#fee2e2] bg-[#fee2e2] flex items-center justify-center text-[#ef4444] hover:bg-[#fecaca] transition"
                                                    title="Hapus kategori"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="pt-3 border-t border-[#f1f5f9] mt-3 flex justify-end">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-[#D91A20] hover:bg-[#b91c1c] text-white px-5 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
