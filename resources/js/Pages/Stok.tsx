import { useState, useEffect } from "react";
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
    Layers,
    Plus,
} from "lucide-react";
import {
    StockItem,
    StockCategoryItem,
    StockCategoryIcon,
    PaginatedData,
} from "@/types/dashboard";
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
import StockCategoryModal from "@/Components/StockCategoryModal";
import Pagination from "@/Components/Pagination";

interface StokPageProps {
    auth: any;
    stockItems?: StockItem[] | PaginatedData<StockItem>;
    categories?: string[];
    categoryList?: StockCategoryItem[];
}

export default function Stok({
    auth,
    stockItems: propStock,
    categories: propCategories,
    categoryList: propCategoryList,
}: StokPageProps) {
    const [categoryList, setCategoryList] = useState<StockCategoryItem[]>(
        propCategoryList && propCategoryList.length > 0
            ? propCategoryList
            : [],
    );

    const [categories, setCategories] = useState<string[]>(
        propCategories && propCategories.length > 0
            ? propCategories
            : ["Semua Kategori"],
    );

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const isPaginated = Boolean(
        propStock &&
        typeof propStock === "object" &&
        "data" in propStock &&
        (propStock as PaginatedData<StockItem>).data.length > 0,
    );
    const paginatedMeta = isPaginated
        ? (propStock as PaginatedData<StockItem>)
        : null;

    const initialItems = paginatedMeta
        ? paginatedMeta.data
        : (propStock as StockItem[]) && (propStock as StockItem[]).length > 0
          ? (propStock as StockItem[])
          : [];

    const [stockItems, setStockItems] = useState<StockItem[]>(initialItems);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeCategory, setActiveCategory] =
        useState<string>("Semua Kategori");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [editingStock, setEditingStock] = useState<StockItem | null>(null);
    const [activeDialog, setActiveDialog] = useState<
        "edit" | "remove" | "create" | null
    >(null);

    const handleAddCategory = (
        name: string,
        icon: StockCategoryIcon = "package",
    ) => {
        const newId =
            categoryList.length > 0
                ? Math.max(...categoryList.map((c) => c.id)) + 1
                : 1;
        const newCat: StockCategoryItem = { id: newId, name, icon };
        setCategoryList((prev) => [...prev, newCat]);
        setCategories((prev) => (prev.includes(name) ? prev : [...prev, name]));

        router.post(
            "/stock-categories",
            { name, icon },
            {
                preserveScroll: true,
                onError: () => {},
            },
        );
    };

    const handleUpdateCategory = (
        id: number,
        name: string,
        icon: StockCategoryIcon = "package",
    ) => {
        const oldCat = categoryList.find((c) => c.id === id);
        const oldName = oldCat?.name;

        setCategoryList((prev) =>
            prev.map((c) => (c.id === id ? { ...c, name, icon } : c)),
        );

        if (oldName) {
            setCategories((prev) =>
                prev.map((c) => (c === oldName ? name : c)),
            );
            if (activeCategory === oldName) {
                setActiveCategory(name);
            }
            setStockItems((prev) =>
                prev.map((item) =>
                    item.category === oldName
                        ? { ...item, category: name, icon_type: icon }
                        : item,
                ),
            );
        }

        router.put(
            `/stock-categories/${id}`,
            { name, icon },
            {
                preserveScroll: true,
                onError: () => {},
            },
        );
    };

    const handleDeleteCategory = (id: number) => {
        const cat = categoryList.find((c) => c.id === id);
        const catName = cat?.name;

        setCategoryList((prev) => prev.filter((c) => c.id !== id));
        if (catName) {
            setCategories((prev) => prev.filter((c) => c !== catName));
            if (activeCategory === catName) {
                setActiveCategory("Semua Kategori");
            }
        }

        router.delete(`/stock-categories/${id}`, {
            preserveScroll: true,
            onError: () => {},
        });
    };

    const getCategoryIcon = (categoryName: string) => {
        const cat = categoryList.find(
            (c) =>
                c.name === categoryName ||
                (c.name === "Biji Kopi & Bubuk" &&
                    categoryName.includes("Biji Kopi")),
        );
        return cat?.icon || "package";
    };

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeCategory]);

    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDisplayItems = isPaginated
        ? filteredItems
        : filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const needRestockCount = stockItems.filter(
        (i) => i.status === "Menipis" || i.stock <= i.min_stock,
    ).length;

    const renderItemIcon = (type?: string) => {
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
        return `~${est} ${unitLabel}/hari`;
    };

    const handleSaveStock = (data: {
        id?: number;
        stock_category_id: number;
        name: string;
        sku: string;
        category: string;
        stock: number;
        unit: string;
        min_stock: number;
        est_daily: number;
    }) => {
        const status = data.stock <= data.min_stock ? "Menipis" : "Aman";

        if (data.id) {
            setStockItems((prev) =>
                prev.map((item) => {
                    if (item.id === data.id) {
                        return {
                            ...item,
                            stock_category_id: data.stock_category_id,
                            name: data.name,
                            sku: data.sku,
                            category: data.category,
                            stock: data.stock,
                            unit: data.unit,
                            min_stock: data.min_stock,
                            est_daily: data.est_daily,
                            status,
                        };
                    }
                    return item;
                }),
            );
            router.put(
                `/stocks/${data.id}`,
                {
                    stock_category_id: data.stock_category_id,
                    name: data.name,
                    sku: data.sku,
                    stock: data.stock,
                    unit: data.unit,
                    min_stock: data.min_stock,
                    est_daily: data.est_daily,
                },
                {
                    preserveScroll: true,
                    onError: () => {},
                },
            );
        } else {
            const newId =
                stockItems.length > 0
                    ? Math.max(...stockItems.map((i) => i.id)) + 1
                    : 1;
            const newItem: StockItem = {
                id: newId,
                stock_category_id: data.stock_category_id,
                name: data.name,
                sku: data.sku,
                category: data.category,
                stock: data.stock,
                unit: data.unit,
                min_stock: data.min_stock,
                est_daily: data.est_daily,
                status,
            };
            setStockItems((prev) => [newItem, ...prev]);

            router.post(
                "/stocks",
                {
                    stock_category_id: data.stock_category_id,
                    name: data.name,
                    sku: data.sku,
                    stock: data.stock,
                    unit: data.unit,
                    min_stock: data.min_stock,
                    est_daily: data.est_daily,
                },
                {
                    preserveScroll: true,
                    onError: () => {},
                },
            );
        }

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
                <div className="flex items-center gap-2 max-md:w-full flex-wrap">
                    <button
                        type="button"
                        onClick={() => {
                            setEditingStock(null);
                            setActiveDialog("create");
                        }}
                        className="bg-[#D91A20] hover:bg-[#b91c1c] cursor-pointer flex items-center justify-center gap-1.5 rounded-lg max-md:w-full px-4 py-2 text-white transition-all duration-200 text-sm font-medium shadow-xs"
                    >
                        <Plus className="size-5" />
                        Tambah Bahan
                    </button>
                </div>
            </div>

            <div className="flex justify-between pb-3 gap-3 items-center">
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <Archive className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Total Item Bahan</span>
                    <span className="text-xl font-bold -mt-2">
                        {stockItems.length > 0 ? 325 : 0}
                    </span>
                </div>
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

            <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex gap-2 flex-wrap items-center pb-1">
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
                    <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className={`px-4 py-2 rounded-full text-[14px] font-semibold cursor-pointer transition-all duration-200 ease-in-out bg-white text-[#4b5563] border border-[#4b5563]/50 hover:bg-[#f3f4f6] flex items-center justify-center"
                        }`}
                        title="Atur Kategori"
                    >
                        <Layers className="size-5" />
                    </button>
                </div>

                <div className="relative flex items-center w-full">
                    <Search className="absolute left-[15px] w-[18px] h-[18px] text-[#9ca3af] pointer-events-none block" />
                    <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari bahan, SKU, atau kategori..."
                        className="w-full h-[38px] pl-[40px] pr-[15px] rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c] transition-colors duration-200"
                    />
                </div>

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
                                paginatedDisplayItems.map((item, i) => {
                                    const actualIndex =
                                        isPaginated && paginatedMeta?.from
                                            ? paginatedMeta.from + i
                                            : startIndex + i + 1;
                                    return (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]/50">
                                                {actualIndex}
                                            </td>
                                            <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-[8px] bg-[#fee2e2] flex items-center justify-center flex-shrink-0">
                                                        {renderItemIcon(
                                                            item.icon_type ||
                                                                getCategoryIcon(
                                                                    item.category,
                                                                ),
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span
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
                                                        item.status ===
                                                        "Menipis"
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
                                                    item.unit,
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
                                                            setEditingStock(
                                                                item,
                                                            );
                                                            setActiveDialog(
                                                                "edit",
                                                            );
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
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    links={paginatedMeta?.links}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    from={
                        isPaginated
                            ? paginatedMeta?.from
                            : filteredItems.length > 0
                              ? startIndex + 1
                              : 0
                    }
                    to={
                        isPaginated
                            ? paginatedMeta?.to
                            : Math.min(
                                  startIndex + itemsPerPage,
                                  filteredItems.length,
                              )
                    }
                    total={
                        isPaginated
                            ? paginatedMeta?.total
                            : filteredItems.length
                    }
                    itemName="bahan"
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            <StokFormModal
                isOpen={activeDialog === "create" || activeDialog === "edit"}
                onClose={() => {
                    setActiveDialog(null);
                    setEditingStock(null);
                }}
                stockItem={editingStock}
                categories={categoryList}
                onSave={handleSaveStock}
            />

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

            <StockCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                categories={categoryList}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
            />
        </AuthenticatedLayout>
    );
}
