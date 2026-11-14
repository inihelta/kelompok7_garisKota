import React from "react";
import { CustomerTable } from "@/types/customer";
import { MapPin, Users, Sparkles, Coffee } from "lucide-react";

interface CustomerHeaderProps {
    table: CustomerTable;
}

export default function CustomerHeader({ table }: CustomerHeaderProps) {
    return (
        <div className="relative w-full bg-[#f8fafc] pb-2">
            {/* Top Banner Cover */}
            <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#0f172a]">
                {/* Decorative background shapes */}
                <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-2xl" />
                <div className="absolute top-8 -left-8 h-32 w-32 rounded-full bg-teal-400/15 blur-xl" />

                {/* Cafe Brand Top Bar */}
                <div className="relative z-10 flex items-center justify-between px-4 pt-4 text-white">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md">
                            <Coffee className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
                                Garis Kota
                            </span>
                            <h2 className="text-sm font-bold leading-none text-white">
                                Coffee & Eatery
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-md border border-white/10">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        Dine-In
                    </div>
                </div>
            </div>

            {/* Overlapping Table Info Card (Like Reference Header) */}
            <div className="relative -mt-16 px-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200/60">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                                    <Sparkles className="h-3 w-3" />
                                    Scan QR Aktif
                                </span>
                            </div>
                            <h1 className="mt-1 text-2xl font-black text-gray-900 tracking-tight">
                                Meja {table.table_number < 10 ? `0${table.table_number}` : table.table_number}
                            </h1>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                <span className="inline-flex items-center gap-1 font-medium capitalize">
                                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                    Area {table.location}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="inline-flex items-center gap-1 font-medium">
                                    <Users className="h-3.5 w-3.5 text-gray-400" />
                                    Kapasitas {table.capacity} Orang
                                </span>
                            </div>
                        </div>

                        {/* Big Badge visual for table */}
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200/80 shadow-xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">MEJA</span>
                            <span className="text-lg font-black text-gray-800 leading-none">
                                #{table.table_number}
                            </span>
                        </div>
                    </div>

                    {/* Operational Note */}
                    <div className="mt-3.5 border-t border-dashed border-gray-100 pt-2.5 flex items-center justify-between text-[11px] text-gray-500">
                        <span>Pembayaran langsung di Kasir setelah pesan</span>
                        <span className="font-semibold text-emerald-600">Buka</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

