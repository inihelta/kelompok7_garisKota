<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        @vite(['resources/css/dashboard.css', 'resources/js/dashboard.js'])
        <!-- Development version -->
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
        <title>Document</title>
    </head>
    <body>
        <aside class="sidebar" id="sidebar">
            <a href="#" class="sidebar_logo">
                <img src="logoRed.png" alt="Garis Kota" />
            </a>

            <nav class="sidebar_nav">
                <a href="#" class="sidebar_link is-active" aria-current="page">
                    <i data-lucide="house"></i>
                    <span>Dashboard</span>
                </a>

                <a href="#" class="sidebar_link">
                    <i data-lucide="ClipboardList"></i>
                    <span>Pesanan</span>
                </a>

                <a href="#" class="sidebar_link">
                    <i data-lucide="wallet"></i>
                    <span>Pendapatan</span>
                </a>

                <a href="#" class="sidebar_link">
                    <i data-lucide="Utensils"></i>
                    <span>Menu</span>
                </a>

                <a href="#" class="sidebar_link">
                    <i data-lucide="Archive"></i>
                    <span>Stok</span>
                </a>
            </nav>
        </aside>
        <div class="overlay" id="overlay"></div>
        <div class="page">
            <header class="navbar">
                <button
                    class="navbar_toggle"
                    id="toggle"
                    type="button"
                    aria-label="Buka menu"
                >
                    <i data-lucide="Menu"></i>
                </button>

                <form class="search" role="search">
                    <i class="search-icon" data-lucide="search"></i>
                    <input
                        type="search"
                        class="search_input"
                        placeholder="Cari menu, kategori, atau kode..."
                    />
                </form>

                <div class="navbar_right">
                    <button class="bell" type="button" aria-label="Notifikasi">
                        <i data-lucide="bell"></i>
                        <span class="bell_dot"></span>
                    </button>

                    <button class="profile" type="button">
                        <span class="profile-avatar">
                            <i data-lucide="UserRound"></i>
                        </span>
                        <span class="profile_info">
                            <strong>Garis Kota</strong>
                            <small>Admin</small>
                        </span>
                        <i data-lucide="ChevronDown"></i>
                    </button>
                </div>
            </header>

            <main class="content">
                <div class="content-wrapper">
                    <div class="topbar">
                        <div class="filter-group">
                            <button class="btn-filter active">
                                Semua Menu
                            </button>
                            <button class="btn-filter">Makanan</button>
                            <button class="btn-filter">Minuman</button>
                            <button class="btn-filter">Snack</button>
                        </div>

                        <div class="input-wrapper">
                            <i data-lucide="search" class="search-icon"></i>

                            <input
                                type="text"
                                id="search"
                                placeholder="Cari menu, kategori, atau kode..."
                                required
                            />
                        </div>
                    </div>
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th style="width: 40px">
                                    <input type="checkbox" />
                                </th>
                                <th style="width: 80px">Gambar</th>
                                <th>Nama Menu</th>
                                <th>Kategori</th>
                                <th>Harga</th>
                                <th>Stok</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Baris 1: Mix Platter -->
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <img
                                        src="path_gambar_mix_platter.jpg"
                                        alt="Mix Platter"
                                        class="product-img"
                                    />
                                </td>
                                <td>
                                    <div class="menu-info">
                                        <span class="menu-name"
                                            >Mix Platter</span
                                        >
                                        <span class="menu-desc"
                                            >Kentang, nugget, ayam, sosis</span
                                        >
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-makanan"
                                        >Makanan</span
                                    >
                                </td>
                                <td>Rp 45.000</td>
                                <td>12</td>
                                <td>
                                    <span class="badge badge-tersedia"
                                        >Tersedia</span
                                    >
                                </td>
                                <td>
                                    <div class="actions">
                                        <button class="btn-action" title="Edit">
                                            <i
                                                class="icon"
                                                data-lucide="Pencil"
                                            ></i>
                                        </button>
                                        <button
                                            class="btn-action btn-delete"
                                            title="Hapus"
                                        >
                                            <i
                                                class="icon"
                                                data-lucide="Trash2"
                                            ></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <!-- Baris 2: Kentang Goreng -->
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <img
                                        src="path_gambar_kentang.jpg"
                                        alt="Kentang Goreng"
                                        class="product-img"
                                    />
                                </td>
                                <td>
                                    <div class="menu-info">
                                        <span class="menu-name"
                                            >Kentang Goreng</span
                                        >
                                        <span class="menu-desc"
                                            >Kentang crispy</span
                                        >
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-snack">Snack</span>
                                </td>
                                <td>Rp 18.000</td>
                                <td>28</td>
                                <td>
                                    <span class="badge badge-tersedia"
                                        >Tersedia</span
                                    >
                                </td>
                                <td>
                                    <div class="actions">
                                        <button class="btn-action" title="Edit">
                                            <i
                                                class="icon"
                                                data-lucide="Pencil"
                                            ></i>
                                        </button>
                                        <button
                                            class="btn-action btn-delete"
                                            title="Hapus"
                                        >
                                            <i
                                                class="icon"
                                                data-lucide="Trash2"
                                            ></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <!-- Baris 3: Hazelnut Latte -->
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <img
                                        src="path_gambar_hazelnut.jpg"
                                        alt="Hazelnut Latte"
                                        class="product-img"
                                    />
                                </td>
                                <td>
                                    <div class="menu-info">
                                        <span class="menu-name"
                                            >Hazelnut Latte</span
                                        >
                                        <span class="menu-desc"
                                            >Hazelnut Latte dingin</span
                                        >
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-minuman"
                                        >Minuman</span
                                    >
                                </td>
                                <td>Rp 22.000</td>
                                <td>15</td>
                                <td>
                                    <span class="badge badge-tersedia"
                                        >Tersedia</span
                                    >
                                </td>
                                <td>
                                    <div class="actions">
                                        <button class="btn-action" title="Edit">
                                            <i
                                                class="icon"
                                                data-lucide="Pencil"
                                            ></i>
                                        </button>
                                        <button
                                            class="btn-action btn-delete"
                                            title="Hapus"
                                        >
                                            <i
                                                class="icon"
                                                data-lucide="Trash2"
                                            ></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <!-- Baris 4: Pisang Gapit -->
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <img
                                        src="path_gambar_pisang.jpg"
                                        alt="Pisang Gapit"
                                        class="product-img"
                                    />
                                </td>
                                <td>
                                    <div class="menu-info">
                                        <span class="menu-name"
                                            >Pisang Gapit</span
                                        >
                                        <span class="menu-desc"
                                            >Pisang gapit</span
                                        >
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-makanan"
                                        >Makanan</span
                                    >
                                </td>
                                <td>Rp 12.000</td>
                                <td>18</td>
                                <td>
                                    <span class="badge badge-habis">Habis</span>
                                </td>
                                <td>
                                    <div class="actions">
                                        <button class="btn-action" title="Edit">
                                            <i
                                                class="icon"
                                                data-lucide="Pencil"
                                            ></i>
                                        </button>
                                        <button
                                            class="btn-action btn-delete"
                                            title="Hapus"
                                        >
                                            <i
                                                class="icon"
                                                data-lucide="Trash2"
                                            ></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
