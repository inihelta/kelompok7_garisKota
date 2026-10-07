<p align="center">
  <img src="public/logoRed.png" alt="Garis Kota - Banner" width="40%" />
</p>

<p align="center">
  <strong>Sistem Manajemen Restoran & Point of Sale (POS) Modern Berbasis Laravel 12, Inertia.js, dan React TypeScript</strong>
</p>

<p align="center">
  <a href="https://laravel.com"><img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat-square&logo=laravel&logoColor=white" alt="Laravel 12" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://inertiajs.com"><img src="https://img.shields.io/badge/Inertia.js-v2.0-9553E9?style=flat-square&logo=inertia&logoColor=white" alt="Inertia.js" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License MIT" /></a>
</p>

---

## 📌 Ringkasan Proyek (Overview)

**Garis Kota** adalah aplikasi web Point of Sale (POS) dan sistem manajemen operasional kafe/restoran yang dirancang untuk mempercepat alur kerja pemesanan, pencatatan menu, dan pengelolaan inventaris secara real-time. 

Dibangun dengan arsitektur **Monolith Modern (Single-Page Application)** menggunakan kombinasi **Laravel 12** sebagai backend yang tangguh, **Inertia.js** sebagai jembatan data tanpa perlu membangun REST API terpisah secara manual, serta **React 19 & TypeScript** untuk antarmuka pengguna yang reaktif, cepat, dan intuitif.

Aplikasi ini dikembangkan oleh **Kelompok 7** untuk memberikan solusi digitalisasi bisnis kuliner yang efisien, mudah dikelola, dan memiliki tampilan visual elegan.

---

## 🔑 Akses Demo & Akun Pengujian

Untuk keperluan presentasi, evaluasi guru, dan pengujian fitur:

| Role              | Email             | Password   | Hak Akses                                                          |
| :---------------- | :---------------- | :--------- | :----------------------------------------------------------------- |
| **Administrator** | `admin@gmail.com` | `password` | Akses penuh dashboard, manajemen menu, stok, kategori, dan pesanan |

> **Catatan:** Data di atas digenerate otomatis melalui database seeder (`php artisan db:seed` atau `php artisan migrate:fresh --seed`).

---

## 🚀 Fitur Utama (Key Features)

### 1. 📋 Manajemen Katalog Menu & Kategori (CRUD)
- **Kategorisasi Terstruktur**: Pengelompokan menu otomatis berdasarkan kategori (*Makanan*, *Minuman*, *Snack*).
- **Pengelolaan Data Lengkap**: Tambah, edit, dan hapus menu dengan atribut nama, harga, stok, deskripsi, dan status ketersediaan.
- **Upload Media Terintegrasi**: Unggah gambar menu secara langsung dengan penyimpanan disk publik yang aman dan penghapusan file otomatis ketika data diubah/dihapus.
- **Status Menu Dinamis**: Pilihan status ketersediaan produk (*Tersedia*, *Draft*, *Nonaktif*).

### 2. 🔍 Pencarian & Filtering Real-Time
- **Instant Search**: Pencarian nama atau deskripsi menu secara instan tanpa perlu reload halaman.
- **Filter Tab Kategori**: Beralih antar kategori (*Semua Menu*, *Makanan*, *Minuman*, *Snack*) secara seamless dan responsif.

### 3. 🧾 Manajemen Pesanan (Order Management)
- Antarmuka khusus untuk memantau daftar antrean pesanan pelanggan, rincian pesanan, dan status transaksi yang sedang berlangsung.

### 4. 🔒 Autentikasi & Keamanan Terkelola
- Sistem login berbasis session guard Laravel yang aman dengan validasi input menyeluruh.
- Proteksi route tertutup dengan middleware `auth` untuk area dashboard dan `guest` untuk halaman login.

### 5. 🎨 Desain Antarmuka Modern & Responsif
- Dibangun menggunakan **Tailwind CSS v4**, icon set modern dari **Lucide React** dan **FontAwesome**, serta komponen dialog interaktif berbasis **Radix UI / shadcn**.
- Pengalaman pengguna yang mulus (*SPA feel*) berkat transisi cepat dari Inertia.js.

---

### Rincian Teknologi:
- **Backend Framework**: [Laravel 12.x](https://laravel.com) (PHP 8.2+)
- **Frontend Framework**: [React 19.x](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- **Glue Layer**: [Inertia.js](https://inertiajs.com/) (`@inertiajs/react` 3.x)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com), [shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev)
- **Routing Helper**: [Ziggy](https://github.com/tighten/ziggy)
- **Build Tool**: [Vite 7.x](https://vitejs.dev)
- **Database**: SQLite (Default) / MySQL

---

## 💻 Panduan Instalasi & Menjalankan Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek **Garis Kota** di komputer lokal Anda:

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terpasang:
- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 18.x & **npm**

### 2. Kloning Repository
```bash
git clone https://github.com/inihelta/kelompok7_garisKota.git
cd kelompok7_garisKota
```

### 3. Instalasi Dependensi PHP & Node
```bash
# Instalasi dependensi backend
composer install

# Instalasi dependensi frontend
npm install
```

### 4. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env` lalu generate application key:
```bash
cp .env.example .env
php artisan key:generate
```

### 5. Migrasi & Seeding Database
Jalankan migrasi database beserta data dummy bawaan:
```bash
php artisan migrate --seed
```

### 6. Symbolic Link Storage (Untuk Media Menu)
Hubungkan direktori storage publik agar gambar menu dapat diakses di browser:
```bash
php artisan storage:link
```

### 7. Menjalankan Server Development
Anda dapat menjalankan server backend dan frontend sekaligus dengan perintah:
#### Opsi 1: Menjalankan otomatis (Server + Vite dev server)
```bash
composer run apaja
```
#### Opsi 2: Menjalankan manual di dua terminal terpisah
```bash
# Terminal 1:
php artisan serve

# Terminal 2:
npm run dev
```

Buka browser dan akses aplikasi dengan port 8000

---

## 📁 Struktur Direktori Proyek

```
garisKota/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── AuthController.php      # Controller login & sesi
│   │       └── MenuController.php      # Controller CRUD menu & kategori
│   └── Models/
│       ├── category.php                # Model kategori
│       ├── menu.php                    # Model menu produk
│       └── User.php                    # Model user / admin
├── database/
│   ├── migrations/                     # Skema tabel database
│   └── seeders/
│       └── DatabaseSeeder.php          # Seeder default user & katalog menu
├── public/
│   ├── banner.png                      # Aset banner visual
│   ├── logoRed.png                     # Logo Garis Kota
│   └── storage/                        # Tautan media gambar menu
├── resources/
│   ├── css/                            # Global CSS & Tailwind rules
│   ├── js/
│   │   ├── Components/                 # Komponen UI (Modal, Button, Dialog)
│   │   ├── Layouts/                    # Template layout autentikasi & dashboard
│   │   ├── Pages/
│   │   │   ├── Dashboard.tsx           # Halaman utama manajemen katalog POS
│   │   │   ├── Login.tsx               # Halaman login administrator
│   │   │   └── Pesanan.tsx             # Halaman manajemen pesanan
│   │   └── types/                      # TypeScript definitions
│   └── views/
│       └── app.blade.php               # Root template Inertia
├── routes/
│   └── web.php                         # Definisi rute web aplikasi
├── package.json                        # Konfigurasi dependensi JavaScript
└── composer.json                       # Konfigurasi dependensi PHP
```

---

<p align="center">
  Dibuat karna ujian blok 2 oleh <strong>Kelompok 7</strong>
</p>
