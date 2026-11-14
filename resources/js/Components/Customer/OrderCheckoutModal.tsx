import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { CartItem, CustomerTable } from "@/types/customer";
import { formatIDR, getImageSrc } from "@/lib/utils";
import { ImageWithFallback } from "@/Components/ui/ImageWithFallback";
import {
    X,
    ArrowLeft,
    Plus,
    Minus,
    Edit3,
    CheckCircle2,
    Store,
    AlertCircle,
    Loader2,
} from "lucide-react";

interface OrderCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: CustomerTable;
    cart: Record<number, CartItem>;
    onUpdateQuantity: (menuId: number, delta: number) => void;
    onUpdateNotes: (menuId: number, notes: string) => void;
}

export default function OrderCheckoutModal({
    isOpen,
    onClose,
    table,
    cart,
    onUpdateQuantity,
    onUpdateNotes,
}: OrderCheckoutModalProps) {
    const [customerName, setCustomerName] = useState("");
    const [nameError, setNameError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [tempNote, setTempNote] = useState("");

    const cartItems = Object.values(cart).filter((item) => item.quantity > 0);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.menu.price * item.quantity,
        0,
    );

    const handleStartEditNote = (menuId: number, currentNote: string) => {
        setEditingNoteId(menuId);
        setTempNote(currentNote || "");
    };

    const handleSaveNote = (menuId: number) => {
        onUpdateNotes(menuId, tempNote);
        setEditingNoteId(null);
        setTempNote("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerName.trim()) {
            setNameError("Nama pemesan wajib diisi.");
            return;
        }

        setNameError("");
        setIsSubmitting(true);

        const payload = {
            table_token: table.token,
            customer_name: customerName.trim(),
            items: cartItems.map((item) => ({
                menu_id: item.menu.id,
                quantity: item.quantity,
                notes: item.notes,
            })),
        };

        router.post("/order", payload, {
            onError: (errors) => {
                setIsSubmitting(false);
                if (errors.customer_name) {
                    setNameError(errors.customer_name);
                } else if (errors.error) {
                    alert(errors.error);
                }
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <div
                className="fixed inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            />

            <div className="relative z-10 flex h-[92vh] w-full max-w-md flex-col rounded-t-3xl bg-[#f8fafc] shadow-2xl animate-in slide-in-from-bottom duration-200">
                {/* Header (Like Screenshot 2) */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3.5 rounded-t-3xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="text-center">
                        <h2 className="text-sm font-bold text-gray-900">
                            Konfirmasi Pesanan
                        </h2>
                        <p className="text-[11px] text-gray-500">
                            Garis Kota • Meja #{table.table_number}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {/* Table Info Card */}
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-900">
                                Meja #{table.table_number} (Area {table.location})
                            </span>
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800">
                                Dine-In
                            </span>
                        </div>
                        <p className="mt-1 text-emerald-700 text-[11px]">
                            Pesanan akan disajikan langsung ke mejamu setelah dibuat.
                        </p>
                    </div>

                    {/* Customer Name Form Input (Single Required Field) */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                            Nama Pemesan <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-[11px] text-gray-500 mb-2">
                            Tulis namamu agar barista & pelayan mudah memanggil atau menyajikan ke meja.
                        </p>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => {
                                setCustomerName(e.target.value);
                                if (nameError) setNameError("");
                            }}
                            placeholder="Contoh: Budi / Kak Sarah"
                            maxLength={50}
                            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                                nameError
                                    ? "border-rose-400 focus:ring-rose-200"
                                    : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-100"
                            }`}
                        />
                        {nameError && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-500">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {nameError}
                            </p>
                        )}
                    </div>

                    {/* Order Items List (Screenshot 2 Style) */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                            Rincian Item ({cartItems.length})
                        </h3>

                        <div className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <div key={item.menu.id} className="py-3 first:pt-0 last:pb-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm">
                                                {item.menu.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {formatIDR(item.menu.price)}
                                            </p>

                                            {/* Note row */}
                                            {editingNoteId === item.menu.id ? (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={tempNote}
                                                        onChange={(e) => setTempNote(e.target.value)}
                                                        placeholder="Contoh: es dipisah, less sugar..."
                                                        className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSaveNote(item.menu.id)}
                                                        className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                                                    >
                                                        Simpan
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStartEditNote(item.menu.id, item.notes)
                                                    }
                                                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800"
                                                >
                                                    <Edit3 className="h-3 w-3" />
                                                    <span>
                                                        {item.notes
                                                            ? `Catatan: ${item.notes}`
                                                            : "+ Tambah Catatan"}
                                                    </span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Image & Stepper */}
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <div className="h-12 w-12 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                                <ImageWithFallback
                                                    src={getImageSrc(item.menu.image)}
                                                    alt={item.menu.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex items-center rounded-full border border-gray-200 bg-white p-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateQuantity(item.menu.id, -1)}
                                                    className="flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-5 text-center text-xs font-bold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateQuantity(item.menu.id, 1)}
                                                    disabled={item.quantity >= item.menu.stock}
                                                    className="flex h-5 w-5 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Button Add More Items */}
                        <div className="mt-4 pt-3 border-t border-dashed border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Ada lagi yang mau dipesan? Tambah</span>
                            </button>
                        </div>
                    </div>

                    {/* Ringkasan Pembayaran */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                            Ringkasan Pembayaran
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Subtotal Menu</span>
                            <span className="font-semibold text-gray-900">
                                {formatIDR(subtotal)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Pajak & Layanan</span>
                            <span className="font-medium text-emerald-600">Termasuk</span>
                        </div>
                        <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm font-bold text-gray-900">
                            <span>Total Pembayaran</span>
                            <span className="text-emerald-700 text-base">
                                {formatIDR(subtotal)}
                            </span>
                        </div>
                    </div>

                    {/* Metode Pembayaran Card */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <Store className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">
                                    Bayar di Kasir
                                </p>
                                <p className="text-[11px] text-gray-500">
                                    Tunai atau QRIS Kasir saat pesanan dibuat
                                </p>
                            </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                </div>

                {/* Sticky Bottom Order Button */}
                <div className="border-t border-gray-100 bg-white p-4 shadow-lg">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || cartItems.length === 0}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-emerald-700/25 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Mengirim Pesanan...</span>
                            </>
                        ) : (
                            <>
                                <span>Pesan Sekarang</span>
                                <span>•</span>
                                <span>{formatIDR(subtotal)}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

