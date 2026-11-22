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
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface MejaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    meja: TableItem | null;
    onSave: (
        tableData: Omit<TableItem, "id"> & {
            id?: number;
            order_action?: "complete" | "cancel";
        },
    ) => void;
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
    const [status, setStatus] = useState<"tersedia" | "Terisi">("tersedia");
    const [error, setError] = useState<string | null>(null);

    const [showConflictDialog, setShowConflictDialog] = useState(false);
    const [pendingFormData, setPendingFormData] = useState<{
        table_number: number;
        capacity: number;
        available: boolean;
        location: "indoor" | "outdoor";
    } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setShowConflictDialog(false);
            setPendingFormData(null);
            if (meja) {
                setNomorMeja(meja.table_number?.toString() || "");
                setArea(meja.location === "outdoor" ? "outdoor" : "indoor");
                setKapasitas(meja.capacity || 4);
                setStatus(meja.available ? "tersedia" : "Terisi");
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

        const formData = {
            table_number: num,
            capacity: cap,
            available: status === "tersedia",
            location: area,
        };

        if (isEdit && meja?.active_order && status === "tersedia") {
            setPendingFormData(formData);
            setShowConflictDialog(true);
            return;
        }

        onSave({
            ...(meja ? { id: meja.id } : {}),
            ...formData,
        });
    };

    const handleResolveOrders = (action: "complete" | "cancel") => {
        if (!pendingFormData) return;
        setShowConflictDialog(false);
        onSave({
            ...(meja ? { id: meja.id } : {}),
            ...pendingFormData,
            available: true,
            order_action: action,
        });
    };

    const handleCancelConflict = () => {
        setShowConflictDialog(false);
        setStatus("Terisi");
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
                    <DialogHeader className="shrink-0">
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
                        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2 py-1">
                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Nomor Meja{" "}
                                    <span className="text-red-500">*</span>
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
                                        Area / Lokasi{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={area}
                                        onChange={(e) =>
                                            setArea(
                                                e.target.value as
                                                    | "indoor"
                                                    | "outdoor",
                                            )
                                        }
                                        className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none bg-white transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20]"
                                    >
                                        <option value="indoor">Indoor</option>
                                        <option value="outdoor">Outdoor</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#334155] mb-1">
                                        Status{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(
                                                e.target.value as
                                                    | "tersedia"
                                                    | "Terisi",
                                            )
                                        }
                                        className="w-full px-3.5 py-2 rounded-lg border text-sm outline-none bg-white transition-colors duration-200 border-[#d1d5db] focus:border-[#D91A20]"
                                    >
                                        <option value="tersedia">
                                            Tersedia
                                        </option>
                                        <option value="Terisi">Terisi</option>
                                    </select>
                                    {isEdit && meja?.active_order && (
                                        <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1 font-medium">
                                            <AlertTriangle className="size-3 shrink-0" />
                                            <span>
                                                Memiliki pesanan #
                                                {meja.active_order.id} aktif
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Kapasitas Kursi (Orang){" "}
                                    <span className="text-red-500">*</span>
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

            {/* Dialog Konfirmasi Tindakan Pesanan Aktif Saat Mengubah Status Meja */}
            <Dialog
                open={showConflictDialog}
                onOpenChange={(open) => !open && handleCancelConflict()}
            >
                <DialogContent className="sm:max-w-lg bg-white p-6 rounded-2xl shadow-xl overflow-hidden border border-[#e5e7eb]">
                    <DialogHeader className="flex-shrink-0 text-left">
                        <DialogTitle className="text-xl font-bold text-[#1e293b]">
                            Konfirmasi Status Meja M-{nomorMeja}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-[#64748b]">
                            Meja ini masih memiliki pesanan aktif yang belum
                            diselesaikan.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2 space-y-3">
                        {meja?.active_order && (
                            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 text-left">
                                <div className="flex items-center justify-between text-sm font-semibold text-[#1e293b]">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                                        <span>
                                            Pesanan #{meja.active_order.id}
                                        </span>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                        {meja.active_order.order_status ===
                                        "processing"
                                            ? "Sedang Diracik"
                                            : "Diterima"}
                                    </span>
                                </div>
                                <div className="mt-2 text-xs text-[#64748b] flex items-center justify-between">
                                    <span>
                                        Pelanggan:{" "}
                                        <strong className="text-[#334155]">
                                            {meja.active_order.customer_name ||
                                                "Pelanggan"}
                                        </strong>
                                    </span>
                                    <span>
                                        {meja.active_order.items_count} item
                                        menu
                                    </span>
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-[#475569] leading-relaxed">
                            Untuk mengubah status meja menjadi{" "}
                            <strong>Tersedia</strong>, silakan tentukan tindakan
                            terhadap pesanan yang masih berjalan:
                        </p>
                    </div>

                    <DialogFooter className="pt-3 mt-2 border-t border-[#f1f5f9] flex items-center justify-between sm:justify-end gap-2 flex-wrap">
                        <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleResolveOrders("cancel")}
                                className="border-red-200 bg-red-50 hover:bg-red-100 text-rose-600 font-semibold px-4 py-2 rounded-lg text-sm transition-all cursor-pointer"
                            >
                                Batalkan Pesanan
                            </Button>

                            <Button
                                type="button"
                                onClick={() => handleResolveOrders("complete")}
                                className="bg-[#D91A20] hover:bg-[#b91c1c] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all cursor-pointer"
                            >
                                Selesaikan Pesanan
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
