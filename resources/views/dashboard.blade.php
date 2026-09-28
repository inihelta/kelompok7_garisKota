<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard | Garis Kota</title>
  @vite(['resources/css/dashboard.css', 'resources/js/dashboard.js'])   

</head>
<body>
  <!-- ================= SIDEBAR ================= -->
  <aside class="sidebar" id="sidebar">
    <a href="#" class="sidebar_logo">
      <img src="logoRed.png" alt="Garis Kota">
    </a>

    <nav class="sidebar_nav">
      <a href="#" class="sidebar_link is-active" aria-current="page">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <span>Dashboard</span>
      </a>

      <a href="#" class="sidebar_link">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>
        </svg>
        <span>Pesanan</span>
      </a>

      <a href="#" class="sidebar_link">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
        </svg>
        <span>Pendapatan</span>
      </a>

      <a href="#" class="sidebar_link">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
          <path d="M7 2v20"/>
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
        </svg>
        <span>Menu</span>
      </a>

      <a href="#" class="sidebar_link">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="20" height="5" x="2" y="3" rx="1"/>
          <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
          <path d="M10 12h4"/>
        </svg>
        <span>Stok</span>
      </a>
    </nav>
  </aside>

  <div class="overlay" id="overlay"></div>

  <!-- ================= KONTEN ================= -->
  <div class="page">

    <!-- NAVBAR -->
    <header class="navbar">
      <button class="navbar_toggle" id="toggle" type="button" aria-label="Buka menu">
        <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <form class="search" role="search">
        <svg class="search_icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input type="search" class="search_input" placeholder="Cari menu, kategori, atau kode...">
      </form>

      <div class="navbar_right">
        <button class="bell" type="button" aria-label="Notifikasi">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span class="bell_dot"></span>
        </button>

        <button class="profile" type="button">
          <span class="profile_avatar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4.5"/><path d="M3.5 21a8.5 8.5 0 0 1 17 0z"/></svg>
          </span>
          <span class="profile_info">
            <strong>Garis Kota</strong>
            <small>Admin</small>
          </span>
          <svg class="profile_chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    </header>

    <!-- Isi halaman (kartu, grafik, tabel) taruh di sini -->
    <main class="content"></main>
  </div>

  <script>
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const toggle  = document.getElementById('toggle');
    const setOpen = (open) => {
      sidebar.classList.toggle('is-open', open);
      overlay.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(true));
    overlay.addEventListener('click', () => setOpen(false));
  </script>
</body>
</html>