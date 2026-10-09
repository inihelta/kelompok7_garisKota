import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { MenuItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface Category {
    id: number;
    name: string;
}

interface MenuFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    menu: MenuItem | null;
    categories: Category[];
}

export default function MenuFormModal({
    isOpen,
    onClose,
    menu,
    categories,
}: MenuFormModalProps) {
    const isEdit = Boolean(menu);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: "",
        category_id: "" as number | string,
        price: "" as number | string,
        stock: 0 as number | string,
        description: "",
        status: "tersedia" as "tersedia" | "draft" | "nonaktif",
        image: null as File | null,
        remove_image: false,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (menu) {
                setData({
                    name: menu.name || "",
                    category_id: menu.category_id || "",
                    price: menu.price || "",
                    stock: menu.stock ?? 0,
                    description: menu.description || "",
                    status: menu.status || "tersedia",
                    image: null,
                    remove_image: false,
                });
                if (menu.image) {
                    const fullImageUrl =
                        menu.image.startsWith("http") || menu.image.startsWith("/")
                             ? menu.image
                            : `/storage/${menu.image}`;
                    setImagePreview(fullImageUrl);
                } else {
                    setImagePreview(null);
                }
            } else {
                setData({
                    name: "",
                    category_id: categories.length > 0 ? categories[0].id : "",
                    price: "",
                    stock: 0,
                    description: "",
                    status: "tersedia",
                    image: null,
                    remove_image: false,
                });
                setImagePreview(null);
            }
        }
    }, [isOpen, menu]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({
                ...prev,
                image: file,
                remove_image: false,
            }));
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    const handleRemoveImage = () => {
        setData((prev) => ({
            ...prev,
            image: null,
            remove_image: true,
        }));
        setImagePreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && menu) {
            post(`/menus/${menu.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post("/menus", {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-xl font-bold text-[#1e293b]">
                        {isEdit ? "Edit Menu" : "Tambah Menu Baru"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[#64748b]">
                        {isEdit
                            ? "Perbarui informasi dan ketersediaan menu."
                            : "Isi data formulir di bawah ini untuk menambahkan menu baru."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-hidden min-h-0 mt-2"
                >
                    {/* Scrollable form body */}
                    <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2 py-1">
                        {/* Nama Menu */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                                Nama Menu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Contoh: Kopi Susu Aren"
                                className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 ${errors.name
                                    ? "border-red-500 focus:border-red-600"
                                    : "border-[#d1d5db] focus:border-[#D91A20]"
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Kategori & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) =>
                                        setData("category_id", Number(e.target.value))
                                    }
                                    className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none bg-white transition-colors duration-200 ${errors.category_id
                                        ? "border-red-500 focus:border-red-600"
                                        : "border-[#d1d5db] focus:border-[#D91A20]"
                                        }`}
                                >
                                    <option value="" disabled>
                                        Pilih Kategori
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData(
                                            "status",
                                            e.target.value as
                                            | "tersedia"
                                            | "draft"
                                            | "nonaktif"
                                        )
                                    }
                                    className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none bg-white transition-colors duration-200 ${errors.status
                                        ? "border-red-500 focus:border-red-600"
                                        : "border-[#d1d5db] focus:border-[#D91A20]"
                                        }`}
                                >
                                    <option value="tersedia">Tersedia</option>
                                    <option value="draft">Draft</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                                {errors.status && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Harga & Stok */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Harga (Rp) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData("price", e.target.value)}
                                    placeholder="Contoh: 25000"
                                    className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 ${errors.price
                                        ? "border-red-500 focus:border-red-600"
                                        : "border-[#d1d5db] focus:border-[#D91A20]"
                                        }`}
                                >
                                </input>
                                {errors.price && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#334155] mb-1">
                                    Stok <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => setData("stock", e.target.value)}
                                    placeholder="Contoh: 50"
                                    className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors duration-200 ${errors.stock
                                        ? "border-red-500 focus:border-red-600"
                                        : "border-[#d1d5db] focus:border-[#D91A20]"
                                        }`}
                                />
                                {errors.stock && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.stock}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Deskripsi singkat mengenai menu..."
                                className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none resize-none transition-colors duration-200 ${errors.description
                                    ? "border-red-500 focus:border-red-600"
                                    : "border-[#d1d5db] focus:border-[#D91A20]"
                                    }`}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Upload Gambar & Live Preview */}
                        <div>
                            <label className="block text-sm font-medium text-[#334155] mb-1">
                                Foto Menu
                            </label>

                            {imagePreview ? (
                                <div className="relative inline-block w-full">
                                    <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center h-44">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                                            title="Hapus / ganti foto"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#D91A20] bg-gray-50 hover:bg-red-50/20 transition-all duration-200">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                                        <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                        <p className="text-xs text-gray-600">
                                            <span className="font-semibold text-[#D91A20]">
                                                Klik untuk upload
                                            </span>{" "}
                                            atau drag & drop
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-1">
                                            PNG, JPG, JPEG, atau WEBP (Maks. 2MB)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}

                            {errors.image && (
                                <p className="text-xs text-red-500 mt-1">{errors.image}</p>
                            )}
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <DialogFooter className="pt-3 mt-3 border-t border-gray-100 flex-shrink-0 gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#D91A20] hover:bg-[#b91c1c] text-white px-5 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                            {processing
                                ? "Menyimpan..."
                                : isEdit
                                    ? "Simpan Perubahan"
                                    : "Tambah Menu"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
