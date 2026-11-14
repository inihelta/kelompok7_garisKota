import React, { useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import VariableProximity from "@/Components/VariableProximity";
import {
    Coffee,
    QrCode,
    Sparkles,
    Clock,
    MapPin,
    ArrowRight,
    LogIn,
    Utensils,
    ShieldCheck,
} from "lucide-react";

export default function Homepage() {
    const heroRef = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-neutral-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
            <Head title="Garis Kota - Coffee & Eatery" />

            {/* Top Navigation */}
            <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xs">
                            <Coffee className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <span className="text-sm font-black tracking-wider text-neutral-900">
                                GARIS KOTA
                            </span>
                            <span className="hidden text-[11px] text-gray-500 sm:inline sm:ml-1.5 font-medium">
                                • Coffee & Eatery
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-gray-700 shadow-2xs transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95"
                        >
                            <LogIn className="h-3.5 w-3.5 text-gray-500" />
                            <span>Staff Login</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section with Interactive VariableProximity */}
            <main>
                <section
                    ref={heroRef}
                    className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 text-center"
                >
                    {/* Subtle background glow */}
                    <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
                        <div className="h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl sm:h-96 sm:w-96" />
                        <div className="absolute top-1/3 -left-12 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
                    </div>

                    <div className="mx-auto max-w-3xl">
                        {/* Status pill */}
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60 shadow-2xs mb-6">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Tempat Kopi & Ruang Cerita</span>
                        </div>

                        {/* Interactive Brand Title via VariableProximity */}
                        <div className="cursor-default select-none py-2">
                            <VariableProximity
                                label="GARIS KOTA"
                                className="text-5xl font-black tracking-tight text-neutral-900 sm:text-7xl md:text-8xl"
                                fromFontVariationSettings="'wght' 400, 'opsz' 14"
                                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                                containerRef={heroRef}
                                radius={140}
                                falloff="gaussian"
                            />
                        </div>

                        <p className="mt-4 text-base font-medium text-gray-600 sm:text-lg max-w-xl mx-auto leading-relaxed">
                            Nikmati sajian kopi pilihan, kudapan lezat, dan suasana hangat. 
                            Pesan makanan & minuman langsung dari meja Anda tanpa antre.
                        </p>

                        {/* Order Instructions Box */}
                        <div className="mt-8 mx-auto max-w-md rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs text-left">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                                    <QrCode className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900">
                                        Sudah Berada di Meja?
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Arahkan kamera smartphone ke stiker QR di atas mejamu untuk mulai memesan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3 Step Ordering Process */}
                <section className="border-t border-gray-100 bg-white py-16 px-4 sm:px-6">
                    <div className="mx-auto max-w-4xl">
                        <div className="text-center mb-12">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                Kemudahan Pemesanan
                            </span>
                            <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
                                Cara Memesan via QR Meja
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm text-gray-500">
                                3 langkah mudah menikmati santapan tanpa perlu beranjak dari kursi Anda.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {/* Step 1 */}
                            <div className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-6 text-center transition-all hover:shadow-xs">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-xs border border-gray-100 mb-4">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 mb-2">
                                    Langkah 1
                                </span>
                                <h3 className="text-base font-bold text-gray-900">
                                    Duduk Nyaman
                                </h3>
                                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                                    Pilih meja favoritmu, baik di area Indoor ber-AC maupun area Outdoor yang asri.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-6 text-center transition-all hover:shadow-xs">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-xs border border-gray-100 mb-4">
                                    <QrCode className="h-6 w-6" />
                                </div>
                                <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 mb-2">
                                    Langkah 2
                                </span>
                                <h3 className="text-base font-bold text-gray-900">
                                    Scan QR & Pilih Menu
                                </h3>
                                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                                    Scan kode QR meja untuk membuka katalog menu, tambahkan catatan selera, dan masukkan namamu.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-6 text-center transition-all hover:shadow-xs">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-xs border border-gray-100 mb-4">
                                    <Utensils className="h-6 w-6" />
                                </div>
                                <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 mb-2">
                                    Langkah 3
                                </span>
                                <h3 className="text-base font-bold text-gray-900">
                                    Disajikan ke Mejamu
                                </h3>
                                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                                    Pesanan langsung diracik oleh barista/koki dan diantar ke mejamu. Bayar santai di kasir!
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cafe Info & Schedule Section */}
                <section className="py-14 px-4 sm:px-6 bg-[#f8fafc]">
                    <div className="mx-auto max-w-4xl rounded-3xl bg-neutral-900 p-8 text-white shadow-xl sm:p-12 relative overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 items-center">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                    Kunjungi Kami
                                </span>
                                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                                    Garis Kota Coffee & Eatery
                                </h2>
                                <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                    Tempat yang pas untuk bekerja, berkumpul bersama sahabat, atau menikmati secangkir ketenangan.
                                </p>
                                <div className="mt-6 flex flex-col gap-2.5 text-xs text-neutral-300">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-emerald-400" />
                                        <span>Buka Setiap Hari: 10.00 - 23.00 WITA</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-emerald-400" />
                                        <span>Area Indoor & Outdoor Tersedia</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center sm:items-end justify-center">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md text-center max-w-xs w-full">
                                    <ShieldCheck className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
                                    <h4 className="text-sm font-bold text-white">
                                        Akses Khusus Karyawan
                                    </h4>
                                    <p className="text-[11px] text-neutral-400 mt-1 mb-4">
                                        Kelola pesanan dapur, stok bahan, meja, dan laporan kasir.
                                    </p>
                                    <Link
                                        href="/login"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 px-4 text-xs font-bold text-neutral-950 shadow-md transition-all hover:bg-emerald-400 active:scale-95"
                                    >
                                        <span>Masuk Dashboard</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200/80 bg-white py-6 text-center text-xs text-gray-500">
                <p>© {new Date().getFullYear()} Garis Kota. All rights reserved.</p>
            </footer>
        </div>
    );
}

