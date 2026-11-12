import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links?: PaginationLink[];

    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;

    from?: number;
    to?: number;
    total?: number;
    itemName?: string;
}

export default function Pagination({
    links,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    from,
    to,
    total,
    itemName = "data",
}: PaginationProps) {
    const cleanLabel = (label: string) => {
        if (label.includes("Previous") || label.includes("&laquo;")) {
            return <ChevronLeft className="w-4 h-4" aria-hidden="true" />;
        }
        if (label.includes("Next") || label.includes("&raquo;")) {
            return <ChevronRight className="w-4 h-4" aria-hidden="true" />;
        }
        return label;
    };

    if (links && links.length > 0) {
        return (
            <div className="flex justify-between items-center pt-3 text-[14px] text-[#64748b] flex-wrap gap-2">
                <div>
                    {from && to && total ? (
                        <>
                            Menampilkan{" "}
                            <span className="font-semibold text-gray-900">
                                {from}
                            </span>{" "}
                            -{" "}
                            <span className="font-semibold text-gray-900">
                                {to}
                            </span>{" "}
                            dari{" "}
                            <span className="font-semibold text-gray-900">
                                {total}
                            </span>{" "}
                            {itemName}
                        </>
                    ) : (
                        total && `Total ${total} ${itemName}`
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    {links.map((link, index) => {
                        const isNavButton =
                            link.label.includes("Previous") ||
                            link.label.includes("Next") ||
                            link.label.includes("&laquo;") ||
                            link.label.includes("&raquo;");

                        if (!link.url) {
                            return (
                                <span
                                    key={index}
                                    className={`w-8 h-8 rounded-[8px] border border-[#e2e8f0] bg-gray-50 flex items-center justify-center text-gray-300 cursor-not-allowed select-none text-xs`}
                                >
                                    {cleanLabel(link.label)}
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={link.url}
                                preserveScroll
                                preserveState
                                className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-xs font-medium transition-all ${
                                    link.active
                                        ? "bg-[#D91A20] text-white shadow-xs"
                                        : "border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-gray-50"
                                }`}
                                aria-label={link.label}
                                aria-current={link.active ? "page" : undefined}
                            >
                                {cleanLabel(link.label)}
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-between items-center pt-3 text-[14px] text-[#64748b] flex-wrap gap-2">
            <div>
                {from && to && total ? (
                    <>
                        Menampilkan{" "}
                        <span className="font-semibold text-gray-900">
                            {from}
                        </span>{" "}
                        -{" "}
                        <span className="font-semibold text-gray-900">
                            {to}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-gray-900">
                            {total}
                        </span>{" "}
                        {itemName}
                    </>
                ) : (
                    total && `Total ${total} ${itemName}`
                )}
            </div>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() =>
                        onPageChange && onPageChange(currentPage - 1)
                    }
                    className="w-8 h-8 rounded-[8px] border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Halaman sebelumnya"
                    aria-disabled={currentPage <= 1}
                >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>

                {pages.map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange && onPageChange(p)}
                        className={`w-8 h-8 rounded-[8px] font-medium text-xs flex items-center justify-center transition-all ${
                            currentPage === p
                                ? "bg-[#D91A20] text-white shadow-xs"
                                : "border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-gray-50"
                        }`}
                        aria-label={`Halaman ${p}`}
                        aria-current={currentPage === p ? "page" : undefined}
                    >
                        {p}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                        onPageChange && onPageChange(currentPage + 1)
                    }
                    className="w-8 h-8 rounded-[8px] border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Halaman selanjutnya"
                    aria-disabled={currentPage >= totalPages}
                >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
