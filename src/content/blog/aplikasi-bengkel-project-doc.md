---
title: Aplikasi Bengkel Project Doc
description: Ini adalah dokumentasi project Aplikasi-Bengkel
pubDate: 2026-05-25T22:19:00.000Z
draft: false
categories:
  - Documentation
---
# Dokumentasi Aplikasi Bengkel Home Service

## Daftar Isi

1. [Gambaran Umum](#gambaran-umum)
2. [Tech Stack](#tech-stack)
3. [Instalasi & Setup](#instalasi-setup)
4. [Arsitektur Aplikasi](#arsitektur-aplikasi)
5. [Database & Model](#database-model)
6. [Fitur Utama](#fitur-utama)
7. [Routing & API](#routing-api)
8. [Frontend](#frontend)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## Gambaran Umum

**Bengkel Home Service (ASM MOTOR)** adalah aplikasi booking servis motor panggilan
berbasis web. Pelanggan dapat memesan layanan servis motor (ganti oli, tune up,
perbaikan ringan) yang dikerjakan langsung di lokasi pelanggan oleh mekanik keliling.

### Tujuan Aplikasi

- Menyediakan platform booking online untuk servis motor home service
- Mengelola paket layanan dan item servis custom
- Menghitung biaya transport berdasarkan jarak
- Memvalidasi area coverage layanan
- Menyediakan dashboard admin untuk manajemen booking dan analitik

### Lokasi Operasional

Karawang, Jawa Barat, Indonesia (area coverage mencakup Karawang Barat, Timur, Kota,
dan sekitarnya dalam radius operasional).

---

## Tech Stack

### Backend

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| PHP | 8.4 | Runtime |
| Laravel | 13 | Framework utama |
| Inertia.js | 3 | Bridge server-client |
| Fortify | 1 | Autentikasi |
| Wayfinder | 0.x | Typed route generation |
| Pest | 4 | Testing framework |
| Pint | 1 | Code formatter |
| Sail | 1 | Docker dev environment |

### Frontend

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Svelte | 5 | UI framework |
| Tailwind CSS | 4 | Utility-first CSS |
| Vite | 8 | Build tool |
| Leaflet | 1.9 | Peta interaktif |
| Lucide Svelte | 0.468 | Icon library |
| bits-ui | 2.15 | Headless UI components |
| svelte-sonner | 0.3 | Toast notifications |

### Database

- MySQL (default)
- SQLite (development alternatif)

---

## Instalasi & Setup

### Prasyarat

- PHP >= 8.3
- Composer
- Node.js & npm
- MySQL / MariaDB
- Git

### Langkah Instalasi

```bash
# 1. Clone repository
git clone <repository-url>
cd aplikasi-bengkel

# 2. Install dependencies
composer install
npm install

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Konfigurasi database di .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=aplikasi_bengkel
# DB_USERNAME=root
# DB_PASSWORD=

# 5. Jalankan migrasi dan seeder
php artisan migrate
php artisan db:seed

# 6. Build frontend assets
npm run build

# 7. Jalankan development server
composer run dev
# Atau manual:
# php artisan serve
# npm run dev (di terminal terpisah)
```

### Shortcut Setup (Composer Script)

```bash
composer run setup
```

Script ini otomatis menjalankan: install dependencies, copy .env, generate key,
migrate, install npm, dan build assets.

### Environment Variables Penting

| Variable | Keterangan | Default |
|----------|------------|---------|
| `APP_NAME` | Nama aplikasi | Bengkel Home Service |
| `APP_TIMEZONE` | Timezone | Asia/Jakarta |
| `APP_LOCALE` | Locale | id |
| `WORKSHOP_CONTACT_PHONE` | Nomor telepon bengkel | - |
| `WORKSHOP_CONTACT_WHATSAPP` | Nomor WhatsApp bengkel | - |
| `WORKSHOP_FOOTER_ADDRESS` | Alamat bengkel | Jl. Badami Ciherang... |
| `WORKSHOP_FOOTER_LATITUDE` | Latitude lokasi bengkel | -6.3025000 |
| `WORKSHOP_FOOTER_LONGITUDE` | Longitude lokasi bengkel | 107.3035000 |
| `WORKSHOP_TRANSPORT_FREE_RADIUS_KM` | Radius gratis ongkir (km) | 10 |
| `WORKSHOP_TRANSPORT_FEE_PER_KM` | Biaya per km di luar radius | 5000 |

---

## Arsitektur Aplikasi

### Struktur Direktori Utama

```
aplikasi-bengkel/
├── app/
│   ├── Actions/              # Business logic (single-responsibility)
│   │   ├── Booking/          # Aksi terkait booking
│   │   ├── CustomServiceItem/# Aksi item servis custom
│   │   ├── Fortify/          # Aksi autentikasi
│   │   ├── ServicePackage/   # Aksi paket servis
│   │   └── Visitor/          # Aksi tracking visitor
│   ├── Concerns/             # Shared traits
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/        # Controller panel admin
│   │   │   ├── Public/       # Controller halaman publik
│   │   │   └── Settings/     # Controller pengaturan user
│   │   ├── Middleware/       # HTTP middleware
│   │   └── Requests/         # Form request validation
│   ├── Models/               # Eloquent models
│   └── Support/
│       └── Enums/            # PHP enums
├── config/
│   ├── booking.php           # Konfigurasi booking
│   └── workshop.php          # Konfigurasi bengkel
├── database/
│   ├── factories/            # Model factories
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
├── resources/
│   └── js/
│       ├── components/       # Svelte components
│       │   ├── admin/        # Komponen admin
│       │   ├── public/       # Komponen publik
│       │   └── ui/           # UI primitives (shadcn-svelte)
│       ├── layouts/          # Layout templates
│       └── pages/            # Inertia pages
│           ├── admin/        # Halaman admin
│           ├── auth/         # Halaman autentikasi
│           ├── public/       # Halaman publik
│           └── settings/     # Halaman pengaturan
├── routes/
│   ├── web.php               # Route utama
│   └── settings.php          # Route pengaturan
└── tests/
    ├── Feature/              # Feature tests
    └── Unit/                 # Unit tests
```

### Pola Arsitektur

#### Actions Pattern

Aplikasi menggunakan pola **Actions** untuk memisahkan business logic dari controller.
Setiap action adalah class dengan satu tanggung jawab tunggal.

```
app/Actions/Booking/
├── CalculateBookingPriceAction.php    # Hitung total harga booking
├── CalculateTransportChargeAction.php # Hitung biaya transport
├── CreateBookingAction.php            # Buat booking baru
├── DeleteBookingAction.php            # Hapus booking
├── GenerateBookingCodeAction.php      # Generate kode booking unik
├── GetBookingFooterLocationAction.php # Ambil lokasi footer
├── GetBookingServiceFeeAction.php     # Ambil biaya jasa
├── GetBookingTransportChargeSettingsAction.php # Ambil setting transport
├── GetPublicBookingPageDataAction.php # Data untuk halaman booking publik
├── UpdateBookingFooterLocationAction.php # Update lokasi footer
├── UpdateBookingNotesAction.php       # Update catatan booking
├── UpdateBookingServiceFeeAction.php  # Update biaya jasa
├── UpdateBookingStatusAction.php      # Update status booking
├── UpdateBookingTransportChargeAction.php # Update biaya transport
├── ValidateBookingSlotAction.php      # Validasi ketersediaan slot
└── ValidateCoverageAreaAction.php     # Validasi area coverage
```

#### Enums

```php
// BookingStatus: pending, confirmed, on_the_way, completed, cancelled, rescheduled
// MotorcycleType: matic, bebek, sport, lainnya
// PackageType: fixed_package, custom_package
```

#### Price Snapshot

Saat booking dibuat, nama dan harga paket/item di-snapshot ke dalam record booking.
Ini memastikan perubahan harga di masa depan tidak mempengaruhi booking yang sudah ada.

---

## Database & Model

### Entity Relationship Diagram (Konseptual)

```
┌─────────────────┐       ┌──────────────────────┐
│  ServicePackage │       │  ServicePackageItem   │
├─────────────────┤       ├──────────────────────┤
│ id              │──┐    │ id                   │
│ name            │  │    │ service_package_id   │──┐
│ slug            │  │    │ name                 │  │
│ short_description│  │    │ description          │  │
│ description     │  └───>│ display_order        │  │
│ price           │       └──────────────────────┘  │
│ duration_estimate│                                  │
│ is_active       │                                  │
│ display_order   │                                  │
└─────────────────┘                                  │
        │                                            │
        │ (nullable FK)                              │
        ▼                                            │
┌─────────────────────────────────────────────┐     │
│                  Booking                     │     │
├─────────────────────────────────────────────┤     │
│ id, booking_code                            │     │
│ customer_name, customer_email, customer_phone│     │
│ motorcycle_type, motorcycle_brand/model/year │     │
│ plate_number                                │     │
│ package_type, service_package_id            │◄────┘
│ package_name_snapshot, package_price_snapshot │
│ notes, service_date, service_time           │
│ status                                      │
│ subtotal_price, service_fee                 │
│ transport_distance_km, transport_charge     │
│ total_price                                 │
│ address_text, house_landmark                │
│ latitude, longitude                         │
│ admin_notes, requires_manual_review         │
│ confirmed_at, completed_at                  │
└─────────────────────────────────────────────┘
        │                    │
        │                    │
        ▼                    ▼
┌──────────────────┐  ┌──────────────────────┐
│ BookingCustomItem│  │  BookingStatusLog     │
├──────────────────┤  ├──────────────────────┤
│ id               │  │ id                   │
│ booking_id       │  │ booking_id           │
│ custom_service_  │  │ old_status           │
│   item_id        │  │ new_status           │
│ item_name_snapshot│  │ changed_by (user_id) │
│ item_price_snapshot│ │ note                 │
│ qty              │  └──────────────────────┘
│ subtotal         │
└──────────────────┘
        │
        │ (nullable FK)
        ▼
┌──────────────────────┐
│  CustomServiceItem   │
├──────────────────────┤
│ id                   │
│ name, slug           │
│ category             │
│ description          │
│ price                │
│ unit_label           │
│ is_active            │
│ display_order        │
└──────────────────────┘

┌──────────────────┐    ┌──────────────────┐
│  BookingSetting  │    │   VisitorLog     │
├──────────────────┤    ├──────────────────┤
│ id               │    │ id               │
│ service_fee      │    │ visit_date       │
│ transport_free_  │    │ ip_hash          │
│   radius_km      │    │ session_key      │
│ transport_fee_   │    │ path             │
│   per_km         │    │ referrer         │
│ footer_address   │    │ user_agent       │
│ footer_latitude  │    │ is_unique_daily  │
│ footer_longitude │    └──────────────────┘
└──────────────────┘
```

### Deskripsi Tabel

#### `service_packages`
Paket layanan servis tetap yang ditawarkan bengkel.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| name | string | Nama paket |
| slug | string (unique) | URL-friendly identifier |
| short_description | string(255) | Deskripsi singkat |
| description | text | Deskripsi lengkap |
| price | unsigned int | Harga dalam Rupiah |
| duration_estimate_minutes | unsigned int | Estimasi durasi (menit) |
| is_active | boolean | Status aktif |
| display_order | unsigned int | Urutan tampilan |

#### `service_package_items`
Item-item yang termasuk dalam sebuah paket servis.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| service_package_id | FK | Relasi ke service_packages |
| name | string | Nama item |
| description | text | Deskripsi item |
| display_order | unsigned int | Urutan tampilan |

#### `custom_service_items`
Item servis satuan yang bisa dipilih pelanggan secara custom.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| name | string | Nama item |
| slug | string (unique) | URL-friendly identifier |
| category | string | Kategori item |
| description | text | Deskripsi |
| price | unsigned int | Harga satuan (Rupiah) |
| unit_label | string | Label satuan (misal: "liter") |
| is_active | boolean | Status aktif |
| display_order | unsigned int | Urutan tampilan |

#### `bookings`
Record booking pelanggan.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| booking_code | string (unique) | Kode booking (prefix: ASM) |
| customer_name | string(100) | Nama pelanggan |
| customer_email | string(100) | Email pelanggan |
| customer_phone | string(30) | Nomor telepon |
| motorcycle_type | enum | Tipe motor (matic/bebek/sport/lainnya) |
| motorcycle_brand | string(100) | Merek motor |
| motorcycle_model | string(100) | Model motor |
| motorcycle_year | string(4) | Tahun motor |
| plate_number | string(20) | Nomor plat |
| package_type | enum | Tipe paket (fixed/custom) |
| service_package_id | FK (nullable) | Relasi ke paket tetap |
| package_name_snapshot | string | Snapshot nama paket saat booking |
| package_price_snapshot | unsigned int | Snapshot harga paket |
| notes | text | Catatan pelanggan |
| service_date | date | Tanggal servis |
| service_time | string(5) | Jam servis (HH:MM) |
| status | enum | Status booking |
| subtotal_price | unsigned int | Subtotal harga |
| service_fee | unsigned int | Biaya jasa |
| transport_distance_km | decimal(8,2) | Jarak transport (km) |
| transport_charge | unsigned int | Biaya transport |
| total_price | unsigned int | Total harga akhir |
| address_text | text | Alamat lengkap |
| house_landmark | string(255) | Patokan rumah |
| latitude | decimal(10,7) | Koordinat latitude |
| longitude | decimal(10,7) | Koordinat longitude |
| admin_notes | text | Catatan admin |
| requires_manual_review | boolean | Perlu review manual |
| confirmed_at | timestamp | Waktu konfirmasi |
| completed_at | timestamp | Waktu selesai |

#### `booking_custom_items`
Item custom yang dipilih dalam sebuah booking.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| booking_id | FK | Relasi ke bookings |
| custom_service_item_id | FK (nullable) | Relasi ke custom_service_items |
| item_name_snapshot | string | Snapshot nama item |
| item_price_snapshot | unsigned int | Snapshot harga item |
| qty | unsigned int | Jumlah |
| subtotal | unsigned int | Subtotal (harga × qty) |

#### `booking_status_logs`
Audit trail perubahan status booking.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| booking_id | FK | Relasi ke bookings |
| old_status | string (nullable) | Status sebelumnya |
| new_status | string | Status baru |
| changed_by | FK (nullable) | User yang mengubah |
| note | string(500) | Catatan perubahan |

#### `booking_settings`
Pengaturan global booking (singleton row).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| service_fee | unsigned int | Biaya jasa default |
| transport_free_radius_km | decimal | Radius gratis transport |
| transport_fee_per_km | unsigned int | Biaya per km |
| footer_address | string | Alamat footer |
| footer_latitude | decimal | Latitude footer |
| footer_longitude | decimal | Longitude footer |

#### `visitor_logs`
Log kunjungan halaman (privacy-friendly, IP di-hash).

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| visit_date | date | Tanggal kunjungan |
| ip_hash | string(64) | Hash IP pengunjung |
| session_key | string(120) | Session identifier |
| path | string(255) | Path halaman |
| referrer | string(255) | Referrer URL |
| user_agent | text | User agent browser |
| is_unique_daily | boolean | Kunjungan unik harian |

---

## Fitur Utama

### 1. Landing Page Publik

Halaman utama yang menampilkan:
- Hero section dengan tagline bengkel
- Highlight layanan (Servis Rutin, Ganti Oli, Perbaikan Darurat)
- Paket servis aktif dari database
- Cara kerja booking (3 langkah)
- Area coverage layanan
- FAQ
- Testimonial pelanggan
- CTA menuju form booking

### 2. Sistem Booking

#### Alur Booking Pelanggan

```
Landing Page → Form Booking → Review → Submit → Halaman Sukses
```

1. **Pilih Paket** — Fixed package (paket tetap) atau custom package (pilih item sendiri)
2. **Info Motor** — Tipe, merek, model, tahun, plat nomor
3. **Pilih Jadwal** — Tanggal dan jam servis (slot tersedia: 08:00-16:00)
4. **Tentukan Lokasi** — Alamat, patokan rumah, pin di peta (Leaflet)
5. **Review & Submit** — Ringkasan harga termasuk biaya jasa dan transport

#### Validasi Booking

- **Slot Capacity**: Maksimal 3 booking per slot waktu
- **Coverage Area**: Bounding box check (latitude/longitude)
- **Rate Limiting**: Maksimal 5 percobaan per 10 menit per device
- **Out-of-area**: Booking di luar area otomatis ditandai `requires_manual_review`

#### Perhitungan Harga

```
Total = Subtotal Paket/Item + Service Fee + Transport Charge

Transport Charge:
- Jarak ≤ free_radius_km (default 10km) → Rp 0
- Jarak > free_radius_km → (jarak - free_radius) × fee_per_km (default Rp5.000/km)
```

### 3. Manajemen Booking (Admin)

#### Status Workflow

```
Pending → Confirmed → On The Way → Completed
    │         │
    └─────────┴──→ Cancelled
    │
    └──→ Rescheduled
```

Fitur admin:
- Lihat daftar semua booking (filter, search)
- Detail booking lengkap
- Update status booking (dengan catatan)
- Tambah admin notes
- Hapus booking
- Audit trail perubahan status

### 4. Manajemen Paket Servis (Admin)

- CRUD paket servis (nama, deskripsi, harga, estimasi durasi)
- Kelola item dalam paket (nama, deskripsi, urutan)
- Aktivasi/deaktivasi paket
- Pengaturan urutan tampilan

### 5. Manajemen Item Servis Custom (Admin)

- CRUD item servis custom (nama, kategori, harga, satuan)
- Deaktivasi item
- Pengaturan urutan tampilan

### 6. Pengaturan Booking (Admin)

- **Service Fee**: Biaya jasa yang ditambahkan ke setiap booking
- **Transport Charge**: Radius gratis dan biaya per km
- **Footer Location**: Alamat dan koordinat bengkel (titik awal perhitungan jarak)

### 7. Analitik Visitor

- Tracking kunjungan halaman (privacy-friendly, IP di-hash)
- Statistik kunjungan harian
- Unique visitor per hari
- Chart visualisasi

### 8. Autentikasi & Keamanan

- Login admin (Laravel Fortify)
- Two-Factor Authentication (2FA)
- Password reset
- Profile management
- Session management

---

## Routing & API

### Route Publik

| Method | URI | Nama | Keterangan |
|--------|-----|------|------------|
| GET | `/` | home | Landing page |
| GET | `/booking` | bookings.create | Form booking |
| POST | `/bookings` | bookings.store | Submit booking |
| GET | `/booking/success` | bookings.success | Halaman sukses |
| GET | `/booking/{code}` | bookings.public.show | Detail booking publik |

### Route Admin (prefix: `/admin`, middleware: `auth`)

| Method | URI | Nama | Keterangan |
|--------|-----|------|------------|
| GET | `/admin/dashboard` | admin.dashboard | Dashboard |
| GET | `/admin/bookings` | admin.bookings.index | Daftar booking |
| GET | `/admin/bookings/{code}` | admin.bookings.show | Detail booking |
| PATCH | `/admin/bookings/{code}/status` | admin.bookings.update-status | Update status |
| PATCH | `/admin/bookings/{code}/notes` | admin.bookings.update-notes | Update catatan |
| DELETE | `/admin/bookings/{code}` | admin.bookings.destroy | Hapus booking |
| GET | `/admin/service-packages` | admin.service-packages.index | Daftar paket |
| POST | `/admin/service-packages` | admin.service-packages.store | Buat paket |
| GET | `/admin/service-packages/{id}/edit` | admin.service-packages.edit | Edit paket |
| PATCH | `/admin/service-packages/{id}` | admin.service-packages.update | Update paket |
| PATCH | `/admin/service-packages/{id}/activate` | admin.service-packages.activate | Aktifkan |
| PATCH | `/admin/service-packages/{id}/deactivate` | admin.service-packages.deactivate | Nonaktifkan |
| DELETE | `/admin/service-packages/{id}` | admin.service-packages.destroy | Hapus paket |
| GET | `/admin/custom-service-items` | admin.custom-service-items.index | Daftar item |
| POST | `/admin/custom-service-items` | admin.custom-service-items.store | Buat item |
| GET | `/admin/custom-service-items/{id}/edit` | admin.custom-service-items.edit | Edit item |
| PATCH | `/admin/custom-service-items/{id}` | admin.custom-service-items.update | Update item |
| PATCH | `/admin/custom-service-items/{id}/deactivate` | admin.custom-service-items.deactivate | Nonaktifkan |
| DELETE | `/admin/custom-service-items/{id}` | admin.custom-service-items.destroy | Hapus item |
| PATCH | `/admin/booking-settings/service-fee` | admin.booking-settings.service-fee | Update fee |
| PATCH | `/admin/booking-settings/footer-location` | admin.booking-settings.footer-location | Update lokasi |
| PATCH | `/admin/booking-settings/transport-charge` | admin.booking-settings.transport-charge | Update transport |
| GET | `/admin/visitors` | admin.visitors.index | Analitik visitor |

### Route Settings (middleware: `auth`)

| Method | URI | Nama | Keterangan |
|--------|-----|------|------------|
| GET | `/settings/profile` | profile.edit | Edit profil |
| PATCH | `/settings/profile` | profile.update | Update profil |
| DELETE | `/settings/profile` | profile.destroy | Hapus akun |
| GET | `/settings/security` | security.edit | Keamanan |
| PUT | `/settings/password` | user-password.update | Update password |
| GET | `/settings/appearance` | appearance.edit | Tampilan |

---

## Frontend

### Halaman (Inertia Pages)

#### Publik (`resources/js/pages/public/`)

| File | Keterangan |
|------|------------|
| LandingPage.svelte | Halaman utama dengan info layanan |
| BookingPage.svelte | Form booking multi-step |
| BookingSummaryPage.svelte | Detail booking setelah submit |
| BookingSuccessPage.svelte | Konfirmasi booking berhasil |

#### Admin (`resources/js/pages/admin/`)

| File | Keterangan |
|------|------------|
| DashboardPage.svelte | Dashboard statistik |
| BookingsIndexPage.svelte | Daftar semua booking |
| BookingDetailPage.svelte | Detail & manajemen booking |
| ServicePackagesPage.svelte | CRUD paket servis |
| CustomServiceItemsPage.svelte | CRUD item custom |
| VisitorsPage.svelte | Analitik pengunjung |
| auth/LoginPage.svelte | Halaman login admin |

#### Settings (`resources/js/pages/settings/`)

| File | Keterangan |
|------|------------|
| Profile.svelte | Edit profil user |
| Security.svelte | Password & 2FA |
| Appearance.svelte | Tema tampilan |

### Komponen Utama

#### Komponen Publik (`resources/js/components/public/`)

| Komponen | Keterangan |
|----------|------------|
| HeroSection | Banner utama landing page |
| ServiceHighlights | Highlight layanan |
| PackageCardsSection | Kartu paket servis |
| HowItWorksSection | Langkah-langkah booking |
| CoverageAreaSection | Peta area layanan |
| FaqSection | Frequently Asked Questions |
| TestimonialsSection | Testimoni pelanggan |
| BookingCtaSection | Call-to-action booking |
| BookingForm | Form booking utama |
| BookingPackageSelector | Pemilih paket |
| BookingCustomItemsSelector | Pemilih item custom |
| BookingMotorInfoFields | Input info motor |
| BookingSchedulePicker | Pemilih jadwal |
| BookingLocationPicker | Pemilih lokasi (peta) |
| BookingPriceSummary | Ringkasan harga |
| BookingReviewPanel | Panel review sebelum submit |
| PublicHeader | Header halaman publik |
| PublicFooter | Footer dengan peta |

#### Komponen Admin (`resources/js/components/admin/`)

| Komponen | Keterangan |
|----------|------------|
| AdminHeader | Header panel admin |
| AdminSidebar | Sidebar navigasi admin |
| BookingsTable | Tabel daftar booking |
| BookingDetailCard | Kartu detail booking |
| BookingStatusBadge | Badge status booking |
| StatusHistoryTimeline | Timeline riwayat status |
| BookingServiceFeeCard | Pengaturan biaya jasa |
| BookingTransportChargeCard | Pengaturan transport |
| BookingFooterLocationCard | Pengaturan lokasi |
| ServicePackageForm | Form paket servis |
| ServicePackageItemsEditor | Editor item paket |
| CustomServiceItemForm | Form item custom |
| DashboardStatCard | Kartu statistik dashboard |
| VisitorsChart | Chart pengunjung |
| CopyValueButton | Tombol salin nilai |

#### UI Components (`resources/js/components/ui/`)

Menggunakan komponen headless dari **bits-ui** dengan styling Tailwind CSS
(pola shadcn-svelte):

- Alert, Avatar, Badge, Breadcrumb, Button, Card
- Checkbox, Collapsible, Dialog, Dropdown Menu
- Input, Input OTP, Label, Navigation Menu
- Select, Separator, Sheet, Sidebar
- Skeleton, Sonner (toast), Spinner, Tooltip

---

## Testing

### Framework

- **Pest v4** (PHP testing framework di atas PHPUnit)
- Test runner: `php artisan test --compact`

### Struktur Test

```
tests/
├── Feature/
│   ├── Admin/
│   │   ├── BookingFooterLocationManagementTest.php
│   │   ├── BookingManagementTest.php
│   │   ├── BookingServiceFeeManagementTest.php
│   │   ├── BookingTransportChargeManagementTest.php
│   │   ├── CustomServiceItemManagementTest.php
│   │   ├── ServicePackageManagementTest.php
│   │   └── VisitorAnalyticsTest.php
│   ├── Auth/
│   │   ├── AuthenticationTest.php
│   │   ├── EmailVerificationTest.php
│   │   ├── PasswordConfirmationTest.php
│   │   ├── PasswordResetTest.php
│   │   ├── RegistrationTest.php
│   │   ├── TwoFactorChallengeTest.php
│   │   └── VerificationNotificationTest.php
│   ├── Booking/
│   │   ├── BookingEmailConfirmationTest.php
│   │   ├── BookingPublicPagesTest.php
│   │   ├── BookingTransportChargeTest.php
│   │   └── StoreBookingTest.php
│   ├── Settings/
│   │   ├── ProfileUpdateTest.php
│   │   └── SecurityTest.php
│   └── Visitor/
│       └── TrackVisitorMiddlewareTest.php
├── Unit/
├── Browser/                    # Pest Browser tests (Playwright)
├── Pest.php
└── TestCase.php
```

### Menjalankan Test

```bash
# Semua test
php artisan test --compact

# Filter test tertentu
php artisan test --compact --filter=StoreBookingTest

# Dengan coverage
php artisan test --coverage
```

### Linting & Formatting

```bash
# PHP (Pint)
vendor/bin/pint --dirty --format agent

# JavaScript/Svelte (ESLint + Prettier)
npm run lint        # Fix lint issues
npm run lint:check  # Check only
npm run format      # Format files
npm run format:check # Check formatting

# TypeScript check
npm run types:check
```

### CI/CD

GitHub Actions workflows tersedia di `.github/workflows/`:
- `lint.yml` — Linting check
- `tests.yml` — Test suite

---

## Deployment

### Prasyarat Production

- PHP 8.3+ dengan ekstensi yang diperlukan
- MySQL 8.0+
- Node.js (untuk build assets)
- Web server (Nginx/Apache)

### Langkah Deploy

```bash
# 1. Install dependencies (production)
composer install --no-dev --optimize-autoloader
npm ci

# 2. Build frontend
npm run build

# 3. Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 4. Migrasi database
php artisan migrate --force

# 5. Set permissions
chmod -R 775 storage bootstrap/cache
```

### Laravel Cloud

Aplikasi ini dapat di-deploy menggunakan [Laravel Cloud](https://cloud.laravel.com/)
untuk deployment dan scaling yang lebih mudah.

---

## Konfigurasi

### `config/booking.php`

```php
return [
    'code_prefix' => 'ASM',           // Prefix kode booking
    'max_per_slot' => 3,               // Maks booking per slot
    'default_service_fee' => 0,        // Biaya jasa default
    'slot_interval_minutes' => 60,     // Interval slot (menit)
    'available_hours' => [             // Jam operasional
        '08:00', '09:00', '10:00', '11:00',
        '13:00', '14:00', '15:00', '16:00',
    ],
    'rate_limit' => [
        'max_attempts' => 5,           // Maks percobaan
        'decay_seconds' => 600,        // Cooldown (detik)
    ],
];
```

### `config/workshop.php`

```php
return [
    'brand_name' => env('APP_NAME', 'ASM MOTOR'),
    'tagline' => 'Servis ringan motor panggilan...',
    'contact_phone' => env('WORKSHOP_CONTACT_PHONE'),
    'contact_whatsapp' => env('WORKSHOP_CONTACT_WHATSAPP'),
    'footer_location' => [
        'address' => env('WORKSHOP_FOOTER_ADDRESS'),
        'latitude' => env('WORKSHOP_FOOTER_LATITUDE'),
        'longitude' => env('WORKSHOP_FOOTER_LONGITUDE'),
    ],
    'transport_charge' => [
        'free_radius_km' => env('WORKSHOP_TRANSPORT_FREE_RADIUS_KM', '10'),
        'fee_per_km' => env('WORKSHOP_TRANSPORT_FEE_PER_KM', '5000'),
    ],
    'service_areas' => [...],          // Daftar area layanan
    'coverage' => [
        'bounding_box' => [            // Batas area coverage
            'min_latitude' => -6.75,
            'max_latitude' => -6.05,
            'min_longitude' => 106.55,
            'max_longitude' => 107.05,
        ],
    ],
    'landing' => [                     // Konten landing page
        'seo' => [...],
        'highlights' => [...],
        'how_it_works' => [...],
        'coverage' => [...],
        'faqs' => [...],
        'testimonials' => [...],
        'cta' => [...],
    ],
];
```

---

## Seeder Data

Aplikasi menyediakan seeder untuk data awal:

```bash
php artisan db:seed
```

Seeder yang tersedia:
- `AdminSeeder` — Membuat akun admin default
- `ServicePackageSeeder` — Paket servis contoh
- `CustomServiceItemSeeder` — Item servis custom contoh

---

## Scripts Tersedia

### Composer Scripts

| Script | Keterangan |
|--------|------------|
| `composer run setup` | Setup lengkap project |
| `composer run dev` | Jalankan dev server (Laravel + Queue + Vite) |
| `composer run lint` | Format PHP dengan Pint |
| `composer run lint:check` | Check formatting PHP |
| `composer run test` | Jalankan semua test |
| `composer run ci:check` | Full CI check (lint + format + types + test) |

### NPM Scripts

| Script | Keterangan |
|--------|------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Build production assets |
| `npm run build:ssr` | Build dengan SSR |
| `npm run lint` | ESLint fix |
| `npm run lint:check` | ESLint check |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check |
| `npm run types:check` | Svelte/TypeScript type check |

---

## Lisensi

MIT License
