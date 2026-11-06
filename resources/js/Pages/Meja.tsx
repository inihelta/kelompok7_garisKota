import { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Search,
    Pencil,
    Trash2,
    Plus,
    Users,
    CheckCircle2,
    Clock,
    LucideProps,
} from "lucide-react";
import { TableItem } from "@/types/dashboard";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import MejaFormModal from "@/Components/MejaFormModal";

const TableIcon = ({
    color = "currentColor",
    size = 24,
    className = "",
    ...props
}: LucideProps) => (
    <svg
        width={size}
        height={(Number(size) * 27) / 34}
        viewBox="0 0 34 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lucide ${className}`}
        {...props}
    >
        <path
            d="M33.2636 9.55L30.8802 1.21667C30.7833 0.86681 30.5743 0.558384 30.2853 0.338636C29.9963 0.118888 29.6433 -6.45253e-05 29.2802 2.62585e-08H4.04689C3.29689 2.62585e-08 2.64689 0.5 2.44689 1.21667L0.06356 9.55C-0.23644 10.6 0.56356 11.6667 1.66356 11.6667H5.33023L3.33023 26.6667H6.66356L7.78023 18.3333H25.5636L26.6636 26.6667H29.9969L27.9969 11.6667H31.6636C32.7636 11.6667 33.5636 10.6 33.2636 9.55ZM8.21356 15L8.66356 11.6667H24.6636L25.1136 15H8.21356ZM3.88023 8.33333L5.31356 3.33333H28.0302L29.4636 8.33333H3.88023Z"
            fill={color}
        />
    </svg>
);

const initialTables: TableItem[] = [
    {
        id: 1,
        table_number: 1,
        capacity: 2,
        available: true,
        location: "indoor",
    },
    {
        id: 2,
        table_number: 2,
        capacity: 4,
        available: true,
        location: "indoor",
    },
    {
        id: 3,
        table_number: 3,
        capacity: 4,
        available: false,
        location: "indoor",
    },
    {
        id: 4,
        table_number: 4,
        capacity: 6,
        available: true,
        location: "indoor",
    },
    {
        id: 5,
        table_number: 5,
        capacity: 2,
        available: true,
        location: "indoor",
    },
    {
        id: 6,
        table_number: 6,
        capacity: 4,
        available: true,
        location: "outdoor",
    },
    {
        id: 7,
        table_number: 7,
        capacity: 4,
        available: false,
        location: "outdoor",
    },
    {
        id: 8,
        table_number: 8,
        capacity: 6,
        available: true,
        location: "outdoor",
    },
    {
        id: 9,
        table_number: 9,
        capacity: 8,
        available: true,
        location: "outdoor",
    },
    {
        id: 10,
        table_number: 10,
        capacity: 2,
        available: true,
        location: "outdoor",
    },
];

export default function Meja({
    auth,
    tables: propTables,
}: {
    auth?: any;
    tables?: TableItem[];
}) {
    const [tables, setTables] = useState<TableItem[]>(initialTables);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [editingMeja, setEditingMeja] = useState<TableItem | null>(null);
    const [activeDialog, setActiveDialog] = useState<
        "create" | "edit" | "remove" | null
    >(null);

    const filteredTables = tables.filter((item) => {
        const matchesSearch =
            item.table_number.toString().includes(searchQuery) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const getAreaBadgeClass = (area: TableItem["location"]) => {
        switch (area) {
            case "indoor":
                return "bg-[#dbeafe] text-[#2563eb]";
            case "outdoor":
                return "bg-[#ffedd5] text-[#ea580c]";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusBadgeClass = (status: TableItem["available"]) => {
        switch (status) {
            case true:
                return "bg-[#dcfce7] text-[#16a34a]";
            case false:
                return "bg-[#fee2e2] text-[#ef4444]";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleSaveMeja = (data: Omit<TableItem, "id"> & { id?: number }) => {
        if (data.id) {
            // Edit existing
            setTables((prev) =>
                prev.map((t) =>
                    t.id === data.id ? ({ ...t, ...data } as TableItem) : t,
                ),
            );
        } else {
            // Create new
            const newId =
                tables.length > 0
                    ? Math.max(...tables.map((t) => t.id)) + 1
                    : 1;
            const newTable: TableItem = {
                id: newId,
                table_number: data.table_number,
                capacity: data.capacity,
                available: data.available,
                location: data.location,
            };
            setTables((prev) => [newTable, ...prev]);
        }
        setActiveDialog(null);
        setEditingMeja(null);
    };

    const handleDelete = (id: number) => {
        setTables((prev) => prev.filter((item) => item.id !== id));
        setSelectedTableId(null);
        setActiveDialog(null);
    };

    const selectedTable = tables.find((t) => t.id === selectedTableId);

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Meja">
            <Head title="Meja" />

            {/* Header */}
            <div className="flex justify-between pb-3 flex-wrap gap-3 items-center">
                <div className="flex gap-3 my-2">
                    <div className="p-2.5 aspect-square rounded-xl border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <TableIcon size={24} color="#ef4444" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">Meja</h2>
                        <span className="text-[14px] text-[#475569] block -mt-1">
                            Kelola nomor meja, kapasitas, area, dan ketersediaan
                            meja.
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setEditingMeja(null);
                        setActiveDialog("create");
                    }}
                    className="bg-[#D91A20] hover:bg-[#b91c1c] cursor-pointer flex items-center justify-center gap-1 rounded-lg max-md:w-full h-[95%] px-4 py-2 text-white transition-all duration-200"
                >
                    <Plus className="size-6 max-md:size-8" />
                    Tambah Meja
                </button>
            </div>

            {/* Top Metric Cards */}
            <div className="flex justify-between pb-3 gap-3 items-center">
                {/* 1 */}
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <TableIcon size={20} color="#ef4444" />
                    </div>
                    <span className="text-sm">Total Meja</span>
                    <span className="text-xl font-bold -mt-2">
                        {tables.length}
                    </span>
                </div>
                {/* 2 */}
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <CheckCircle2 className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Meja Tersedia</span>
                    <span className="text-xl font-bold -mt-2">
                        {tables.filter((t) => t.available === true).length}
                    </span>
                </div>
                {/* 3 */}
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <Clock className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Meja Terisi</span>
                    <span className="text-xl font-bold -mt-2">
                        {tables.filter((t) => t.available === false).length}
                    </span>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-3">
                {/* Filter & Search Bar */}
                <div className="flex justify-between items-center pb-3 flex-wrap gap-3">
                    {/* <div className="flex gap-2 flex-wrap">
                        {areaTabs.map((area) => {
                            const isActive = activeArea === area;
                            return (
                                <button
                                    key={area}
                                    type="button"
                                    onClick={() => setActiveArea(area)}
                                    className={`px-6 py-2 rounded-full text-[14px] font-semibold cursor-pointer transition-all duration-200 ease-in-out ${
                                        isActive
                                            ? "bg-[#fee2e2] text-[#dc2626] border border-transparent"
                                            : "bg-white text-[#4b5563] border border-[#4b5563] hover:bg-[#f3f4f6]"
                                    }`}
                                >
                                    {area}
                                </button>
                            );
                        })}
                    </div> */}

                    <div className="relative flex items-center w-[20rem] max-md:w-full max-w-full">
                        <Search className="absolute left-[15px] w-[18px] h-[18px] text-[#9ca3af] pointer-events-none block" />
                        <input
                            type="text"
                            id="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nomor meja atau catatan..."
                            className="w-full h-[38px] pl-[40px] pr-[15px] rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c] transition-colors duration-200"
                        />
                    </div>
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
                                    Nomor Meja
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Area / Lokasi
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Kapasitas
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Status
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                    Pesanan
                                </th>
                                <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] w-[110px]">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTables.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-8 text-[#94a3b8] text-sm"
                                    >
                                        Tidak ada data meja yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredTables.map((item, i) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]/50">
                                            {i + 1}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <span className="font-semibold tabular-nums text-[#1e293b]">
                                                M-
                                                {item.table_number < 10
                                                    ? `0${item.table_number}`
                                                    : `${item.table_number}`}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-[12px] min-w-[5rem] font-semibold inline-block text-center ${getAreaBadgeClass(
                                                    item.location,
                                                )}`}
                                            >
                                                {item.location
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    item.location.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                                                <Users className="size-4 text-[#94a3b8]" />
                                                <span>
                                                    {item.capacity} Orang
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-[12px] min-w-[5rem] font-semibold inline-block text-center ${getStatusBadgeClass(
                                                    item.available,
                                                )}`}
                                            >
                                                {item.available
                                                    ? "Tersedia"
                                                    : "Terisi"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-[12px] min-w-[5rem] font-semibold inline-block text-center`}
                                            ></span>
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className="w-9 h-9 rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer flex items-center justify-center text-[#475569] transition-all duration-200 hover:bg-[#f1f5f9]"
                                                    title="Edit"
                                                    onClick={() => {
                                                        setEditingMeja(item);
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
                                                        setSelectedTableId(
                                                            item.id,
                                                        );
                                                        setActiveDialog(
                                                            "remove",
                                                        );
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

                {/* Edit/Create Dialog Modal */}
                <MejaFormModal
                    isOpen={
                        activeDialog === "create" || activeDialog === "edit"
                    }
                    onClose={() => {
                        setActiveDialog(null);
                        setEditingMeja(null);
                    }}
                    meja={activeDialog === "edit" ? editingMeja : null}
                    onSave={handleSaveMeja}
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
                                Hapus {selectedTable?.table_number}?
                            </DialogTitle>
                            <DialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Ini akan
                                menghapus data "{selectedTable?.table_number}"
                                selamanya.
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
                                onClick={() => {
                                    if (selectedTableId !== null) {
                                        handleDelete(selectedTableId);
                                    }
                                }}
                            >
                                Ya, Hapus meja ini
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
