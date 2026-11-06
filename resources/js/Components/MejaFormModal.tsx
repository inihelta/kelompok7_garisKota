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
    const [area, setArea] = useState<"Indoor" | "Outdoor">("Indoor");
    const [kapasitas, setKapasitas] = useState<number>(4);
    const [status, setStatus] = useState<"tersedia" | "terisi" | "reservasi">("tersedia");
    const [catatan, setCatatan] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (meja) {
                setNomorMeja(meja.nomor_meja || "");
                setArea(meja.area || "Indoor");
                setKapasitas(meja.kapasitas || 4);
                setStatus(meja.status || "tersedia");
                setCatatan(meja.catatan || "");
            } else {
                setNomorMeja("");
                setArea("Indoor");
                setKapasitas(4);
                setStatus("tersedia");
                setCatatan("");
            }
        }
    }, [isOpen, meja]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!nomorMeja.trim()) {
            setError("Nomor meja wajib diisi");
            return;
        }

        if (kapasitas <= 0) {
            setError("Kapasitas kursi minimal 1 orang");
            return;
        }

        onSave({
            ...(meja ? { id: meja.id } : {}),
            nomor_meja: nomorMeja.trim(),
            area,
            kapasitas: Number(kapasitas),
            status,
            catatan: catatan.trim() || "-",
        });

        onClose();
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
                    {/* Scrollable form body */}
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2 py-1">
                        {/* Nomor Meja */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                                Nomor Meja <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={nomorMeja}
                                onChange={(e) => {
                                    setNomorMeja(e.target.value);
                                    if (error) setError(null);
                                }}
                                placeholder="Contoh: Meja 01"
                                className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 ${
                                    error
                                        ? "border-red-500 focus:border-red-600"
                                        : "border-[#d1d5db] focus:border-[#D91A20]"
                                }`}
                            />
                            {error && (
                                <p className="text-xs text-red-500 mt-1">{error}</p>
                            )}
                        </div>

                        {/* Area & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Area / Lokasi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={area}
                                    onChange={(e) =>
                                        setArea(e.target.value as "Indoor" | "Outdoor")
                                    }
                                    className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none bg-white transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20]"
                                >
                                    <option value="Indoor">Indoor</option>
                                    <option value="Outdoor">Outdoor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(
                                            e.target.value as
                                                | "tersedia"
                                                | "terisi"
                                                | "reservasi"
                                        )
                                    }
                                    className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none bg-white transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20]"
                                >
                                    <option value="tersedia">Tersedia</option>
                                    <option value="terisi">Terisi</option>
                                    <option value="reservasi">Reservasi</option>
                                </select>
                            </div>
                        </div>

                        {/* Kapasitas */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                                Kapasitas Kursi (Orang) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={kapasitas}
                                onChange={(e) => setKapasitas(Number(e.target.value))}
                                placeholder="Contoh: 4"
                                className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20]"
                            />
                        </div>

                        {/* Catatan / Keterangan */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                                Catatan / Keterangan
                            </label>
                            <textarea
                                rows={3}
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                placeholder="Contoh: Dekat jendela, area non-smoking"
                                className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none resize-none transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20]"
                            />
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <DialogFooter className="pt-3 mt-3 border-t border-gray-100 flex-shrink-0 gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
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

