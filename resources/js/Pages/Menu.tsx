import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Search,
    Pencil,
    Trash2,
    Utensils,
    Plus,
    ConciergeBell,
    ToggleRight,
    MenuSquare,
    Layers,
} from "lucide-react";
import { CategoryItem, MenuItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import MenuFormModal from "@/Components/MenuFormModal";
import Pagination from "@/Components/Pagination";
import MenuCategoryModal from "@/Components/MenuCategoryModal";

export default function Menu({
    auth,
    menus,
    categories,
}: {
    auth: any;
    menus: MenuItem[];
    categories: CategoryItem[];
}) {
    const [categoryList, setCategoryList] = useState<CategoryItem[]>(
        categories,
    );
    const categoryName = ["Semua Menu"].concat(
        categoryList.map((cat) => cat.name),
    );

    const [activeCategory, setActiveCategory] = useState<string>("Semua Menu");
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
    const [activeDialog, setActiveDialog] = useState<
        "create" | "edit" | "remove" | null
    >(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredItems = menus.filter((item) => {
        const matchesCategory =
            activeCategory === "Semua Menu" ||
            item.category_id ===
                categoryList.find((cat) => cat.name === activeCategory)?.id;
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeCategory]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    const formatIDR = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const getCategoryBadgeClass = (category_id: MenuItem["category_id"]) => {
        switch (category_id) {
            case 1:
                return "bg-[#fee2e2] text-[#ef4444]";
            case 2:
                return "bg-[#dbeafe] text-[#2563eb]";
            case 3:
                return "bg-[#ffedd5] text-[#ea580c]";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusBadgeClass = (status: MenuItem["status"]) => {
        switch (status) {
            case "tersedia":
                return "bg-[#dcfce7] text-[#16a34a]";
            case "draft":
                return "bg-[#fef3c7] text-[#d97706]";
            case "nonaktif":
                return "bg-[#fee2e2] text-[#ef4444]";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/menus/${id}`, {
            onSuccess: () => {
                setSelectedItems([]);
                setActiveDialog(null);
            },
        });
    };

    const handleAddCategory = (name: string) => {
        const newId =
            categoryList.length > 0
                ? Math.max(...categoryList.map((c) => c.id)) + 1
                : 1;
        const newCat: CategoryItem = { id: newId, name };
        setCategoryList((prev) => [...prev, newCat]);

        router.post(
            "/categories",
            { name },
            {
                preserveScroll: true,
                onError: () => {},
            },
        );
    };

    const handleUpdateCategory = (id: number, name: string) => {
        const oldCat = categoryList.find((c) => c.id === id);
        const oldName = oldCat?.name;

        setCategoryList((prev) =>
            prev.map((c) => (c.id === id ? { ...c, name } : c)),
        );

        if (oldName && activeCategory === oldName) {
            setActiveCategory(name);
        }

        router.put(
            `/categories/${id}`,
            { name },
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
        if (catName && activeCategory === catName) {
            setActiveCategory("Semua Menu");
        }

        router.delete(`/categories/${id}`, {
            preserveScroll: true,
            onError: () => {},
        });
    };

    const getImageSrc = (imagePath?: string) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
            return imagePath;
        }
        return `/storage/${imagePath}`;
    };

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Menu">
            <Head title="Dashboard" />

            <div className="flex justify-between pb-3 flex-wrap gap-3 items-center">
                <div className="flex gap-3 my-2">
                    <div className="p-2.5 aspect-square rounded-xl border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <Utensils className="size-6 max-md:size-8" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">Menu</h2>
                        <span className="text-[14px] text-[#475569] block -mt-1">
                            Kelola daftar menu, kategori, harga, dan
                            ketersediaan produk.
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setEditingMenu(null);
                        setActiveDialog("create");
                    }}
                    className="bg-[#D91A20] hover:bg-[#b91c1c] cursor-pointer flex items-center justify-center gap-1 rounded-lg max-md:w-full h-[95%] px-4 py-2 text-white transition-all duration-200"
                >
                    <Plus className="size-6 max-md:size-8" />
                    Tambah Menu
                </button>
            </div>

            <div className="flex justify-between pb-3 gap-3 items-center">
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <ConciergeBell className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Total Menu</span>
                    <span className="text-xl font-bold -mt-2">
                        {menus.length}
                    </span>
                </div>
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <MenuSquare className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Kategori</span>
                    <span className="text-xl font-bold -mt-2">
                        {categories.length}
                    </span>
                </div>
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <ToggleRight className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Menu Tersedia</span>
                    <span className="text-xl font-bold -mt-2">
                        {menus.filter((m) => m.status === "tersedia").length}
                    </span>
                </div>
            </div>

            <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center pb-3 flex-wrap gap-3">
                    <div className="flex gap-2 flex-wrap">
                        {categoryName.map((cat) => {
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
                            className={`px-4 py-2 rounded-full text-[14px] font-semibold cursor-pointer transition-all duration-200 ease-in-out bg-white text-[#4b5563] border border-[#4b5563]/50 hover:bg-[#f3f4f6] flex items-center justify-center`}
                            title="Atur Kategori"
                        >
                            <Layers className="size-5" />
                        </button>
                    </div>

                    <div className="relative flex items-center w-[20rem] max-md:w-full max-w-full">
                        <Search className="absolute left-[15px] w-[18px] h-[18px] text-[#9ca3af] pointer-events-none block" />
                        <input
                            type="text"
                            id="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari menu atau deskripsi..."
                            className="w-full h-[38px] pl-[40px] pr-[15px] rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c] transition-colors duration-200"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] w-[40px]">
                                    #
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] w-[80px]">
                                    Gambar
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Nama Menu
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Kategori
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Harga
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Stok
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Status
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
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
                                        Tidak ada menu ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((item, i) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]/50">
                                            {startIndex + i + 1}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155] text-ellipsis overflow-hidden whitespace-nowrap">
                                            {item.image ? (
                                                <img
                                                    src={getImageSrc(
                                                        item.image,
                                                    )}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-[8px] object-contain bg-[#f1f5f9] block"
                                                    onError={(e) => {
                                                        (
                                                            e.target as HTMLElement
                                                        ).style.display =
                                                            "block";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-[8px] bg-[#f1f5f9] flex items-center justify-center text-xs text-gray-400 font-medium">
                                                    No Img
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155] text-ellipsis overflow-hidden whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[#1e293b] mb-1">
                                                    {item.name}
                                                </span>
                                                <span className="text-[13px] text-[#94a3b8]">
                                                    {item.description}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-[12px] min-w-[5rem] font-semibold inline-block text-center ${getCategoryBadgeClass(
                                                    item.category_id,
                                                )}`}
                                            >
                                                {
                                                    categoryList.find(
                                                        (cat) =>
                                                            cat.id ===
                                                            item.category_id,
                                                    )?.name
                                                }
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            {formatIDR(Number(item.price))}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            {item.stock}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-[12px] min-w-[5rem] font-semibold inline-block text-center ${getStatusBadgeClass(
                                                    item.status,
                                                )}`}
                                            >
                                                {item.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    item.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className="w-9 h-9 rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer flex items-center justify-center text-[#475569] transition-all duration-200 hover:bg-[#f1f5f9]"
                                                    title="Edit"
                                                    onClick={() => {
                                                        setEditingMenu(item);
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

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    from={filteredItems.length > 0 ? startIndex + 1 : 0}
                    to={Math.min(
                        startIndex + itemsPerPage,
                        filteredItems.length,
                    )}
                    total={filteredItems.length}
                    itemName="menu"
                    onPageChange={(page) => setCurrentPage(page)}
                />

                {/* Edit/Create Dialog */}
                <MenuFormModal
                    isOpen={
                        activeDialog === "create" || activeDialog === "edit"
                    }
                    onClose={() => {
                        setActiveDialog(null);
                        setEditingMenu(null);
                    }}
                    menu={activeDialog === "edit" ? editingMenu : null}
                    categories={categories}
                />

                {/* Delete Dialog */}
                <Dialog
                    open={activeDialog === "remove"}
                    onOpenChange={(open) =>
                        setActiveDialog(open ? "remove" : null)
                    }
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Hapus{" "}
                                {
                                    menus.find((i) => i.id === selectedItems[0])
                                        ?.name
                                }
                                ?
                            </DialogTitle>
                            <DialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Ini akan
                                menghapus menu "
                                {
                                    menus.find((i) => i.id === selectedItems[0])
                                        ?.name
                                }
                                " selamanya.
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
                                Ya, Hapus menu ini
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <MenuCategoryModal
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
