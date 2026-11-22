import React, { useEffect, useState } from "react";
import { TableItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

interface MejaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    meja: TableItem | null;
    onSave: (tableData: Omit<TableItem, "id"> & { id?: number }) => void;
}

export default function MejaFormModal({
    isOpen,
    onClose,
    meja,
    onSave,
}: MejaFormModalProps) {
    const isEdit = Boolean(meja);

    const [nomorMeja, setNomorMeja] = useState("");
    const [area, setArea] = useState<"indoor" | "outdoor">("indoor");
    const [kapasitas, setKapasitas] = useState<number>(4);
    const [status, setStatus] = useState<"tersedia" | "terisi">("tersedia");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (meja) {
                setNomorMeja(meja.table_number?.toString() || "");
                setArea(meja.location === "outdoor" ? "outdoor" : "indoor");
                setKapasitas(meja.capacity || 4);
                setStatus(meja.available ? "tersedia" : "terisi");
            } else {
                setNomorMeja("");
                setArea("indoor");
                setKapasitas(4);
                setStatus("tersedia");
            }
        }
    }, [isOpen, meja]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const num = parseInt(nomorMeja, 10);
        if (!nomorMeja.toString().trim() || isNaN(num) || num <= 0) {
            setError("Nomor meja wajib diisi dengan angka bulat positif");
            return;
        }

        const cap = Number(kapasitas);
        if (isNaN(cap) || cap <= 0) {
            setError("Kapasitas kursi minimal 1 orang");
            return;
        }

        onSave({
            ...(meja ? { id: meja.id } : {}),
            table_number: num,
            capacity: cap,
            available: status === "tersedia",
            location: area,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-xl font-bold text-[#1e293b]">
                        {isEdit ? "Edit Meja" : "Tambah Meja Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[#64748b]">
                        {isEdit
                            ? "Perbarui informasi nomor meja, area, dan ketersediaan."
                            : "Isi data formulir di bawah ini untuk menambahkan meja baru."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-hidden min-h-0 mt-2"
                >
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2 py-1">
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                                Nomor Meja <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={nomorMeja}
                                onChange={(e) => {
                                    setNomorMeja(e.target.value);
                                    if (error) setError(null);
                                }}
                                placeholder="1"
                                className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 ${
                                    error
                                        ? "border-red-500 focus:border-red-600"
                                        : "border-[#d1d5db] focus:border-[#D91A20]"
                                }`}
                            />
                            {error && (
                                <p className="text-xs text-red-500 mt-1">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Area / Lokasi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={area}
                                    onChange={(e) =>
                                        setArea(e.target.value as "indoor" | "outdoor")
                                    }
                                    className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none bg-white transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20]"
                                >
                                    <option value="indoor">Indoor</option>
                                    <option value="outdoor">Outdoor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value as "tersedia" | "terisi")
                                    }
                                    className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none bg-white transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20]"
                                >
                                    <option value="tersedia">Tersedia</option>
                                    <option value="terisi">Terisi</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                                Kapasitas Kursi (Orang) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={kapasitas}
                                onChange={(e) =>
                                    setKapasitas(Number(e.target.value))
                                }
                                placeholder="Contoh: 4"
                                className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20]"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-3 mt-3 border-t border-gray-100 flex-shrink-0 gap-2">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#D91A20] hover:bg-[#b91c1c] text-white px-5 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                            {isEdit ? "Simpan Perubahan" : "Tambah Meja"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
