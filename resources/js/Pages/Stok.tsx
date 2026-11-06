import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Search,
    Pencil,
    Trash2,
    Archive,
    AlertTriangle,
    Coffee,
    Milk,
    Droplet,
    CupSoda,
    Utensils,
    Package,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
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
import StokFormModal from "@/Components/StokFormModal";

interface StokPageProps {
    auth: any;
    stockItems?: StockItem[];
    categories?: string[];
}

const initialStockItems: StockItem[] = [
    {
        id: 1,
        name: "House Blend Beans",
        sku: "SKU-COF-01",
        category: "Biji Kopi",
        stock: 6.4,
        unit: "kg",
        min_stock: 5.0,
        est_daily: 1.8,
        status: "Aman",
        icon_type: "coffee",
    },
    {
        id: 2,
        name: "Fresh Milk Pasteurisasi 1L",
        sku: "SKU-MLK-01",
        category: "Susu & Dairy",
        stock: 6,
        unit: "Liter",
        min_stock: 8,
        est_daily: 8,
        status: "Menipis",
        icon_type: "milk",
    },
    {
        id: 3,
        name: "Oat Milk Barista 1L",
        sku: "SKU-MLK-02",
        category: "Susu & Dairy",
        stock: 10,
        unit: "Liter",
        min_stock: 8,
        est_daily: 8,
        status: "Aman",
        icon_type: "droplet",
    },
    {
        id: 4,
        name: "Hazelnut Syrup 750ML",
        sku: "SKU-SYR-01",
        category: "Sirup & Topping",
        stock: 2,
        unit: "Botol",
        min_stock: 4,
        est_daily: 6,
        status: "Menipis",
        icon_type: "droplet",
    },
    {
        id: 5,
        name: "Caramel Syrup 750ML",
        sku: "SKU-SYR-02",
        category: "Sirup & Topping",
        stock: 3,
        unit: "Botol",
        min_stock: 4,
        est_daily: 6,
        status: "Aman",
        icon_type: "droplet",
    },
    {
        id: 6,
        name: "Berry Syrup 750ML",
        sku: "SKU-SYR-02",
        category: "Sirup & Topping",
        stock: 3,
        unit: "Botol",
        min_stock: 4,
        est_daily: 6,
        status: "Aman",
        icon_type: "droplet",
    },
    {
        id: 7,
        name: "Paper Cup 12oz",
        sku: "SKU-PKG-01",
        category: "Packaging & Cup",
        stock: 250,
        unit: "Pcs",
        min_stock: 100,
        est_daily: 50,
        status: "Aman",
        icon_type: "cup",
    },
    {
        id: 8,
        name: "Beras Pandan Wangi",
        sku: "SKU-FOD-01",
        category: "Bahan Makanan",
        stock: 15,
        unit: "kg",
        min_stock: 10,
        est_daily: 3,
        status: "Aman",
        icon_type: "food",
    },
];

const defaultCategories = [
    "Semua Kategori",
    "Biji Kopi & Bubuk",
    "Susu & Dairy",
    "Sirup & Topping",
    "Packaging & Cup",
    "Bahan Makanan",
];

export default function Stok({
    auth,
    stockItems: propStock,
    categories: propCategories,
}: StokPageProps) {
    const categories =
        propCategories && propCategories.length > 0
            ? propCategories
            : defaultCategories;

    const [stockItems, setStockItems] = useState<StockItem[]>(
        propStock && propStock.length > 0 ? propStock : initialStockItems,
    );
    const [activeCategory, setActiveCategory] =
        useState<string>("Semua Kategori");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [editingStock, setEditingStock] = useState<StockItem | null>(null);
    const [activeDialog, setActiveDialog] = useState<"edit" | "remove" | null>(
        null,
    );

    const filteredItems = stockItems.filter((item) => {
        const matchesCategory =
            activeCategory === "Semua Kategori" ||
            (activeCategory === "Biji Kopi & Bubuk" &&
                item.category.includes("Biji Kopi")) ||
            item.category === activeCategory;

        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const needRestockCount = stockItems.filter(
        (i) => i.status === "Menipis" || i.stock <= i.min_stock,
    ).length;

    const renderItemIcon = (type?: StockItem["icon_type"]) => {
        switch (type) {
            case "coffee":
                return <Coffee className="w-5 h-5 text-[#ef4444]" />;
            case "milk":
                return <Milk className="w-5 h-5 text-[#ef4444]" />;
            case "droplet":
                return <Droplet className="w-5 h-5 text-[#ef4444]" />;
            case "cup":
                return <CupSoda className="w-5 h-5 text-[#ef4444]" />;
            case "food":
                return <Utensils className="w-5 h-5 text-[#ef4444]" />;
            default:
                return <Package className="w-5 h-5 text-[#ef4444]" />;
        }
    };

    const formatEstDaily = (est: number | string, unit: string) => {
        if (!est && est !== 0) return "-";
        if (typeof est === "string" && est.startsWith("~")) return est;
        const unitLabel = unit === "Liter" ? "L" : unit;
        return `~${est} ${unitLabel}/hr`;
    };

    const handleSaveStock = (data: {
        id: number;
        stock: number;
        min_stock: number;
    }) => {
        setStockItems((prev) =>
            prev.map((item) => {
                if (item.id === data.id) {
                    const status =
                        data.stock <= data.min_stock ? "Menipis" : "Aman";
                    return {
                        ...item,
                        stock: data.stock,
                        min_stock: data.min_stock,
                        status,
                    };
                }
                return item;
            }),
        );
        router.put(
            `/stocks/${data.id}`,
            {
                stock: data.stock,
                min_stock: data.min_stock,
            },
            {
                preserveScroll: true,
                onError: () => {},
            },
        );
        setActiveDialog(null);
        setEditingStock(null);
    };

    const handleDelete = (id: number) => {
        setStockItems((prev) => prev.filter((item) => item.id !== id));
        router.delete(`/stocks/${id}`, {
            preserveScroll: true,
            onError: () => {},
        });
        setSelectedItems([]);
        setActiveDialog(null);
    };

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Stok">
            <Head title="Stok" />

            {/* Header */}
            <div className="flex justify-between pb-3 flex-wrap gap-3 items-center">
                <div className="flex gap-3 my-2">
                    <div className="p-2.5 aspect-square rounded-xl border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <Archive className="size-6 max-md:size-8" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">Manajemen Stok</h2>
                        <span className="text-[14px] text-[#475569] block -mt-1">
                            Pantau ketersediaan biji kopi, susu, sirup, kemasan,
                            dan bahan makanan.
                        </span>
                    </div>
                </div>
            </div>

            {/* 2 Metric Cards */}
            <div className="flex justify-between pb-3 gap-3 items-center">
                {/* 1 */}
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <Archive className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Stok Saat Ini</span>
                    <span className="text-xl font-bold -mt-2">
                        {stockItems.length > 0 ? 325 : 0}
                    </span>
                </div>
                {/* 2 */}
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <AlertTriangle className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Perlu restock</span>
                    <span className="text-xl font-bold -mt-2 text-[#D91A20]">
                        {needRestockCount}
                    </span>
                </div>
            </div>

            {/* Table Section */}
            <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-3">
                {/* Category Pills */}
                <div className="flex gap-2 flex-wrap pb-1">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full text-[14px] font-semibold cursor-pointer transition-all duration-200 ease-in-out ${
                                    isActive
                                        ? "bg-[#fee2e2] text-[#dc2626] border border-transparent"
                                        : "bg-white text-[#4b5563] border border-[#4b5563]/50 hover:bg-[#f3f4f6]"
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <div className="relative flex items-center w-full">
                    <Search className="absolute left-[15px] w-[18px] h-[18px] text-[#9ca3af] pointer-events-none block" />
                    <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nomor meja"
                        className="w-full h-[38px] pl-[40px] pr-[15px] rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c] transition-colors duration-200"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] w-[50px]">
                                    #
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Nama Bahan
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Kategori
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Stok Saat Ini
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Min. Stok
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Est. Harian
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Status
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] w-[120px]">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center py-8 text-gray-400 text-[14px]"
                                    >
                                        Tidak ada bahan ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item, i) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]/50">
                                            {i + 1}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-[8px] bg-[#fee2e2] flex items-center justify-center flex-shrink-0">
                                                    {renderItemIcon(
                                                        item.icon_type,
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span
                                                        // className="font-semibold text-[#1e293b]"
                                                        className={`font-semibold ${
                                                            item.status ===
                                                            "Menipis"
                                                                ? "text-[#D91A20]"
                                                                : "text-[#1e293b]"
                                                        }`}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[12px] text-[#94a3b8] uppercase">
                                                        {item.sku}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            {item.category}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <span
                                                className={`font-bold ${
                                                    item.status === "Menipis"
                                                        ? "text-[#D91A20]"
                                                        : "text-[#1e293b]"
                                                }`}
                                            >
                                                {item.stock}
                                            </span>{" "}
                                            <span className="text-[#64748b] text-[13px]">
                                                {item.unit}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            {item.min_stock} {item.unit}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            {formatEstDaily(
                                                item.est_daily,
                                                item.unit
                                            )}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <span
                                                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold inline-block text-center min-w-[5rem] ${
                                                    item.status === "Aman"
                                                        ? "bg-[#dcfce7] text-[#16a34a]"
                                                        : "bg-[#fee2e2] text-[#ef4444]"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className="w-9 h-9 rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer flex items-center justify-center text-[#475569] transition-all duration-200 hover:bg-[#f1f5f9]"
                                                    title="Edit"
                                                    onClick={() => {
                                                        setEditingStock(item);
                                                        setActiveDialog("edit");
                                                    }}
                                                >
                                                    <Pencil className="w-[18px] h-[18px]" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-9 h-9 rounded-[8px] border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]"
                                                    title="Hapus"
                                                    onClick={() => {
                                                        setActiveDialog(
                                                            "remove",
                                                        );
                                                        setSelectedItems([
                                                            item.id,
                                                        ]);
                                                    }}
                                                >
                                                    <Trash2 className="w-[18px] h-[18px]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="flex justify-between items-center pt-3 text-[14px] text-[#64748b] flex-wrap gap-2">
                    <div>
                        Menampilkan 1 - {filteredItems.length} dari 24 menu
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            className="w-8 h-8 rounded-[8px] border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:bg-gray-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-[8px] bg-[#D91A20] text-white font-medium flex items-center justify-center"
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-[8px] border border-[#e2e8f0] bg-white text-[#64748b] flex items-center justify-center hover:bg-gray-50"
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-[8px] border border-[#e2e8f0] bg-white text-[#64748b] flex items-center justify-center hover:bg-gray-50"
                        >
                            3
                        </button>
                        <button
                            type="button"
                            className="w-8 h-8 rounded-[8px] border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:bg-gray-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Edit Stok */}
            <StokFormModal
                isOpen={activeDialog === "edit"}
                onClose={() => {
                    setActiveDialog(null);
                    setEditingStock(null);
                }}
                stockItem={editingStock}
                onSave={handleSaveStock}
            />

            {/* Dialog Hapus */}
            <Dialog
                open={activeDialog === "remove"}
                onOpenChange={() => {
                    setSelectedItems([]);
                    setActiveDialog(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Hapus{" "}
                            {
                                stockItems.find(
                                    (i) => i.id === selectedItems[0],
                                )?.name
                            }
                            ?
                        </DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan
                            menghapus bahan "
                            {
                                stockItems.find(
                                    (i) => i.id === selectedItems[0],
                                )?.name
                            }
                            " dari manajemen stok.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setActiveDialog(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#D91A20] flex items-center justify-center gap-1 rounded-lg max-md:w-full h-[95%] px-4 py-2 text-white hover:bg-[#b91c1c] transition-all duration-200 cursor-pointer"
                            variant="destructive"
                            onClick={() => handleDelete(selectedItems[0])}
                        >
                            Ya, Hapus bahan ini
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
