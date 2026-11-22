import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "sonner";
import {
    Search,
    Pencil,
    Trash2,
    Plus,
    Users,
    CheckCircle2,
    Clock,
    LucideProps,
    QrCode,
    Download,
    Eye,
    Printer,
    Copy,
    Check,
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
import Pagination from "@/Components/Pagination";
import { QRCodeSVG } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateTableToken, getTableOrderUrl } from "@/lib/utils";

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

export default function Meja({
    auth,
    tables: propTables,
}: {
    auth?: PageProps["auth"];
    tables?: TableItem[];
}) {
    const [tables, setTables] = useState<TableItem[]>(
        propTables && propTables.length > 0 ? propTables : [],
    );
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [editingMeja, setEditingMeja] = useState<TableItem | null>(null);
    const [activeDialog, setActiveDialog] = useState<
        "create" | "edit" | "remove" | "qr" | null
    >(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        if (propTables) {
            setTables(propTables);
        }
    }, [propTables]);

    const filteredTables = tables.filter((item) => {
        const matchesSearch =
            item.table_number.toString().includes(searchQuery) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.active_order &&
                `pesanan #${item.active_order.id}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredTables.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTables = filteredTables.slice(
        startIndex,
        startIndex + itemsPerPage,
    );

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

    // Generate table order URL
    const getTableUrl = (table: TableItem) => {
        return getTableOrderUrl(table.id);
    };

    const handleSaveMeja = (data: Omit<TableItem, "id"> & { id?: number; order_action?: "complete" | "cancel" }) => {
        const payload = {
            table_number: Number(data.table_number),
            capacity: Number(data.capacity),
            available: Boolean(data.available),
            location: data.location,
            ...(data.order_action ? { order_action: data.order_action } : {}),
        };

        if (data.id) {
            router.put(`/tables/${data.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data meja berhasil diperbarui");
                    setActiveDialog(null);
                    setEditingMeja(null);
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0] as string;
                    toast.error(firstError || "Gagal memperbarui meja");
                },
            });
        } else {
            router.post("/tables", payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Meja baru berhasil ditambahkan");
                    setActiveDialog(null);
                    setEditingMeja(null);
                },
                onError: (errors) => {
                    const firstError = Object.values(errors)[0] as string;
                    toast.error(firstError || "Gagal menambahkan meja");
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/tables/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Meja berhasil dihapus");
                setSelectedTableId(null);
                setActiveDialog(null);
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0] as string;
                toast.error(firstError || "Gagal menghapus meja");
            },
        });
    };

    const openQrModal = (table: TableItem) => {
        setSelectedTableId(table.id);
        setActiveDialog("qr");
    };

    // Export all QR codes as ZIP
    const handleExportAllQr = async () => {
        if (tables.length === 0) {
            toast.error("Tidak ada meja untuk diekspor");
            return;
        }

        try {
            const zip = new JSZip();
            const qrFolder = zip.folder("qr-codes-meja");

            if (!qrFolder) {
                toast.error("Gagal membuat folder ZIP");
                return;
            }

            for (const table of tables) {
                const url = getTableOrderUrl(table.id);
                
                // Generate QR code as data URL using canvas
                const canvas = document.createElement("canvas");
                const qrSize = 300;
                canvas.width = qrSize;
                canvas.height = qrSize;
                const ctx = canvas.getContext("2d");
                if (!ctx) continue;

                // Use QRCode.react to render to canvas
                // We'll use a simpler approach - generate via API or use the QRCode library
                const qrDataUrl = await generateQrDataUrl(url, qrSize);
                if (qrDataUrl) {
                    const base64Data = qrDataUrl.split(",")[1];
                    qrFolder.file(`Meja-${table.table_number}.png`, base64Data, { base64: true });
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `qr-codes-meja-${new Date().toISOString().split("T")[0]}.zip`);
            toast.success(`${tables.length} QR code meja berhasil diekspor`);
        } catch (error) {
            console.error("Export QR error:", error);
            toast.error("Gagal mengekspor QR code");
        }
    };

    // Helper to generate QR data URL
    const generateQrDataUrl = (text: string, size: number): Promise<string | null> => {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                resolve(null);
                return;
            }

            // Simple QR code generation using a lightweight approach
            // We'll use the QRCode library via a temporary div
            const container = document.createElement("div");
            container.style.position = "absolute";
            container.style.left = "-9999px";
            document.body.appendChild(container);

            try {
                // Use QRCode.react's internal logic or a simple QR generator
                // For now, use a simple approach with an API
                const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=2`;
                
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, size, size);
                    const dataUrl = canvas.toDataURL("image/png");
                    document.body.removeChild(container);
                    resolve(dataUrl);
                };
                img.onerror = () => {
                    // Fallback: draw a placeholder
                    ctx.fillStyle = "#f0f0f0";
                    ctx.fillRect(0, 0, size, size);
                    ctx.fillStyle = "#999";
                    ctx.font = "14px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText("QR Code", size/2, size/2);
                    const dataUrl = canvas.toDataURL("image/png");
                    document.body.removeChild(container);
                    resolve(dataUrl);
                };
                img.src = apiUrl;
            } catch {
                document.body.removeChild(container);
                resolve(null);
            }
        });
    };

    const selectedTable = tables.find((t) => t.id === selectedTableId);

    return (
        <AuthenticatedLayout user={auth?.user} activeNav="Meja">
            <Head title="Meja" />

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
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleExportAllQr}
                        className="border border-[#e5e7eb] rounded-lg px-4 py-2 text-white bg-[#475569] hover:bg-[#334155] cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200 text-sm font-medium"
                        title="Ekspor semua QR Code meja (ZIP)"
                    >
                        <Download className="size-4" />
                        <span>Ekspor QR</span>
                    </button>
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
            </div>

            <div className="flex justify-between pb-3 gap-3 items-center">
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <TableIcon size={20} color="#ef4444" />
                    </div>
                    <span className="text-sm">Total Meja</span>
                    <span className="text-xl font-bold -mt-2">
                        {tables.length}
                    </span>
                </div>
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-2 w-full">
                    <div className="size-10 max-md:size-12 rounded-lg border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca]">
                        <CheckCircle2 className="size-5 max-md:size-8" />
                    </div>
                    <span className="text-sm">Meja Tersedia</span>
                    <span className="text-xl font-bold -mt-2">
                        {tables.filter((t) => t.available === true).length}
                    </span>
                </div>
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

            <div className="border border-[#e5e7eb] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center pb-3 flex-wrap gap-3">
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
                                paginatedTables.map((item, i) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]/50">
                                            {startIndex + i + 1}
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
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px]">
                                            {item.active_order ? (
                                                <Link
                                                    href="/dashboard/pesanan"
                                                    className="text-[#1e293b] hover:text-[#b91c1c] transition-colors"
                                                >
                                                    Pesanan #
                                                    {item.active_order.id} (
                                                    {
                                                        item.active_order
                                                            .items_count
                                                    }{" "}
                                                    item)
                                                </Link>
                                            ) : (
                                                <span className="text-[#64748b]">
                                                    Tidak ada pesanan
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className="w-9 h-9 rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer flex items-center justify-center text-[#475569] transition-all duration-200 hover:bg-[#f1f5f9]"
                                                    title="QR Code"
                                                    onClick={() => openQrModal(item)}
                                                >
                                                    <QrCode className="w-[18px] h-[18px]" />
                                                </button>
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

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    from={filteredTables.length > 0 ? startIndex + 1 : 0}
                    to={Math.min(
                        startIndex + itemsPerPage,
                        filteredTables.length,
                    )}
                    total={filteredTables.length}
                    itemName="meja"
                    onPageChange={(page) => setCurrentPage(page)}
                />

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
                                Hapus Meja M-{selectedTable?.table_number}?
                            </DialogTitle>
                            <DialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Ini akan
                                menghapus data meja M-
                                {selectedTable?.table_number}
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

                {/* QR Code Modal */}
                <Dialog
                    open={activeDialog === "qr"}
                    onOpenChange={(open) =>
                        setActiveDialog(open ? "qr" : null)
                    }
                >
                    <DialogContent className="sm:max-w-md max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>
                                QR Code Meja M-{selectedTable?.table_number}
                            </DialogTitle>
                            <DialogDescription>
                                Scan untuk memesan di Meja M-{selectedTable?.table_number} • Area {selectedTable?.location}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                            {selectedTable && (
                                <>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <QRCodeSVG
                                            value={getTableOrderUrl(selectedTable.id)}
                                            size={200}
                                            level="M"
                                            includeMargin={true}
                                        />
                                    </div>
                                    <div className="w-full space-y-2 text-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            Link Pesanan:
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <code className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-xs font-mono text-gray-700 break-all truncate max-w-[200px]">
                                                {getTableOrderUrl(selectedTable.id)}
                                            </code>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        getTableOrderUrl(selectedTable.id),
                                                    );
                                                    toast.success("Link disalin ke clipboard");
                                                }}
                                                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                                                title="Salin link"
                                            >
                                                <Copy className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const printWindow = window.open("", "_blank");
                                                if (printWindow) {
                                                    const url = getTableOrderUrl(selectedTable.id);
                                                    printWindow.document.write(`
                                                        <html>
                                                            <head>
                                                                <title>QR Code Meja M-${selectedTable.table_number}</title>
                                                                <style>
                                                                    body { font-family: sans-serif; text-align: center; padding: 20px; }
                                                                    .qr-container { display: inline-block; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                                                                    h2 { color: #1e293b; margin-bottom: 10px; }
                                                                    .info { margin-top: 15px; color: #475569; font-size: 14px; }
                                                                    .url { font-family: monospace; background: #f1f5f9; padding: 8px 12px; border-radius: 8px; display: inline-block; margin-top: 10px; word-break: break-all; }
                                                                </style>
                                                            </head>
                                                            <body onload="window.print(); window.onafterprint = () => window.close();">
                                                                <div class="qr-container">
                                                                    <h2>Meja M-${selectedTable.table_number}</h2>
                                                                    <p class="info">Area ${selectedTable.location.charAt(0).toUpperCase() + selectedTable.location.slice(1)}</p>
                                                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&format=png&margin=2" alt="QR Code" />
                                                                    <div class="url">${url}</div>
                                                                </div>
                                                            </body>
                                                        </html>
                                                    `);
                                                    printWindow.document.close();
                                                }
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
                                        >
                                            <Printer className="w-4 h-4" />
                                            <span>Cetak QR Code</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setActiveDialog(null)}
                            >
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
