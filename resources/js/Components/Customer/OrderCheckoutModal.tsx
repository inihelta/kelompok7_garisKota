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
    customerName?: string;
    setCustomerName?: (name: string) => void;
    nameError?: string;
    isSubmitting?: boolean;
    onSubmit?: (e: React.FormEvent) => void;
}

export default function OrderCheckoutModal({
    isOpen,
    onClose,
    table,
    cart,
    onUpdateQuantity,
    onUpdateNotes,
    customerName: propCustomerName,
    setCustomerName: propSetCustomerName,
    nameError: propNameError,
    isSubmitting: propIsSubmitting,
    onSubmit: propOnSubmit,
}: OrderCheckoutModalProps) {
    const [localName, setLocalName] = useState("");
    const [localNameError, setLocalNameError] = useState("");
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

    const customerName = propCustomerName !== undefined ? propCustomerName : localName;
    const setCustomerName = propSetCustomerName || setLocalName;
    const nameError = propNameError !== undefined ? propNameError : localNameError;
    const isSubmitting = propIsSubmitting !== undefined ? propIsSubmitting : localIsSubmitting;

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

        if (propOnSubmit) {
            propOnSubmit(e);
            return;
        }

        if (!customerName.trim()) {
            setLocalNameError("Nama pemesan wajib diisi.");
            return;
        }

        setLocalNameError("");
        setLocalIsSubmitting(true);

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
                setLocalIsSubmitting(false);
                if (errors.customer_name) {
                    setLocalNameError(errors.customer_name);
                } else if (errors.error) {
                    alert(errors.error);
                }
            },
            onFinish: () => {
                setLocalIsSubmitting(false);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <div
                className="fixed inset-0"
                onClick={!isSubmitting ? onClose : undefined}
            />

            <div className="relative z-10 flex h-[92vh] sm:h-auto sm:max-h-[88vh] w-full max-w-md sm:max-w-lg flex-col rounded-t-3xl sm:rounded-3xl bg-[#f8fafc] shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
                {/* Header (Like Screenshot 2) */}
                <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3.5 rounded-t-3xl sm:rounded-t-3xl">
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
                    <div className="rounded-2xl border border-red-100 bg-red-50/60 p-3.5 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-[#b91c1c]">
                                Meja #{table.table_number} (Area {table.location})
                            </span>
                            <span className="rounded-md bg-red-100 px-2 py-0.5 font-semibold text-[#b91c1c]">
                                Dine-In
                            </span>
                        </div>
                        <p className="mt-1 text-[#D91A20] text-[11px]">
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
                                if (nameError) setLocalNameError("");
                            }}
                            placeholder="Contoh: Budi / Kak Sarah"
                            maxLength={50}
                            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                                nameError
                                    ? "border-rose-400 focus:ring-rose-200"
                                    : "border-gray-200 focus:border-[#D91A20] focus:ring-red-100"
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
                                                        className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-800 focus:border-[#D91A20] focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSaveNote(item.menu.id)}
                                                        className="rounded-lg bg-[#D91A20] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#b91c1c]"
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
                                                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#D91A20] hover:text-[#b91c1c]"
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
                            <span className="font-medium text-[#D91A20]">Termasuk</span>
                        </div>
                        <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm font-bold text-gray-900">
                            <span>Total Pembayaran</span>
                            <span className="text-[#D91A20] text-base">
                                {formatIDR(subtotal)}
                            </span>
                        </div>
                    </div>

                    {/* Metode Pembayaran Card */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#D91A20] border border-red-100">
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
                        <CheckCircle2 className="h-5 w-5 text-[#D91A20]" />
                    </div>
                </div>

                {/* Sticky Bottom Order Button */}
                <div className="border-t border-gray-100 bg-white p-4 shadow-lg">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || cartItems.length === 0}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#D91A20] py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-red-700/20 transition-all hover:bg-[#b91c1c] active:scale-[0.98] disabled:opacity-60"
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

