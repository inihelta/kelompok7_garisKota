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
