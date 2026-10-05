<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        @vite(['resources/css/app.css', 'resources/js/dashboard.js'])
        <!-- Development version -->
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
        <title>Document</title>
    </head>
    <body class="m-0 font-sans text-[#111827] bg-white antialiased">
        <aside
            class="fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#e5e7eb] -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out [&.is-open]:translate-x-0"
            id="sidebar"
        >
            <a href="#" class="flex h-[120px] items-center justify-center">
                <img
                    src="logoRed.png"
                    alt="Garis Kota"
                    class="h-[72px] w-auto block"
                />
            </a>

            <nav class="flex flex-col gap-2 pt-[13px] pr-[12px] pb-0 pl-[11px]">
                <a
                    href="#"
                    class="flex items-center gap-2 h-[47px] pl-[23px] rounded-[10px] text-[16px] font-bold text-[#e31b23] bg-[#fde8e8] transition-[background-color,color] duration-150 hover:bg-[#fef2f2] hover:text-[#e31b23] [&>svg]:w-[25px] [&>svg]:h-[25px] [&>svg]:shrink-0 [&>i]:w-[25px] [&>i]:h-[25px] [&>i]:shrink-0"
                    aria-current="page"
                >
                    <i data-lucide="house"></i>
                    <span>Dashboard</span>
                </a>

                <a
                    href="#"
                    class="flex items-center gap-2 h-[47px] pl-[23px] rounded-[10px] text-[16px] font-normal text-[#1f2937] transition-[background-color,color] duration-150 hover:bg-[#fef2f2] hover:text-[#e31b23] [&>svg]:w-[25px] [&>svg]:h-[25px] [&>svg]:shrink-0 [&>i]:w-[25px] [&>i]:h-[25px] [&>i]:shrink-0"
                >
                    <i data-lucide="ClipboardList"></i>
                    <span>Pesanan</span>
                </a>

                <a
                    href="#"
                    class="flex items-center gap-2 h-[47px] pl-[23px] rounded-[10px] text-[16px] font-normal text-[#1f2937] transition-[background-color,color] duration-150 hover:bg-[#fef2f2] hover:text-[#e31b23] [&>svg]:w-[25px] [&>svg]:h-[25px] [&>svg]:shrink-0 [&>i]:w-[25px] [&>i]:h-[25px] [&>i]:shrink-0"
                >
                    <i data-lucide="wallet"></i>
                    <span>Pendapatan</span>
                </a>

                <a
                    href="#"
                    class="flex items-center gap-2 h-[47px] pl-[23px] rounded-[10px] text-[16px] font-normal text-[#1f2937] transition-[background-color,color] duration-150 hover:bg-[#fef2f2] hover:text-[#e31b23] [&>svg]:w-[25px] [&>svg]:h-[25px] [&>svg]:shrink-0 [&>i]:w-[25px] [&>i]:h-[25px] [&>i]:shrink-0"
                >
                    <i data-lucide="Utensils"></i>
                    <span>Menu</span>
                </a>

                <a
                    href="#"
                    class="flex items-center gap-2 h-[47px] pl-[23px] rounded-[10px] text-[16px] font-normal text-[#1f2937] transition-[background-color,color] duration-150 hover:bg-[#fef2f2] hover:text-[#e31b23] [&>svg]:w-[25px] [&>svg]:h-[25px] [&>svg]:shrink-0 [&>i]:w-[25px] [&>i]:h-[25px] [&>i]:shrink-0"
                >
                    <i data-lucide="Archive"></i>
                    <span>Stok</span>
                </a>
            </nav>
        </aside>

        <div
            class="fixed inset-0 z-30 bg-black/40 opacity-0 invisible transition-opacity duration-200 lg:hidden [&.is-open]:opacity-100 [&.is-open]:visible"
            id="overlay"
        ></div>

        <div class="min-h-screen lg:pl-64">
            <header
                class="sticky top-0 z-20 flex items-center gap-4 h-[74px] px-4 lg:pl-[22px] lg:pr-[30px] bg-white border-b border-[#e5e7eb]"
            >
                <button
                    class="block lg:hidden p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer bg-transparent border-0"
                    id="toggle"
                    type="button"
                    aria-label="Buka menu"
                >
                    <i data-lucide="Menu" class="w-6 h-6 block"></i>
                </button>

                <form class="relative w-full max-w-[338px]" role="search">
                    <i
                        class="absolute left-[10px] top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#e31b23] [stroke-width:2] pointer-events-none block"
                        data-lucide="search"
                    ></i>
                    <input
                        type="search"
                        class="w-full h-[39px] pl-[36px] pr-[10px] text-[12px] text-[#374151] bg-white border border-[#e5e7eb] rounded-[5px] placeholder-[#9ca3af] outline-none focus:border-[#f87171] focus:ring-3 focus:ring-[#fee2e2]"
                        placeholder="Cari menu, kategori, atau kode..."
                    />
                </form>

                <div class="flex items-center gap-[18px] lg:gap-[30px] ml-auto">
                    <button
                        class="relative text-[#1f2937] bg-transparent border-0 p-0 cursor-pointer"
                        type="button"
                        aria-label="Notifikasi"
                    >
                        <i data-lucide="bell" class="block"></i>
                        <span
                            class="absolute -top-[1px] right-0 w-[6px] h-[6px] rounded-full bg-[#e31b23]"
                        ></span>
                    </button>

                    <button
                        class="flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer"
                        type="button"
                    >
                        <span
                            class="scale-95 flex items-center justify-center p-[6px] rounded-full bg-[#111827] text-white"
                        >
                            <i
                                data-lucide="UserRound"
                                class="w-3 h-3 block"
                            ></i>
                        </span>
                        <span
                            class="text-left leading-[1.3] mr-[14px] hidden min-[656px]:block"
                        >
                            <strong class="text-[16px] font-bold block"
                                >Garis Kota</strong
                            >
                            <small class="text-[12px] text-[#6b7280] block"
                                >Admin</small
                            >
                        </span>
                        <i
                            data-lucide="ChevronDown"
                            class="w-3 h-3 ml-[14px] text-[#6b7280] hidden min-[656px]:block"
                        ></i>
                    </button>
                </div>
            </header>

            <main class="px-[22px] pt-[12px] pb-[24px]">
                <div
                    class="border border-[#e5e7eb] rounded-[8px] p-4 flex flex-col gap-3"
                >
                    <div
                        class="flex justify-between items-center pb-3 flex-wrap gap-3"
                    >
                        <div class="flex gap-2 flex-wrap">
                            <button
                                class="px-6 py-2 rounded-full text-[14px] font-semibold cursor-pointer bg-[#fee2e2] text-[#dc2626] border border-transparent transition-all duration-200 ease-in-out"
                            >
                                Semua Menu
                            </button>
                            <button
                                class="px-6 py-2 rounded-full text-[14px] font-semibold cursor-pointer bg-white text-[#4b5563] border border-[#4b5563] transition-all duration-200 ease-in-out hover:bg-[#f3f4f6]"
                            >
                                Makanan
                            </button>
                            <button
                                class="px-6 py-2 rounded-full text-[14px] font-semibold cursor-pointer bg-white text-[#4b5563] border border-[#4b5563] transition-all duration-200 ease-in-out hover:bg-[#f3f4f6]"
                            >
                                Minuman
                            </button>
                            <button
                                class="px-6 py-2 rounded-full text-[14px] font-semibold cursor-pointer bg-white text-[#4b5563] border border-[#4b5563] transition-all duration-200 ease-in-out hover:bg-[#f3f4f6]"
                            >
                                Snack
                            </button>
                        </div>

                        <div
                            class="relative flex items-center w-[20rem] max-w-full"
                        >
                            <i
                                data-lucide="search"
                                class="absolute left-[15px] w-[18px] h-[18px] text-[#9ca3af] pointer-events-none block"
                            ></i>

                            <input
                                type="text"
                                id="search"
                                placeholder="Cari menu, kategori, atau kode..."
                                required
                                class="w-full h-[38px] pl-[40px] pr-[15px] rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c] transition-colors duration-200"
                            />
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse text-left">
                            <thead>
                                <tr>
                                    <th
                                        class="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] w-[40px]"
                                    >
                                        <input
                                            type="checkbox"
                                            class="w-[18px] h-[18px] rounded border border-[#cbd5e1] cursor-pointer accent-[#ef4444]"
                                        />
                                    </th>
                                    <th
                                        class="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px] w-[80px]"
                                    >
                                        Gambar
                                    </th>
                                    <th
                                        class="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        Nama Menu
                                    </th>
                                    <th
                                        class="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        Kategori
                                    </th>
                                    <th
                                        class="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        Harga
                                    </th>
                                    <th
                                        class="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        Stok
                                    </th>
                                    <th
                                        class="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        Status
                                    </th>
                                    <th
                                        class="bg-[#f7f7fa] text-[#475569] font-medium text-[14px] p-4 first:rounded-l-[8px] last:rounded-r-[8px]"
                                    >
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Baris 1: Mix Platter -->
                                <tr>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <input
                                            type="checkbox"
                                            class="w-[18px] h-[18px] rounded border border-[#cbd5e1] cursor-pointer accent-[#ef4444]"
                                        />
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <img
                                            src="path_gambar_mix_platter.jpg"
                                            alt="Mix Platter"
                                            class="w-12 h-12 rounded-[8px] object-cover bg-[#f1f5f9] block"
                                        />
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <div class="flex flex-col">
                                            <span
                                                class="font-semibold text-[#1e293b] mb-1"
                                                >Mix Platter</span
                                            >
                                            <span
                                                class="text-[13px] text-[#94a3b8]"
                                                >Kentang, nugget, ayam,
                                                sosis</span
                                            >
                                        </div>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <span
                                            class="px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center bg-[#fee2e2] text-[#ef4444]"
                                        >
                                            Makanan
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        Rp 45.000
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        12
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <span
                                            class="px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center bg-[#dcfce7] text-[#16a34a]"
                                        >
                                            Tersedia
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <div class="flex gap-2">
                                            <button
                                                class="w-9 h-9 rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer flex items-center justify-center text-[#475569] transition-all duration-200 hover:bg-[#f1f5f9] [&>svg]:w-[18px] [&>svg]:h-[18px] [&>i]:w-[18px] [&>i]:h-[18px]"
                                                title="Edit"
                                            >
                                                <i data-lucide="Pencil"></i>
                                            </button>
                                            <button
                                                class="w-9 h-9 rounded-[8px] border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca] [&>svg]:w-[18px] [&>svg]:h-[18px] [&>i]:w-[18px] [&>i]:h-[18px]"
                                                title="Hapus"
                                            >
                                                <i data-lucide="Trash2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Baris 2: Kentang Goreng -->
                                <tr>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <input
                                            type="checkbox"
                                            class="w-[18px] h-[18px] rounded border border-[#cbd5e1] cursor-pointer accent-[#ef4444]"
                                        />
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <img
                                            src="path_gambar_kentang.jpg"
                                            alt="Kentang Goreng"
                                            class="w-12 h-12 rounded-[8px] object-cover bg-[#f1f5f9] block"
                                        />
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <div class="flex flex-col">
                                            <span
                                                class="font-semibold text-[#1e293b] mb-1"
                                                >Kentang Goreng</span
                                            >
                                            <span
                                                class="text-[13px] text-[#94a3b8]"
                                                >Kentang crispy</span
                                            >
                                        </div>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <span
                                            class="px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center bg-[#ffedd5] text-[#ea580c]"
                                        >
                                            Snack
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        Rp 18.000
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        28
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <span
                                            class="px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center bg-[#dcfce7] text-[#16a34a]"
                                        >
                                            Tersedia
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <div class="flex gap-2">
                                            <button
                                                class="w-9 h-9 rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer flex items-center justify-center text-[#475569] transition-all duration-200 hover:bg-[#f1f5f9] [&>svg]:w-[18px] [&>svg]:h-[18px] [&>i]:w-[18px] [&>i]:h-[18px]"
                                                title="Edit"
                                            >
                                                <i data-lucide="Pencil"></i>
                                            </button>
                                            <button
                                                class="w-9 h-9 rounded-[8px] border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca] [&>svg]:w-[18px] [&>svg]:h-[18px] [&>i]:w-[18px] [&>i]:h-[18px]"
                                                title="Hapus"
                                            >
                                                <i data-lucide="Trash2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Baris 3: Hazelnut Latte -->
                                <tr>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <input
                                            type="checkbox"
                                            class="w-[18px] h-[18px] rounded border border-[#cbd5e1] cursor-pointer accent-[#ef4444]"
                                        />
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <img
                                            src="path_gambar_hazelnut.jpg"
                                            alt="Hazelnut Latte"
                                            class="w-12 h-12 rounded-[8px] object-cover bg-[#f1f5f9] block"
                                        />
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <div class="flex flex-col">
                                            <span
                                                class="font-semibold text-[#1e293b] mb-1"
                                                >Hazelnut Latte</span
                                            >
                                            <span
                                                class="text-[13px] text-[#94a3b8]"
                                                >Hazelnut Latte dingin</span
                                            >
                                        </div>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <span
                                            class="px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center bg-[#dbeafe] text-[#2563eb]"
                                        >
                                            Minuman
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        Rp 22.000
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        15
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <span
                                            class="px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center bg-[#dcfce7] text-[#16a34a]"
                                        >
                                            Tersedia
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <div class="flex gap-2">
                                            <button
                                                class="w-9 h-9 rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer flex items-center justify-center text-[#475569] transition-all duration-200 hover:bg-[#f1f5f9] [&>svg]:w-[18px] [&>svg]:h-[18px] [&>i]:w-[18px] [&>i]:h-[18px]"
                                                title="Edit"
                                            >
                                                <i data-lucide="Pencil"></i>
                                            </button>
                                            <button
                                                class="w-9 h-9 rounded-[8px] border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca] [&>svg]:w-[18px] [&>svg]:h-[18px] [&>i]:w-[18px] [&>i]:h-[18px]"
                                                title="Hapus"
                                            >
                                                <i data-lucide="Trash2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Baris 4: Pisang Gapit -->
                                <tr>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <input
                                            type="checkbox"
                                            class="w-[18px] h-[18px] rounded border border-[#cbd5e1] cursor-pointer accent-[#ef4444]"
                                        />
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <img
                                            src="path_gambar_pisang.jpg"
                                            alt="Pisang Gapit"
                                            class="w-12 h-12 rounded-[8px] object-cover bg-[#f1f5f9] block"
                                        />
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <div class="flex flex-col">
                                            <span
                                                class="font-semibold text-[#1e293b] mb-1"
                                                >Pisang Gapit</span
                                            >
                                            <span
                                                class="text-[13px] text-[#94a3b8]"
                                                >Pisang gapit</span
                                            >
                                        </div>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <span
                                            class="px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center bg-[#fee2e2] text-[#ef4444]"
                                        >
                                            Makanan
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        Rp 12.000
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        18
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <span
                                            class="px-3 py-1.5 rounded-full text-[12px] min-w-[3rem] font-semibold inline-block text-center bg-[#fee2e2] text-[#ef4444]"
                                        >
                                            Habis
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 border-b border-[#f1f5f9] align-middle text-[14px] text-[#334155]"
                                    >
                                        <div class="flex gap-2">
                                            <button
                                                class="w-9 h-9 rounded-[8px] border border-[#e2e8f0] bg-white cursor-pointer flex items-center justify-center text-[#475569] transition-all duration-200 hover:bg-[#f1f5f9] [&>svg]:w-[18px] [&>svg]:h-[18px] [&>i]:w-[18px] [&>i]:h-[18px]"
                                                title="Edit"
                                            >
                                                <i data-lucide="Pencil"></i>
                                            </button>
                                            <button
                                                class="w-9 h-9 rounded-[8px] border border-[#fee2e2] bg-[#fee2e2] cursor-pointer flex items-center justify-center text-[#ef4444] transition-all duration-200 hover:bg-[#fecaca] [&>svg]:w-[18px] [&>svg]:h-[18px] [&>i]:w-[18px] [&>i]:h-[18px]"
                                                title="Hapus"
                                            >
                                                <i data-lucide="Trash2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- bagian pagination -->
                    <!-- <div class="flex justify-between items-center">
                        <span class="text-[14px] text-[#64748b]"
                            >Menampilkan 1-4 dari 4 menu</span
                        >

                        <div class="flex gap-2">
                            <button
                                class="flex items-center justify-center w-9 h-9 bg-[#dc2626] border border-[#dc2626] rounded-[8px] text-white text-[14px] font-medium cursor-pointer transition-all duration-200 ease-in-out"
                            >
                                1
                            </button>
                        </div>
                    </div> -->
                </div>
            </main>
        </div>

        <script>
            const sidebar = document.getElementById("sidebar");
            const overlay = document.getElementById("overlay");
            const toggle = document.getElementById("toggle");
            const setOpen = (open) => {
                sidebar.classList.toggle("is-open", open);
                overlay.classList.toggle("is-open", open);
            };
            toggle.addEventListener("click", () => setOpen(true));
            overlay.addEventListener("click", () => setOpen(false));
        </script>
        <script src="https://unpkg.com/lucide@latest"></script>
        <script>
            lucide.createIcons();
        </script>
    </body>
</html>
