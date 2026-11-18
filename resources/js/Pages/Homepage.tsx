import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import { Head } from "@inertiajs/react";
import VariableProximity from "@/Components/VariableProximity";
import {
    QrCode,
    Smartphone,
    UtensilsCrossed,
    CheckCircle2,
    ArrowDown,
    Coffee,
    HelpCircle,
} from "lucide-react";
import { useGSAP } from "@gsap/react";

export default function Homepage() {
    gsap.registerPlugin(ScrollTrigger);

    const heroRef = useRef<HTMLDivElement>(null);
    const tutorialRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToTutorial = () => {
        tutorialRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useGSAP(
        () => {
            gsap.to(heroRef.current, {
                borderRadius: "1rem",
                scale: 0.98,
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    start: "center center",
                    end: "+=350px",
                    scrub: 1,
                    markers: true,
                },
            });
        },
        { scope: containerRef },
    );

    return (
        <ReactLenis
            root
            options={{ lerp: 0.1, duration: 0.75, smoothWheel: true }}
        >
            <div className="min-h-screen bg-[#F2F1E6] text-[#1c1917] font-sans antialiased selection:bg-[#BE1A1A] selection:text-[#fffff0]">
                <Head title="Cara Pemesanan" />

                <div className="w-full mx-auto flex items-center flex-col">
                    <div
                        ref={containerRef}
                        className="w-full mx-auto flex items-center flex-col mb-[350px]"
                    >
                        <section
                            ref={heroRef}
                            className="relative w-dvw h-dvh  bg-[#BE1A1A] text-[#fffff0] flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-hidden shadow-sm"
                        >
                            <div className="my-auto py-12 sm:py-16 text-center select-none cursor-default z-10">
                                <div className="inline-block w-full">
                                    <VariableProximity
                                        label="GARIS KOTA"
                                        className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-black tracking-tight leading-none text-[#fffff0]"
                                        fromFontVariationSettings="'wght' 1000, 'opsz' 9"
                                        toFontVariationSettings="'wght' 100, 'opsz' 40"
                                        containerRef={heroRef}
                                        radius={190}
                                        falloff="gaussian"
                                        smoothing={0.65}
                                    />
                                    <p className="mt-4 sm:mt-6 text-xs sm:text-base md:text-md text-[#fffff0]/85 max-w-lg mx-auto font-normal leading-relaxed">
                                        Pesan makanan dan minuman langsung dari
                                        meja Anda tanpa perlu beranjak atau
                                        mengantre.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={scrollToTutorial}
                                    className="inline-flex items-center gap-2 rounded-full text-md font-bold transition-all active:scale-95 mt-4"
                                >
                                    <span>Lihat Cara Pesan</span>
                                    <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </section>
                    </div>

                    <section
                        ref={tutorialRef}
                        className="rounded-2xl sm:rounded-3xl bg-white border border-[#e5dfd3] p-6 sm:p-10 md:p-14 shadow-2xs"
                    >
                        <div className="max-w-3xl">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1c1917] tracking-tight">
                                Cara Memesan via QR Meja
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-[#6b635b] leading-relaxed">
                                Cukup gunakan kamera smartphone Anda. Tidak
                                perlu mengunduh aplikasi tambahan atau membuat
                                akun.
                            </p>
                        </div>

                        {/* Steps Progression Flow */}
                        <div className="mt-10 sm:mt-12 space-y-4 sm:space-y-6">
                            {/* Step 1 */}
                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-[#F2F1E6]/70 border border-[#e8e2d5] transition-colors hover:bg-[#F2F1E6]">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#BE1A1A] text-[#fffff0] font-black text-base shadow-xs">
                                    01
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <h3 className="text-base sm:text-lg font-bold text-[#1c1917] flex items-center gap-2">
                                        <QrCode className="h-5 w-5 text-[#BE1A1A]" />
                                        Temukan Kode QR di Meja
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm text-[#574f46] leading-relaxed">
                                        Pilih tempat duduk Anda, baik di area
                                        indoor maupun outdoor. Di setiap meja
                                        telah terpasang stiker atau akrilik yang
                                        memuat nomor meja dan kode QR unik.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-[#F2F1E6]/70 border border-[#e8e2d5] transition-colors hover:bg-[#F2F1E6]">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#BE1A1A] text-[#fffff0] font-black text-base shadow-xs">
                                    02
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <h3 className="text-base sm:text-lg font-bold text-[#1c1917] flex items-center gap-2">
                                        <Smartphone className="h-5 w-5 text-[#BE1A1A]" />
                                        Pindai dengan Kamera HP
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm text-[#574f46] leading-relaxed">
                                        Buka aplikasi kamera bawaan pada
                                        smartphone (iPhone atau Android),
                                        arahkan ke kode QR meja, lalu ketuk
                                        tautan yang muncul. Halaman menu meja
                                        Anda akan terbuka otomatis di browser.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-[#F2F1E6]/70 border border-[#e8e2d5] transition-colors hover:bg-[#F2F1E6]">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#BE1A1A] text-[#fffff0] font-black text-base shadow-xs">
                                    03
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <h3 className="text-base sm:text-lg font-bold text-[#1c1917] flex items-center gap-2">
                                        <UtensilsCrossed className="h-5 w-5 text-[#BE1A1A]" />
                                        Pilih Menu & Tambahkan Catatan
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm text-[#574f46] leading-relaxed">
                                        Pilih hidangan dan minuman yang Anda
                                        inginkan. Anda dapat menambahkan catatan
                                        khusus per item seperti tingkat
                                        kemanisan (*less sugar*), es dipisah,
                                        atau preferensi rasa lainnya.
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-[#F2F1E6]/70 border border-[#e8e2d5] transition-colors hover:bg-[#F2F1E6]">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#BE1A1A] text-[#fffff0] font-black text-base shadow-xs">
                                    04
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <h3 className="text-base sm:text-lg font-bold text-[#1c1917] flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-[#BE1A1A]" />
                                        Isi Nama Pemesan & Kirim Pesanan
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm text-[#574f46] leading-relaxed">
                                        Buka keranjang pesanan, masukkan nama
                                        Anda agar barista dan pelayan mudah
                                        mengantarkan ke meja, lalu konfirmasi
                                        pesanan Anda.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Operational Notes / FAQ Ringkas */}
                        <div className="mt-10 pt-8 border-t border-[#f0ebd9] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#574f46]">
                            <div className="p-4 rounded-xl bg-[#F2F1E6]/50 border border-[#e8e2d5] space-y-1">
                                <h4 className="font-bold text-[#1c1917] flex items-center gap-1.5">
                                    <HelpCircle className="h-4 w-4 text-[#BE1A1A]" />
                                    Pembayaran Pesanan
                                </h4>
                                <p className="text-xs text-[#6b635b] leading-relaxed">
                                    Pembayaran dilakukan di kasir menggunakan
                                    uang tunai atau QRIS setelah pesanan dibuat.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-[#F2F1E6]/50 border border-[#e8e2d5] space-y-1">
                                <h4 className="font-bold text-[#1c1917] flex items-center gap-1.5">
                                    <HelpCircle className="h-4 w-4 text-[#BE1A1A]" />
                                    Ingin Menambah Pesanan?
                                </h4>
                                <p className="text-xs text-[#6b635b] leading-relaxed">
                                    Cukup buka kembali halaman status pesanan di
                                    HP Anda dan klik tombol "Pesan Menu
                                    Tambahan" tanpa perlu memindai ulang QR.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Minimalist Quiet Footer */}
                    <footer className="text-center py-6 text-xs text-[#8c8275]">
                        <p>
                            © {new Date().getFullYear()} Garis Kota Coffee &
                            Eatery. Selamat menikmati waktu Anda.
                        </p>
                    </footer>
                </div>
            </div>
        </ReactLenis>
    );
}
