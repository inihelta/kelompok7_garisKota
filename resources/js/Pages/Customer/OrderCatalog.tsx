import React, { useState, useMemo, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import {
    CustomerCategory,
    CustomerMenu,
    CustomerTable,
    CartItem,
} from "@/types/customer";
import CustomerHeader from "@/Components/Customer/CustomerHeader";
import MenuItemCard from "@/Components/Customer/MenuItemCard";
import CategoryJumpModal from "@/Components/Customer/CategoryJumpModal";
import FloatingCartBar from "@/Components/Customer/FloatingCartBar";
import OrderCheckoutModal from "@/Components/Customer/OrderCheckoutModal";
import DesktopCartSidebar from "@/Components/Customer/DesktopCartSidebar";
import { Search, X, QrCode, AlertTriangle, Coffee } from "lucide-react";

interface OrderCatalogProps {
    table: CustomerTable | null;
    categories: CustomerCategory[];
    menus: CustomerMenu[];
    isInvalidTable?: boolean;
    error?: string | null;
}

export default function OrderCatalog({
    table,
    categories,
    menus,
    isInvalidTable,
    error,
}: OrderCatalogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState<string>("Semua Menu");
    const [cart, setCart] = useState<Record<number, CartItem>>({});
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Shared checkout form state
    const [customerName, setCustomerName] = useState("");
    const [nameError, setNameError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Active item note modal state
    const [noteModalItem, setNoteModalItem] = useState<CustomerMenu | null>(
        null,
    );
    const [noteText, setNoteText] = useState("");

    // Category refs for smooth scrolling
    const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Filter menus based on search and category
    const filteredMenus = useMemo(() => {
        return menus.filter((menu) => {
            const matchesSearch =
                menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                menu.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategory === "Semua Menu" ||
                menu.category_name === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [menus, searchQuery, selectedCategory]);

    // Group menus by category for clean sectioning
    const groupedMenus = useMemo(() => {
        const groups: Record<string, CustomerMenu[]> = {};
        filteredMenus.forEach((menu) => {
            const cat = menu.category_name || "Lainnya";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(menu);
        });
        return groups;
    }, [filteredMenus]);

    // Cart calculations
    const totalItems = useMemo(() => {
        return Object.values(cart).reduce(
            (sum, item) => sum + item.quantity,
            0,
        );
    }, [cart]);

    const totalPrice = useMemo(() => {
        return Object.values(cart).reduce(
            (sum, item) => sum + item.menu.price * item.quantity,
            0,
        );
    }, [cart]);

    // Cart actions
    const handleAdd = (menu: CustomerMenu) => {
        setCart((prev) => {
            const current = prev[menu.id] || { menu, quantity: 0, notes: "" };
            if (current.quantity >= menu.stock) return prev;
            return {
                ...prev,
                [menu.id]: {
                    ...current,
                    quantity: current.quantity + 1,
                },
            };
        });
    };

    const handleRemove = (menuId: number) => {
        setCart((prev) => {
            const current = prev[menuId];
            if (!current) return prev;
            if (current.quantity <= 1) {
                const next = { ...prev };
                delete next[menuId];
                return next;
            }
            return {
                ...prev,
                [menuId]: {
                    ...current,
                    quantity: current.quantity - 1,
                },
            };
        });
    };

    const handleUpdateQuantity = (menuId: number, delta: number) => {
        if (delta > 0) {
            const menu = menus.find((m) => m.id === menuId);
            if (menu) handleAdd(menu);
        } else {
            handleRemove(menuId);
        }
    };

    const handleUpdateNotes = (menuId: number, notes: string) => {
        setCart((prev) => {
            if (!prev[menuId]) return prev;
            return {
                ...prev,
                [menuId]: {
                    ...prev[menuId],
                    notes,
                },
            };
        });
    };

    const handleOpenNoteModal = (menu: CustomerMenu) => {
        setNoteModalItem(menu);
        setNoteText(cart[menu.id]?.notes || "");
    };

    const handleSaveNoteModal = () => {
        if (noteModalItem) {
            handleUpdateNotes(noteModalItem.id, noteText);
            setNoteModalItem(null);
            setNoteText("");
        }
    };

    const handleScrollToCategory = (catName: string) => {
        setSelectedCategory(catName);
        if (catName !== "Semua Menu" && categoryRefs.current[catName]) {
            categoryRefs.current[catName]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const handleSubmitOrder = (e: React.FormEvent) => {
        e.preventDefault();

        const cartItems = Object.values(cart).filter(
            (item) => item.quantity > 0,
        );
        if (cartItems.length === 0) return;

        if (!customerName.trim()) {
            setNameError("Nama pemesan wajib diisi.");
            return;
        }

        setNameError("");
        setIsSubmitting(true);

        const payload = {
            table_token: table?.token,
            customer_name: customerName.trim(),
            items: cartItems.map((item) => ({
                menu_id: item.menu.id,
                quantity: item.quantity,
                notes: item.notes,
            })),
        };

        router.post("/order", payload, {
            onError: (errors: Record<string, string>) => {
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

    // 1. Invalid Table / Token error state
    if (isInvalidTable || !table) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-6 text-center">
                <Head title="Meja Tidak Ditemukan - Garis Kota" />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 mb-4 shadow-xs">
                    <AlertTriangle className="h-8 w-8" />
                </div>
                <h1 className="text-xl font-black text-gray-900">
                    QR Meja Tidak Valid
                </h1>
                <p className="mt-2 text-sm text-gray-500 max-w-xs">
                    {error ||
                        "Silakan scan ulang QR code yang tertera pada meja Anda atau hubungi pelayan."}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#D91A20] bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
                    <QrCode className="h-4 w-4" />
                    <span>Garis Kota Coffee & Eatery</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white lg:bg-[#f8fafc] pb-28 lg:pb-12 text-gray-900 font-sans antialiased">
            <Head title={`Pesan di Meja #${table.table_number} - Garis Kota`} />

            {/* Responsive Container: Fluid edge-to-edge on mobile/tablet, centered 2-col on desktop */}
            <div className="mx-auto w-full lg:max-w-6xl px-0 lg:px-6 py-0 lg:py-6">
                {/* 1. Header with Table Info (Full width at top on desktop) */}
                <div className="mb-0 lg:mb-6">
                    <CustomerHeader table={table} />
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">
                    {/* Left Column: Menu Catalog (Fluid on mobile/tablet, 8 Cols on Desktop) */}
                    <main className="lg:col-span-8 bg-white min-h-screen lg:min-h-0 shadow-none lg:shadow-xs lg:rounded-3xl lg:border lg:border-gray-200/80 flex flex-col overflow-hidden">
                        {/* 2. Sticky Search & Filter Header (Like Screenshot 1 & 3) */}
                        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 py-2.5 md:py-3.5">
                            {/* Search Bar Input */}
                            <div className="relative flex items-center">
                                <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder="Cari menu favorit kamu..."
                                    className="w-full rounded-full border border-gray-200 bg-gray-50/80 py-2 pl-9 pr-8 text-xs md:text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#D91A20] focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Horizontal Category Scroll Tabs */}
                            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedCategory("Semua Menu")
                                    }
                                    className={`shrink-0 rounded-full px-3.5 py-1 text-xs md:text-sm font-bold transition-all ${
                                        selectedCategory === "Semua Menu"
                                            ? "bg-[#D91A20] text-white shadow-xs"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
                                    }`}
                                >
                                    Semua Menu
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() =>
                                            setSelectedCategory(cat.name)
                                        }
                                        className={`shrink-0 rounded-full px-3.5 py-1 text-xs md:text-sm font-bold transition-all ${
                                            selectedCategory === cat.name
                                                ? "bg-[#D91A20] text-white shadow-xs"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200/80"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Menu List grouped by category */}
                        <div className="flex-1 pb-6">
                            {menus.length === 0 ? (
                                /* Case 2: Table is valid, but the cafe has no menus available */
                                <div className="py-16 px-6 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 border border-gray-100 mb-3 shadow-2xs">
                                        <Coffee className="h-7 w-7 text-gray-400" />
                                    </div>
                                    <h4 className="text-base font-bold text-gray-800">
                                        Menu Belum Tersedia
                                    </h4>
                                    <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                                        Saat ini belum ada menu yang aktif untuk
                                        dipesan. Silakan hubungi pelayan atau
                                        kasir kami.
                                    </p>
                                </div>
                            ) : filteredMenus.length === 0 ? (
                                /* Case 3: Search or filter returned no matches */
                                <div className="py-16 px-6 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 mb-3 shadow-2xs">
                                        <Search className="h-7 w-7 text-amber-500" />
                                    </div>
                                    <h4 className="text-base font-bold text-gray-800">
                                        Menu Tidak Ditemukan
                                    </h4>
                                    <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                                        {searchQuery
                                            ? `Tidak ada menu yang sesuai dengan pencarian "${searchQuery}".`
                                            : `Tidak ada menu dalam kategori "${selectedCategory}".`}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory("Semua Menu");
                                        }}
                                        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-4 py-1.5 text-xs font-bold text-[#D91A20] hover:bg-red-100 transition-colors"
                                    >
                                        Tampilkan Semua Menu
                                    </button>
                                </div>
                            ) : (
                                Object.entries(groupedMenus).map(
                                    ([categoryName, items]) => (
                                        <div
                                            key={categoryName}
                                            ref={(el: any) =>
                                                (categoryRefs.current[
                                                    categoryName
                                                ] = el)
                                            }
                                            className="pt-3 md:pt-4"
                                        >
                                            {/* Category Section Title */}
                                            <div className="px-4 md:px-6 py-2 bg-gray-50/80 border-y border-gray-100 flex items-center justify-between">
                                                <h2 className="text-xs md:text-sm font-black uppercase tracking-wider text-gray-700">
                                                    {categoryName}
                                                </h2>
                                                <span className="text-[11px] md:text-xs font-semibold text-gray-400">
                                                    {items.length} pilihan
                                                </span>
                                            </div>

                                            {/* Menu Item Cards: 1-col on mobile, 2-col grid on md/lg */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-3.5 p-0 md:p-4">
                                                {items.map((menu) => (
                                                    <div
                                                        key={menu.id}
                                                        className={
                                                            items.length === 1
                                                                ? "md:col-span-2"
                                                                : ""
                                                        }
                                                    >
                                                        <MenuItemCard
                                                            menu={menu}
                                                            quantity={
                                                                cart[menu.id]
                                                                    ?.quantity ||
                                                                0
                                                            }
                                                            notes={
                                                                cart[menu.id]
                                                                    ?.notes
                                                            }
                                                            onAdd={() =>
                                                                handleAdd(menu)
                                                            }
                                                            onRemove={() =>
                                                                handleRemove(
                                                                    menu.id,
                                                                )
                                                            }
                                                            onOpenNotes={() =>
                                                                handleOpenNoteModal(
                                                                    menu,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                )
                            )}
                        </div>
                    </main>

                    {/* Right Column: Sticky Cart Sidebar on Desktop (4 Cols on Desktop) */}
                    <div className="hidden lg:block lg:col-span-4">
                        <DesktopCartSidebar
                            table={table}
                            cart={cart}
                            totalItems={totalItems}
                            totalPrice={totalPrice}
                            customerName={customerName}
                            setCustomerName={setCustomerName}
                            nameError={nameError}
                            isSubmitting={isSubmitting}
                            onAdd={(menuId) => {
                                const m = menus.find(
                                    (item) => item.id === menuId,
                                );
                                if (m) handleAdd(m);
                            }}
                            onRemove={handleRemove}
                            onUpdateNotes={handleUpdateNotes}
                            onSubmit={handleSubmitOrder}
                        />
                    </div>
                </div>

                {/* Floating "Menu" Category Jump Button (Mobile only) */}
                <CategoryJumpModal
                    categories={categories}
                    menus={menus}
                    onSelectCategory={handleScrollToCategory}
                    hasCartItems={totalItems > 0}
                />

                {/* Floating Cart Bar (Mobile only) */}
                <FloatingCartBar
                    totalItems={totalItems}
                    totalPrice={totalPrice}
                    tableNumber={table.table_number}
                    onClick={() => setIsCheckoutOpen(true)}
                />

                {/* Checkout Modal / Bottom Sheet (Mobile drawer / dialog fallback) */}
                <OrderCheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    table={table}
                    cart={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onUpdateNotes={handleUpdateNotes}
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    nameError={nameError}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmitOrder}
                />

                {/* Single Item Note Prompt Modal */}
                {noteModalItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                        <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl">
                            <h3 className="text-sm font-bold text-gray-900">
                                Catatan untuk {noteModalItem.name}
                            </h3>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                                Misal: less sugar, es sedikit, tidak terlalu
                                pedas.
                            </p>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Tulis instruksi khusus..."
                                rows={3}
                                className="mt-3 w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#D91A20] focus:outline-none"
                            />
                            <div className="mt-3 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setNoteModalItem(null)}
                                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveNoteModal}
                                    className="rounded-lg bg-[#D91A20] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#b91c1c]"
                                >
                                    Simpan Catatan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
