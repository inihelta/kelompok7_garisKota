import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Search, Pencil, Trash2, Plus, MenuSquare } from "lucide-react";
import { CategoryItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import KategoriFormModal from "@/Components/KategoriFormModal";
import Pagination from "@/Components/Pagination";

interface KategoriPageProps {
    auth: any;
    categories?: CategoryItem[];
}

const initialCategories: CategoryItem[] = [
    { id: 1, name: "Makanan" },
    { id: 2, name: "Minuman" },
    { id: 3, name: "Snack" },
];

export default function Kategori({
    auth,
    categories: propCategories,
}: KategoriPageProps) {
    const [categories, setCategories] = useState<CategoryItem[]>(
        propCategories && propCategories.length > 0
            ? propCategories
            : initialCategories,
    );
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(
        null,
    );
    const [activeDialog, setActiveDialog] = useState<
        "create" | "edit" | "remove" | null
    >(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredItems = categories.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

    const handleSaveCategory = (data: { id?: number; name: string }) => {
        if (data.id) {
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === data.id ? { ...c, name: data.name } : c,
                ),
            );
        } else {
            const newId =
                categories.length > 0
                    ? Math.max(...categories.map((c) => c.id)) + 1
                    : 1;
            const newCat: CategoryItem = {
                id: newId,
                name: data.name,
            };
            setCategories((prev) => [newCat, ...prev]);
        }
        setActiveDialog(null);
        setEditingCategory(null);
    };

    const handleDelete = (id: number) => {
        setCategories((prev) => prev.filter((item) => item.id !== id));
        setSelectedItems([]);
        setActiveDialog(null);
    };

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Kategori">
            <Head title="Kategori" />

            <div className="flex justify-between pb-3 flex-wrap gap-3 items-center">
                <div className="flex gap-3 my-2">
                    <div className="p-2.5 aspect-square rounded-xl border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <MenuSquare className="size-6 max-md:size-8" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">Kategori</h2>
                        <span className="text-[14px] text-[#475569] block -mt-1">
                            Kelola daftar kategori menu restoran.
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setEditingCategory(null);
                        setActiveDialog("create");
                    }}
                    className="bg-[#D91A20] hover:bg-[#b91c1c] cursor-pointer flex items-center justify-center gap-1 rounded-lg max-md:w-full h-[95%] px-4 py-2 text-white transition-all duration-200"
                >
                    <Plus className="size-6 max-md:size-8" />
                    Tambah Kategori
                </button>
            </div>

            <div className="flex justify-between pb-3 gap-3 items-center">
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <MenuSquare className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Total Kategori</span>
                    <span className="text-xl font-bold -mt-2">
                        {categories.length}
                    </span>
                </div>
            </div>

            <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center pb-3 flex-wrap gap-3">
                    <div className="relative flex items-center w-[20rem] max-md:w-full max-w-full">
                        <Search className="absolute left-[15px] w-[18px] h-[18px] text-[#9ca3af] pointer-events-none block" />
                        <input
                            type="text"
                            id="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari kategori..."
                            className="w-full h-[38px] pl-[40px] pr-[15px] rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c] transition-colors duration-200"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] w-[60px]">
                                    #
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Nama Kategori
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
                                        colSpan={3}
                                        className="text-center py-8 text-gray-400 text-[14px]"
                                    >
                                        Tidak ada kategori ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((item, i) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]/50">
                                            {startIndex + i + 1}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <span className="font-semibold text-[#1e293b]">
                                                {item.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className="w-9 h-9 rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer flex items-center justify-center text-[#475569] transition-all duration-200 hover:bg-[#f1f5f9]"
                                                    title="Edit"
                                                    onClick={() => {
                                                        setEditingCategory(
                                                            item,
                                                        );
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
                    itemName="kategori"
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            <KategoriFormModal
                isOpen={activeDialog === "create" || activeDialog === "edit"}
                onClose={() => {
                    setActiveDialog(null);
                    setEditingCategory(null);
                }}
                category={editingCategory}
                onSave={handleSaveCategory}
            />

            {/* Dialog Hapus Kategori */}
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
                                categories.find(
                                    (i) => i.id === selectedItems[0],
                                )?.name
                            }
                            ?
                        </DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan
                            menghapus kategori "
                            {
                                categories.find(
                                    (i) => i.id === selectedItems[0],
                                )?.name
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
                            Ya, Hapus kategori ini
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
