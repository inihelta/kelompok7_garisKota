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
  <a href="https://phpunit.de"><img src="https://img.shields.io/badge/PHPUnit-11.x-4F72B3?style=flat-square&logo=phpunit&logoColor=white" alt="PHPUnit 11" /></a>
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

### 1. 📱 Pemesanan Customer via Scan QR Meja
- **Akses Tanpa Login**: Customer cukup memindai QR code pada meja untuk membuka katalog menu (`/order/{token}`).
- **Token Meja Terenkripsi**: Helper `App\Helpers\TableToken` menghasilkan token ID + hash HMAC — token yang dimanipulasi otomatis ditolak.
- **Keranjang Interaktif**: `FloatingCartBar` (mobile) dan `DesktopCartSidebar` (desktop) dengan checkout modal.
- **Pelacakan Pesanan dengan Cookie**: ID pesanan tersimpan di cookie `placed_orders` (berlaku 7 hari), sehingga **status pesanan tetap dapat diakses kembali** meski customer memindai ulang QR atau menutup browser.
- **Banner Pesanan Aktif**: Halaman katalog menampilkan banner "Pesanan #X sedang menunggu antrean / diproses" dengan tombol menuju halaman status.
- **Halaman Status Real-Time**: `/order/status/{id}` memperbarui status pesanan secara live (pending → processing → completed) tanpa refresh.
- **Batal Pesanan**: Customer dapat membatalkan pesanan sendiri; stok menu otomatis dikembalikan.
- **Rate Limiting**: Endpoint order dibatasi `throttle:10,1` dan endpoint status `throttle:60,1`.

### 2. 📋 Manajemen Katalog Menu & Kategori (CRUD)
- **Kategorisasi Terstruktur**: Pengelompokan menu otomatis berdasarkan kategori (*Makanan*, *Minuman*, *Snack*).
- **Pengelolaan Data Lengkap**: Tambah, edit, dan hapus menu dengan atribut nama, harga, stok, deskripsi, dan status ketersediaan.
- **Upload Media Terintegrasi**: Unggah gambar menu langsung dengan penyimpanan disk publik; file otomatis dihapus saat data diubah/dihapus.
- **Status Menu Dinamis**: Pilihan status ketersediaan produk (*Tersedia*, *Draft*, *Nonaktif*).

### 3. 🍽️ Manajemen Meja
- CRUD meja: nomor, kapasitas, area (*indoor/outdoor*), dan status ketersediaan (*Tersedia/Terisi*).
- Statistik ringkasan jumlah meja terisi dan kosong.
- **Konflik Update**: dialog konflik muncul bila meja diedit bersamaan oleh admin lain (berbasis `order_action` complete/cancel).

### 4. 📦 Manajemen Stok Bahan Baku
- **Kategori Stok Terpisah**: tabel `stock_categories` (icon: coffee, milk, droplet, cup, food) terpisah dari stok.
- **Kartu Stok Lengkap**: SKU, stok, satuan, stok minimum, dan estimasi pemakaian harian.
- **Status Otomatis**: atribut `Stock::$status` → *Menipis* bila `stock <= min_stock` (memicu notifikasi stok rendah).
- CRUD via `Route::resource` (`stocks`, `stock-categories`) tanpa halaman create/edit terpisah (menggunakan modal).

### 5. 🧾 Manajemen Pesanan (Order Management)
- Halaman antrean pesanan dengan detail per item dan metode pembayaran.
- **Alur Status**: `pending` → `processing` → `completed` / `cancelled`.
- Saat pesanan **dibatalkan**, stok menu otomatis dikembalikan; saat **selesai**, pembayaran ditandai `done`.

### 6. 💰 Pendapatan (Income)
- Halaman `/dashboard/pendapatan` dengan metrik performa, sumber pembayaran (*cash / qris / e_wallet*), dan pesanan terbaru.
- **Filter Rentang Tanggal**: Hari Ini, 7 Hari, Bulan Ini, atau rentang kustom (`start_date` & `end_date`).

### 7. 🔔 Notifikasi Real-Time
- **Broadcasting via Laravel Reverb + Echo**: event `NotificationCreated`, `NewOrderPlaced`, dan `OrderStatusUpdated` dikirim live ke browser.
- **Dropdown Notifikasi** (`NotificationDropdown`) dengan tab *Semua / Belum Dibaca / Pesanan / Stok* dan penanda read per-item maupun *tandai semua*.
- **Halaman Notifikasi** (`/dashboard/notifikasi`) dengan pencarian dan pagination.

### 8. 🔒 Autentikasi & Keamanan Terkelola
- Sistem login berbasis session guard Laravel dengan validasi input.
- Route tertutup middleware `auth` untuk dashboard dan `guest` untuk halaman login.
- **`PreventBackHistory`**: tombol *back* browser setelah logout diganti riwayat (`history.replaceState`) agar sesi lama tidak bisa diakses kembali.
- **`AuthGuard`**: komponen React yang menjaga halaman dashboard tetap terproteksi di sisi klien.

### 9. 🎨 Desain Antarmuka Modern & Responsif
- **Tailwind CSS v4**, icon **Lucide React** & **FontAwesome**, komponen dialog **Radix UI / shadcn**.
- **Animasi Premium**: GSAP + `@gsap/react` (komponen `VariableProximity`), smooth scroll **Lenis**.
- **Chart Interaktif**: Recharts untuk grafik performa pendapatan.
- **Toast Notifikasi**: `sonner` untuk feedback aksi CRUD.
- Navigasi mulus ala SPA berkat Inertia.js.

---

### Rincian Teknologi:
- **Backend Framework**: [Laravel 12.x](https://laravel.com) (PHP 8.2+)
- **Frontend Framework**: [React 19.x](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- **Glue Layer**: [Inertia.js](https://inertiajs.com/) (`@inertiajs/react` 3.x)
- **Real-Time**: [Laravel Reverb](https://laravel.com/docs/broadcasting) + [Laravel Echo](https://laravel.com/docs/eloquent-events#broadcasting) (`@laravel/echo-react`)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com), [shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev), [FontAwesome](https://fontawesome.com)
- **Animasi & Chart**: [GSAP](https://gsap.com), [Lenis](https://darkroom.engineering/lenis), [Recharts](https://recharts.org)
- **Routing Helper**: [Ziggy](https://github.com/tighten/ziggy)
- **Build Tool**: [Vite 7.x](https://vitejs.dev)
- **Testing**: [PHPUnit 11.x](https://phpunit.de)
- **Database**: SQLite (Default) / MySQL
- **Timezone**: `Asia/Jakarta` · **Locale**: `id`

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

> **Real-time notifications** membutuhkan konfigurasi Reverb di `.env`:
> ```
> BROADCAST_CONNECTION=reverb
> REVERB_APP_ID=...
> REVERB_APP_KEY=...
> REVERB_APP_SECRET=...
> REVERB_HOST="localhost"
> REVERB_PORT=8080
> REVERB_SCHEME=http
> ```
> Untuk development lokal, `REVERB_HOST=localhost` sudah benar. Untuk production, ganti dengan domain server Anda.

### 5. Migrasi & Seeding Database
Jalankan migrasi database beserta data dummy bawaan (admin, kategori, menu, meja, pesanan, pembayaran, dan stok):
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
#### Opsi 1: Menjalankan otomatis (Server + Queue + Reverb + Vite dev server)
```bash
composer run apaja
```
> Script `apaja` menjalankan: `php artisan serve`, `queue:listen`, `reverb:start`, dan `npm run dev` secara bersamaan.

#### Opsi 2: Menjalankan manual di dua terminal terpisah
```bash
# Terminal 1:
php artisan serve

# Terminal 2:
npm run dev
```

Buka browser dan akses aplikasi dengan port 8000

> **Catatan untuk production**: jalankan `php artisan config:cache` dan `php artisan storage:link`, serta pastikan `APP_ENV=production` dan `APP_DEBUG=false`.

---

## 🧪 Menjalankan Test

Proyek ini memiliki **81 test** dengan **303 assertions** menggunakan PHPUnit 11.

```bash
# Jalankan semua test
php artisan test

# Atau melalui composer script
composer run test

# Jalankan test tertentu
php artisan test --filter=CustomerOrderTest
php artisan test --filter=OrderControllerTest
```

### Rincian Test:

| File Test | Jumlah | Coverage Area |
| :-------- | :----- | :------------ |
| `tests/Unit/TableTokenTest.php` | 4 | Generate/resolve token, tampered hash, numeric ID |
| `tests/Unit/ModelTest.php` | 8 | Relasi Order↔Table, Order↔OrderItem, Order↔Payment, Menu↔Category, Table↔Orders, Stock status, StockCategory↔Stock, Category↔Menu |
| `tests/Feature/CustomerOrderTest.php` | 8 | Catalog load, invalid token, store order, stock validation, status page, cancel restores stock, new order notification, customer cancel notification |
| `tests/Feature/AuthTest.php` | 6 | Login valid/invalid, dashboard access, guest redirect, logout |
| `tests/Feature/OrderControllerTest.php` | 5 | Pesanan page, process, complete, cancel restores stock, guest redirect |
| `tests/Feature/StockTest.php` | 6 | Stok page, phantom category ID guard, create, validation, update, delete |
| `tests/Feature/CategoryTest.php` | 7 | CRUD category, unique validation, guest redirect |
| `tests/Feature/StockCategoryTest.php` | 7 | CRUD, unique name, icon validation, JSON endpoints |
| `tests/Feature/MenuTest.php` | 9 | CRUD menu, validation, image upload, guest redirect |
| `tests/Feature/DashboardTest.php` | 3 | Page load, metrics props, guest redirect |
| `tests/Feature/IncomeTest.php` | 5 | Page load, metrics, date filter, custom range, guest redirect |
| `tests/Feature/NotificationTest.php` | 8 | Filter tab/unread/type, mark read, mark all read, search, guest redirect |
| `tests/Feature/TableTest.php` | 3 | Page load, tables prop, guest redirect |
| `tests/Feature/ExampleTest.php` | 1 | Halaman utama memberi respon sukses |
| `tests/Unit/ExampleTest.php` | 1 | Sanity test bawaan Laravel |

---

## 📁 Struktur Direktori Proyek

```
garisKota/
├── app/
│   ├── Events/
│   │   ├── NewOrderPlaced.php               # Event pesanan baru (broadcast)
│   │   ├── NotificationCreated.php          # Event notifikasi baru (broadcast)
│   │   └── OrderStatusUpdated.php           # Event status pesanan berubah (broadcast)
│   ├── Helpers/
│   │   └── TableToken.php                   # Generate/resolve token QR meja (HMAC)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php           # Login, logout, sesi
│   │   │   ├── CategoryController.php       # CRUD kategori menu
│   │   │   ├── CustomerOrderController.php  # Order customer via QR (catalog, store, status, cancel)
│   │   │   ├── DashboardController.php      # Metrik dashboard
│   │   │   ├── IncomeController.php         # Halaman pendapatan + filter tanggal
│   │   │   ├── MenuController.php           # CRUD menu + upload gambar
│   │   │   ├── NotificationController.php   # API & halaman notifikasi
│   │   │   ├── OrderController.php          # Proses/complete/cancel pesanan admin
│   │   │   ├── StockController.php          # CRUD stok bahan baku
│   │   │   ├── StockCategoryController.php  # CRUD kategori stok
│   │   │   └── TableController.php          # CRUD meja
│   │   └── Middleware/
│   │       ├── HandleInertiaRequests.php    # Share data Inertia global
│   │       └── PreventBackHistory.php       # Cegah back-history setelah logout
│   └── Models/
│       ├── AppNotification.php              # Notifikasi (scope unread)
│       ├── Category.php                     # Kategori menu
│       ├── Menu.php                         # Menu produk
│       ├── Order.php                        # Pesanan (hasOne payment, hasMany orderItems)
│       ├── OrderItem.php                    # Item pesanan
│       ├── Payment.php                      # Pembayaran (cash/qris/e_wallet)
│       ├── Stock.php                        # Stok bahan baku (status otomatis)
│       ├── StockCategory.php                # Kategori stok
│       ├── Table.php                        # Meja (QR token)
│       └── User.php                         # User / admin
├── database/
│   ├── migrations/                          # Skema tabel (12 migration)
│   └── seeders/
│       └── DatabaseSeeder.php               # Admin, kategori, menu, meja, pesanan, stok
├── public/
│   ├── banner.png                           # Aset banner visual
│   ├── logoRed.png                          # Logo Garis Kota
│   └── storage/                             # Tautan media gambar menu
├── resources/
│   ├── css/                                 # Global CSS & Tailwind rules
│   ├── js/
│   │   ├── Components/
│   │   │   ├── Customer/                    # MenuItemCard, FloatingCartBar, DesktopCartSidebar, OrderCheckoutModal, CategoryJumpModal, CustomerHeader
│   │   │   ├── ui/                          # Komponen shadcn (dialog, button, Toast, scroll-area, dll)
│   │   │   ├── AuthGuard.tsx                # Penjaga route client-side
│   │   │   ├── MejaFormModal.tsx            # Modal CRUD meja + dialog konflik
│   │   │   ├── MenuFormModal.tsx            # Modal CRUD menu + upload gambar
│   │   │   ├── NotificationDropdown.tsx     # Dropdown notifikasi real-time
│   │   │   ├── OrderDetailModal.tsx         # Modal detail pesanan
│   │   │   ├── Sidebar.tsx                  # Navigasi dashboard
│   │   │   ├── StockCategoryModal.tsx       # Modal CRUD kategori stok
│   │   │   └── StokFormModal.tsx            # Modal CRUD stok
│   │   ├── Layouts/
│   │   │   └── AuthenticatedLayout.tsx      # Layout dashboard
│   │   ├── Pages/
│   │   │   ├── Customer/
│   │   │   │   ├── OrderCatalog.tsx         # Katalog menu customer (QR scan)
│   │   │   │   └── OrderStatus.tsx          # Status pesanan customer
│   │   │   ├── Dashboard.tsx                # Ringkasan metrik & performa
│   │   │   ├── Homepage.tsx                 # Landing page
│   │   │   ├── Login.tsx                    # Halaman login
│   │   │   ├── Meja.tsx                     # Manajemen meja
│   │   │   ├── Menu.tsx                     # Manajemen menu
│   │   │   ├── Notifikasi.tsx               # Halaman notifikasi
│   │   │   ├── Pendapatan.tsx               # Halaman pendapatan
│   │   │   ├── Pesanan.tsx                  # Antrean pesanan
│   │   │   └── Stok.tsx                     # Manajemen stok
│   │   ├── types/                           # TypeScript definitions
│   │   └── app.tsx                          # Bootstrap Inertia + Echo + AuthGuard
│   └── views/
│       └── app.blade.php                    # Root template Inertia
├── routes/
│   └── web.php                              # Rute web (auth, dashboard, order, API notifikasi)
├── tests/
│   ├── Feature/                             # 12 file test fitur (68 test)
│   └── Unit/                                # 3 file test unit (13 test)
├── package.json                             # Konfigurasi dependensi JavaScript
└── composer.json                            # Konfigurasi dependensi PHP + scripts
```

---

## 🔌 Rute Utama

### Public (Customer — Scan QR)
| Method | URI | Fungsi |
| :----- | :-- | :----- |
| GET | `/order/{token}` | Buka katalog menu berdasarkan token meja |
| POST | `/order` | Simpan pesanan baru |
| GET | `/order/status/{order}` | Halaman status pesanan |
| PUT | `/order/{order}/cancel` | Batalkan pesanan (stok dikembalikan) |

### Auth
| Method | URI | Fungsi |
| :----- | :-- | :----- |
| GET | `/login` | Halaman login |
| POST | `/login` | Proses login |
| GET | `/logout` | Logout |

### Dashboard (Auth Required)
| Method | URI | Fungsi |
| :----- | :-- | :----- |
| GET | `/dashboard` | Dashboard utama |
| GET | `/dashboard/menu` | Manajemen menu |
| GET | `/dashboard/pesanan` | Antrean pesanan |
| GET | `/dashboard/pendapatan` | Halaman pendapatan |
| GET | `/dashboard/meja` | Manajemen meja |
| GET | `/dashboard/stok` | Manajemen stok |
| GET | `/dashboard/notifikasi` | Halaman notifikasi |
| GET | `/api/notifications` | API notifikasi (JSON) |
| PUT | `/api/notifications/{id}/read` | Tandai notifikasi dibaca |
| PUT | `/api/notifications/mark-all-read` | Tandai semua dibaca |
| PUT | `/orders/{order}/process` | Proses pesanan → processing |
| PUT | `/orders/{order}/complete` | Selesaikan pesanan → completed |
| PUT | `/orders/{order}/cancel` | Batalkan pesanan (stok dikembalikan) |
| POST/PUT/DELETE | `/menus`, `/tables`, `/stocks`, `/categories`, `/stock-categories` | CRUD resources |

---

## ❓ Troubleshooting

| Masalah | Solusi |
| :------ | :----- |
| Gambar menu tidak muncul | Jalankan `php artisan storage:link` |
| Notifikasi tidak real-time | Pastikan `php artisan reverb:start` berjalan dan `BROADCAST_CONNECTION=reverb` |
| Gambar tidak terhapus saat edit | Pastikan `public/storage` adalah symlink yang valid |
| Test gagal karena DB | Pastikan `phpunit.xml` mengonfigurasi SQLite `:memory:` |
| Back-button masih menampilkan dashboard setelah logout | Pastikan middleware `prevent-back-history` terdaftar di `bootstrap/app.php` |

---

<p align="center">
  Dibuat karna ujian blok 2 oleh <strong>Kelompok 7</strong>
</p>
