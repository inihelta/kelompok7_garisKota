import { useState } from "react";
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
} from "lucide-react";
import { PageProps } from "@/types";
import { MenuItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import MenuFormModal from "@/Components/MenuFormModal";

export default function Dashboard({
    auth,
    menus,
    categories,
}: {
    auth: any;
    menus: MenuItem[];
    categories: any[];
}) {
    const categoryName = ["Semua Menu"].concat(
        categories.map((cat) => cat.name),
    );

    const [activeCategory, setActiveCategory] = useState<string>("Semua Menu");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
    const [activeDialog, setActiveDialog] = useState<
        "create" | "edit" | "remove" | null
    >(null);

    const filteredItems = menus.filter((item) => {
        const matchesCategory =
            activeCategory === "Semua Menu" ||
            item.category_id ===
            categories.find((cat) => cat.name === activeCategory)?.id;
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatIDR = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredItems.map((item) => item.id));
        }
    };

    const toggleSelectItem = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

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

    const getImageSrc = (imagePath?: string) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
            return imagePath;
        }
        return `/storage/${imagePath}`;
    };

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Dashboard">
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
                {/* 1 */}
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <ConciergeBell className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Total Menu</span>
                    <span className="text-xl font-bold -mt-2">
                        {menus.length}
                    </span>
                </div>
                {/* 2 */}
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <MenuSquare className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Kategori</span>
                    <span className="text-xl font-bold -mt-2">
                        {categories.length}
                    </span>
                </div>
                {/* 3 */}
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
                                    className={`px-6 py-2 rounded-full text-[14px] font-semibold cursor-pointer transition-all duration-200 ease-in-out ${isActive
                                            ? "bg-[#fee2e2] text-[#dc2626] border border-transparent"
                                            : "bg-white text-[#4b5563] border border-[#4b5563] hover:bg-[#f3f4f6]"
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
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
                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredItems.length > 0 &&
                                            selectedItems.length ===
                                            filteredItems.length
                                        }
                                        onChange={toggleSelectAll}
                                        className="w-[18px] h-[18px] rounded border border-[#cbd5e1] cursor-pointer accent-[#ef4444]"
                                    />
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
                            {filteredItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(
                                                item.id,
                                            )}
                                            onChange={() =>
                                                toggleSelectItem(item.id)
                                            }
                                            className="w-[18px] h-[18px] rounded border border-[#cbd5e1] cursor-pointer accent-[#ef4444]"
                                        />
                                    </td>
                                    <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155] text-ellipsis overflow-hidden whitespace-nowrap">
                                        {item.image ? (
                                            <img
                                                src={getImageSrc(item.image)}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-[8px] object-cover bg-[#f1f5f9] block"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLElement
                                                    ).style.display = "block";
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
                                                categories.find(
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
                                                    setActiveDialog("remove");
                                                    setSelectedItems([item.id]);
                                                }}
                                            >
                                                <Trash2 className="w-[18px] h-[18px]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Form Modal Tambah / Edit */}
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

                {/* Modal Hapus */}
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
        </AuthenticatedLayout>
    );
}

