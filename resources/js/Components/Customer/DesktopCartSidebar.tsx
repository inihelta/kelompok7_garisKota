import React, { useState } from "react";
import { CustomerTable, CartItem } from "@/types/customer";
import { formatIDR, getImageSrc } from "@/lib/utils";
import { ImageWithFallback } from "@/Components/ui/ImageWithFallback";
import {
    ShoppingBag,
    Plus,
    Minus,
    Edit3,
    Trash2,
    Store,
    Loader2,
    Check,
    Coffee,
    AlertCircle,
    ShoppingBasket,
    Receipt,
    QrCode,
    ConciergeBell,
} from "lucide-react";

interface DesktopCartSidebarProps {
    table: CustomerTable;
    cart: Record<number, CartItem>;
    totalItems: number;
    totalPrice: number;
    customerName: string;
    setCustomerName: (name: string) => void;
    nameError: string;
    isSubmitting: boolean;
    paymentMethod?: "qris" | "cash";
    setPaymentMethod?: (method: "qris" | "cash") => void;
    onAdd: (menuId: number) => void;
    onRemove: (menuId: number) => void;
    onUpdateNotes: (menuId: number, notes: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function DesktopCartSidebar({
    table,
    cart,
    totalItems,
    totalPrice,
    customerName,
    setCustomerName,
    nameError,
    isSubmitting,
    paymentMethod,
    setPaymentMethod,
    onAdd,
    onRemove,
    onUpdateNotes,
    onSubmit,
}: DesktopCartSidebarProps) {
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [tempNote, setTempNote] = useState("");
    const [internalPaymentMethod, setInternalPaymentMethod] = useState<
        "qris" | "cash"
    >("qris");

    const selectedPayment = paymentMethod ?? internalPaymentMethod;
    const setSelectedPayment = setPaymentMethod ?? setInternalPaymentMethod;

    const cartItems = Object.values(cart).filter((item) => item.quantity > 0);

    const handleStartEditNote = (menuId: number, currentNote: string) => {
        setEditingNoteId(menuId);
        setTempNote(currentNote || "");
    };

    const handleSaveNote = (menuId: number) => {
        onUpdateNotes(menuId, tempNote);
        setEditingNoteId(null);
        setTempNote("");
    };

    return (
        <aside className="sticky top-6 hidden lg:flex flex-col rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm shadow-gray-200/60 h-fit max-h-[calc(100vh-3rem)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[#D91A20]">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-gray-900 leading-tight">
                            Pesanan Kamu
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">
                            Meja #{table.table_number} • Area {table.location}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content area: Scrollable items */}
            <div className="overflow-y-auto py-3.5 space-y-3 pr-1 max-h-[260px] xl:max-h-[300px] no-scrollbar">
                {cartItems.length === 0 ? (
                    <div className="py-6 px-4 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200/80">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-400 border border-gray-200/60 mb-2 shadow-2xs">
                            <ShoppingBasket className="h-5 w-5 text-gray-400" />
                        </div>
                        <h4 className="text-xs font-bold text-gray-800">
                            Keranjang Masih Kosong
                        </h4>
                        <p className="mt-0.5 text-[11px] text-gray-500 leading-relaxed max-w-[210px] mx-auto">
                            Pilih menu favoritmu di sebelah kiri untuk mulai
                            memesan.
                        </p>
                    </div>
                ) : (
                    cartItems.map(({ menu, quantity, notes }) => (
                        <div
                            key={menu.id}
                            className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3 transition-colors hover:bg-gray-50 hover:border-gray-200"
                        >
                            <div className="flex items-start justify-between gap-2.5">
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200/60 bg-white">
                                    <ImageWithFallback
                                        src={getImageSrc(menu.image)}
                                        alt={menu.name}
                                        className="h-full w-full object-contain object-center"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-gray-900 truncate">
                                        {menu.name}
                                    </h4>
                                    <span className="text-xs font-extrabold text-[#D91A20]">
                                        {formatIDR(menu.price * quantity)}
                                    </span>
                                </div>

                                {/* Stepper */}
                                <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 shadow-2xs">
                                    <button
                                        type="button"
                                        onClick={() => onRemove(menu.id)}
                                        className="flex h-5 w-5 items-center justify-center text-gray-400 hover:text-[#D91A20] transition-colors"
                                    >
                                        <Minus className="h-3 w-3" />
                                    </button>
                                    <span className="min-w-[14px] text-center text-xs font-black text-gray-800">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onAdd(menu.id)}
                                        disabled={quantity >= menu.stock}
                                        className="flex h-5 w-5 items-center justify-center text-gray-400 hover:text-[#D91A20] disabled:opacity-30 transition-colors"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Notes display / editor */}
                            <div className="mt-2 pt-2 border-t border-gray-200/50">
                                {editingNoteId === menu.id ? (
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="text"
                                            value={tempNote}
                                            onChange={(e) =>
                                                setTempNote(e.target.value)
                                            }
                                            placeholder="Contoh: Tanpa gula, pedas"
                                            className="flex-1 rounded-lg border border-red-300 bg-white px-2.5 py-1 text-[11px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#D91A20]"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleSaveNote(menu.id);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSaveNote(menu.id)
                                            }
                                            className="rounded-lg bg-[#D91A20] px-2 py-1 text-[11px] font-bold text-white hover:bg-[#b91c1c]"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-gray-500 truncate max-w-[190px]">
                                            {notes ? (
                                                <span className="text-[#D91A20] italic">
                                                    "{notes}"
                                                </span>
                                            ) : (
                                                "Tanpa catatan khusus"
                                            )}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleStartEditNote(
                                                    menu.id,
                                                    notes || "",
                                                )
                                            }
                                            className="text-[#D91A20] hover:text-[#b91c1c] font-semibold inline-flex items-center gap-1 shrink-0"
                                        >
                                            <Edit3 className="h-3 w-3" />
                                            <span>
                                                {notes ? "Ubah" : "+ Catatan"}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Form & Checkout */}
            <form
                onSubmit={onSubmit}
                className="pt-3 border-t border-gray-100 space-y-3"
            >
                {/* Customer Name Input */}
                <div>
                    <label
                        htmlFor="desktop-customer-name"
                        className="block text-xs font-bold text-gray-700 mb-1"
                    >
                        Nama Pemesan <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="desktop-customer-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Rian"
                        className={`w-full rounded-xl border bg-gray-50/80 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 ${
                            nameError
                                ? "border-rose-400 focus:ring-rose-100"
                                : "border-gray-200 focus:border-[#D91A20] focus:ring-red-100"
                        }`}
                    />
                    {nameError && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
                            <AlertCircle className="h-3 w-3" />
                            {nameError}
                        </p>
                    )}
                </div>

                {/* Subtotal & Total */}
                <div className="rounded-2xl bg-gray-50 p-3 space-y-1.5 border border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Subtotal ({totalItems} item)</span>
                        <span className="font-semibold">
                            {formatIDR(totalPrice)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Biaya Layanan / Kasir</span>
                        <span className="font-semibold ">Gratis</span>
                    </div>
                    <div className="pt-1.5 border-t border-gray-200/60 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-gray-900">
                            Total
                        </span>
                        <span className="text-base font-black text-[#D91A20]">
                            {formatIDR(totalPrice)}
                        </span>
                    </div>
                </div>

                {/* Metode Pembayaran */}
                <div className="rounded-2xl border border-gray-100 p-3 space-y-2.5 bg-gray-50">
                    <div className="flex items-center gap-2 pb-2 border-b border-dashed border-gray-200/70">
                        <Receipt className="h-4 w-4 text-[#D91A20]" />
                        <span className="text-xs font-bold text-gray-800">
                            Metode Pembayaran
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div
                            onClick={() => setSelectedPayment("qris")}
                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                                selectedPayment === "qris"
                                    ? "border-[#D91A20] bg-white ring-1 ring-[#D91A20]/20"
                                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-[#D91A20]">
                                    <QrCode className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-semibold text-gray-900">
                                    QRIS
                                </span>
                            </div>
                            <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                                    selectedPayment === "qris"
                                        ? "border-[3.5px] border-[#D91A20] bg-white"
                                        : "border border-gray-300 bg-white"
                                }`}
                            />
                        </div>

                        <div
                            onClick={() => setSelectedPayment("cash")}
                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                                selectedPayment === "cash"
                                    ? "border-[#D91A20] bg-white ring-1 ring-[#D91A20]/20"
                                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-[#D91A20]">
                                    <ConciergeBell className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-semibold text-gray-800">
                                    Tunai di kasir
                                </span>
                            </div>
                            <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                                    selectedPayment === "cash"
                                        ? "border-[3.5px] border-[#D91A20] bg-white"
                                        : "border border-gray-300 bg-white"
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={cartItems.length === 0 || isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#D91A20] py-3 text-xs font-extrabold text-white shadow-xs hover:bg-[#b91c1c] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Memproses Pesanan...</span>
                        </>
                    ) : (
                        <span>Pesan Sekarang ({formatIDR(totalPrice)})</span>
                    )}
                </button>
            </form>
        </aside>
    );
}
