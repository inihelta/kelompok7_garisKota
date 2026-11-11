import { User, Clock } from "lucide-react";
import { OrderItem, PaginatedData } from "@/types/dashboard";
import Pagination from "@/Components/Pagination";

interface RecentOrdersTableProps {
    recentOrders: PaginatedData<OrderItem> | null;
    onOrderClick: (order: OrderItem) => void;
}

export default function RecentOrdersTable({
    recentOrders,
    onOrderClick,
}: RecentOrdersTableProps) {
    return (
        <div className="border border-[#e5e7eb] rounded-xl p-4 bg-white flex flex-col gap-3 shadow-xs">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr>
                            <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                PELANGGAN
                            </th>
                            <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                ID
                            </th>
                            <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                PESANAN
                            </th>
                            <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]">
                                WAKTU
                            </th>
                            <th className="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] text-center w-[120px]">
                                STATUS
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders && recentOrders.data && recentOrders.data.length > 0 ? (
                            recentOrders.data.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50/60 transition-colors"
                                >
                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm text-[#334155]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#D91A20] text-white flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-semibold text-[#1e293b]">
                                                {item.customer_name || `Pelanggan #${item.id}`}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm font-semibold text-[#475569]">
                                        #{item.id}
                                    </td>

                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm">
                                        <button
                                            type="button"
                                            onClick={() => onOrderClick(item)}
                                            className="px-3.5 py-1.5 rounded-full bg-[#D91A20] hover:bg-[#b91c1c] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1"
                                        >
                                            Detail Pesanan
                                        </button>
                                    </td>

                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-sm text-[#475569]">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span>
                                                {item.relative_time || item.formatted_time || "-"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3.5 border-b border-[#f1f5f9] align-middle text-center">
                                        {item.order_status === "cancelled" ? (
                                            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#ef4444] inline-block">
                                                Dibatalkan
                                            </span>
                                        ) : item.order_status === "completed" ? (
                                            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#16a34a] inline-block">
                                                Selesai
                                            </span>
                                        ) : (
                                            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#d97706] inline-block">
                                                Diproses
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">
                                    Belum ada transaksi riwayat pesanan di database.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {recentOrders && (
                <Pagination
                    links={recentOrders.links}
                    from={recentOrders.from}
                    to={recentOrders.to}
                    total={recentOrders.total}
                    itemName="riwayat"
                />
            )}
        </div>
    );
}