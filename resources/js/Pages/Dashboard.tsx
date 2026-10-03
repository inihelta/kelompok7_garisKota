import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { PageProps } from '@/types';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    category: 'Makanan' | 'Minuman' | 'Snack';
    price: string;
    stock: number;
    status: 'Tersedia' | 'Habis';
    image: string;
}

const initialMenuItems: MenuItem[] = [
    {
        id: 1,
        name: 'Mix Platter',
        description: 'Kentang, nugget, ayam, sosis',
        category: 'Makanan',
        price: 'Rp 45.000',
        stock: 12,
        status: 'Tersedia',
        image: 'path_gambar_mix_platter.jpg',
    },
    {
        id: 2,
        name: 'Kentang Goreng',
        description: 'Kentang crispy',
        category: 'Snack',
        price: 'Rp 18.000',
        stock: 28,
        status: 'Tersedia',
        image: 'path_gambar_kentang.jpg',
    },
    {
        id: 3,
        name: 'Hazelnut Latte',
        description: 'Hazelnut Latte dingin',
        category: 'Minuman',
        price: 'Rp 22.000',
        stock: 15,
        status: 'Tersedia',
        image: 'path_gambar_hazelnut.jpg',
    },
    {
        id: 4,
        name: 'Pisang Gapit',
        description: 'Pisang gapit',
        category: 'Makanan',
        price: 'Rp 12.000',
        stock: 18,
        status: 'Habis',
        image: 'path_gambar_pisang.jpg',
    },
];

export default function Dashboard({ auth }: PageProps) {
    const [activeCategory, setActiveCategory] = useState<string>('Semua Menu');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const categories = ['Semua Menu', 'Makanan', 'Minuman', 'Snack'];

    const filteredItems = initialMenuItems.filter((item) => {
        const matchesCategory =
            activeCategory === 'Semua Menu' || item.category === activeCategory;
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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

    const getCategoryBadgeClass = (category: MenuItem['category']) => {
        switch (category) {
            case 'Makanan':
                return 'bg-[#fee2e2] text-[#ef4444]';
            case 'Minuman':
                return 'bg-[#dbeafe] text-[#2563eb]';
            case 'Snack':
                return 'bg-[#ffedd5] text-[#ea580c]';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusBadgeClass = (status: MenuItem['status']) => {
        return status === 'Tersedia'
            ? 'bg-[#dcfce7] text-[#16a34a]'
            : 'bg-[#fee2e2] text-[#ef4444]';
    };

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Dashboard">
            <Head title="Dashboard" />

            <div className="border border-[#e5e7eb] rounded-[8px] p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center pb-3 flex-wrap gap-3">
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-full text-[14px] font-semibold cursor-pointer transition-all duration-200 ease-in-out ${
                                        isActive
                                            ? 'bg-[#fee2e2] text-[#dc2626] border border-transparent'
                                            : 'bg-white text-[#4b5563] border border-[#4b5563] hover:bg-[#f3f4f6]'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative flex items-center w-[20rem] max-w-full">
                        <Search className="absolute left-[15px] w-[18px] h-[18px] text-[#9ca3af] pointer-events-none block" />
                        <input
                            type="text"
                            id="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari menu, kategori, atau kode..."
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
                                            selectedItems.length === filteredItems.length
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
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => toggleSelectItem(item.id)}
                                            className="w-[18px] h-[18px] rounded border border-[#cbd5e1] cursor-pointer accent-[#ef4444]"
                                        />
                                    </td>
                                    <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-[8px] object-cover bg-[#f1f5f9] block"
                                            onError={(e) => {
                                                // Fallback gracefully if placeholder image not found
                                                (e.target as HTMLElement).style.display = 'block';
                                            }}
                                        />
                                    </td>
                                    <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
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
                                            className={`px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center ${getCategoryBadgeClass(
                                                item.category
                                            )}`}
                                        >
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                        {item.price}
                                    </td>
                                    <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                        {item.stock}
                                    </td>
                                    <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                        <span
                                            className={`px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center ${getStatusBadgeClass(
                                                item.status
                                            )}`}
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
                                            >
                                                <Pencil className="w-[18px] h-[18px]" />
                                            </button>
                                            <button
                                                type="button"
                                                className="w-9 h-9 rounded-[8px] border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]"
                                                title="Hapus"
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
            </div>
        </AuthenticatedLayout>
    );
}
