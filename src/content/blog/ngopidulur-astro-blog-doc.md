---
title: Ngopidulur Astro Blog Doc
description: Dokumentasi Projek blog ngopidulur.my.id yang di build dengan Astro
pubDate: 2026-05-21T23:20:00.000Z
draft: false
categories:
  - Documentation
tags:
  - documentation
  - astro
---
# Dokumentasi Project: ngopidulur-astro

> Blog pribadi statis menggunakan Frosti theme + Astro 6 + Decap CMS

---

## Daftar Isi

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Struktur Project](#struktur-project)
- [Konfigurasi](#konfigurasi)
- [Content Management (Decap CMS)](#content-management-decap-cms)
- [Menulis Artikel](#menulis-artikel)
- [Development](#development)
- [Deployment](#deployment)
- [Perubahan yang Dilakukan](#perubahan-yang-dilakukan)
- [Troubleshooting](#troubleshooting)

---

## Overview

Project ini adalah blog pribadi statis yang dibangun menggunakan:
- **[Frosti](https://github.com/EveSunMaple/Frosti)** v3.3.3 — template blog untuk Astro
- **[Astro](https://astro.build/)** v6.3.6 — framework web untuk content-driven websites
- **[Decap CMS](https://decapcms.org/)** — open-source, Git-based CMS untuk mengelola konten via browser

Blog ini menghasilkan **file HTML statis** saat di-build, sehingga sangat cepat dan bisa di-deploy di hosting manapun.

---

## Tech Stack

| Teknologi | Versi | Fungsi |
|---|---|---|
| Astro | ^6.3.6 | Framework utama |
| Tailwind CSS | ^3.4.18 | Styling utility-first |
| daisyUI | ^4.12.24 | Komponen UI (tema light/dark) |
| MDX | ^5.0.6 | Markdown + komponen interaktif |
| Expressive Code | ^0.41.3 | Syntax highlighting code blocks |
| KaTeX | ^0.16.25 | Render rumus matematika |
| Pagefind | ^1.4.0 | Search engine statis (client-side) |
| @astrojs/rss | ^4.0.18 | Generate RSS feed |
| @astrojs/sitemap | ^3.7.2 | Generate sitemap.xml |
| Decap CMS | 3.3.3 (pinned, lokal) | Admin UI untuk kelola konten |
| Biome | ^2.3.8 | Linter & formatter |
| Sharp | ^0.34.5 | Image optimization |

---

## Struktur Project

```
ngopidulur-astro/
├── public/                    # File statis (langsung di-serve)
│   ├── admin/                 # Decap CMS
│   │   ├── config.yml         # Konfigurasi CMS (collections, fields)
│   │   ├── index.html         # Entry point CMS
│   │   └── decap-cms.js       # Decap CMS bundle (pinned 3.3.3, lokal)
│   ├── image/                 # Gambar untuk artikel
│   ├── pagefind/              # Search index (auto-generated dari `pnpm search:index`)
│   ├── favicon.ico
│   ├── logo.png
│   ├── profile.png            # Avatar user
│   └── profile2.png           # Logo hero homepage
├── src/
│   ├── components/            # Komponen Astro
│   │   ├── mdx/               # Komponen untuk MDX (alerts, collapse, dll)
│   │   ├── sidebar/           # Sidebar components (profile, search, TOC)
│   │   ├── widgets/           # Widget (pagination, theme toggle, dll)
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Navbar.astro
│   │   ├── PostCard.astro
│   │   └── Sidebar.astro
│   ├── content/
│   │   └── blog/              # Artikel blog (Markdown/MDX)
│   ├── i18n/                  # Internationalization
│   │   └── translations.yaml  # Teks UI multi-bahasa
│   ├── interface/             # TypeScript interfaces
│   ├── integration/           # Custom Astro integrations
│   ├── layouts/
│   │   └── BaseLayout.astro   # Layout utama
│   ├── pages/                 # Halaman-halaman situs
│   │   ├── blog/              # Blog routes (list, detail, category, tag)
│   │   ├── og/                # Auto-generated OG images
│   │   ├── admin.astro        # Decap CMS admin page
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # About page
│   │   ├── project.astro      # Project page
│   │   ├── rss.xml.ts         # RSS feed
│   │   └── robots.txt.ts      # Robots.txt
│   ├── plugins/
│   │   └── remark-reading-time.ts  # Plugin estimasi waktu baca
│   ├── styles/
│   │   ├── global.scss        # Global styles
│   │   └── waline.scss        # Comment system styles
│   ├── utils/                 # Utility functions
│   ├── config.ts              # Membaca frosti.config.yaml
│   └── content.config.ts      # Definisi content collections
├── frosti.config.yaml         # KONFIGURASI UTAMA SITUS
├── astro.config.mjs           # Konfigurasi Astro
├── tsconfig.json              # TypeScript config (exclude pagefind & decap-cms.js)
├── biome.json                 # Linter/formatter config
├── package.json               # Dependencies & scripts
└── dist/                      # Output build (jangan edit manual)
```

---

## Konfigurasi

### File Konfigurasi Utama: `frosti.config.yaml`

Semua pengaturan situs ada di file ini:

```yaml
site:
  tab: Frosti              # Teks di browser tab
  title: 💠 Frosti         # Judul situs
  description: ...         # Deskripsi SEO
  language: en             # Bahasa (en/zh/dll)
  favicon: /favicon.ico
  theme:
    light: winter          # Tema terang (daisyUI)
    dark: dracula          # Tema gelap (daisyUI)
    code: github-dark      # Tema code block (Shiki)
  date_format: ddd MMM DD YYYY
  blog:
    pageSize: 8            # Artikel per halaman
  menu: [...]              # Navigasi menu sidebar/navbar

user:
  name: Rifky Awalul Huda  # Nama yang ditampilkan
  site: "https://..."       # URL situs
  avatar: /profile.png      # Path avatar
  sidebar:
    social: [...]           # Social links di sidebar
  footer:
    social: [...]           # Social links di footer
```

**Penting:** Setelah edit `frosti.config.yaml`, restart dev server (`Ctrl+C` lalu `npm run dev` lagi) karena file ini dibaca via `fs.readFileSync` yang tidak hot-reload.

### Catatan Konfigurasi yang Sedang Dipakai

- Menu `Friend`, `Contact`, dan `Examples` sudah dihapus dari `site.menu`. Halaman `friend.astro` juga dihapus dari codebase.
- Kategori sidebar yang aktif: `Tulisan Random`, `Teknologi`, `Documentation`.
- Social icon sidebar dan footer saat ini memakai Facebook, GitHub, LinkedIn, dan X.
- Format icon yang benar mengikuti pola `collection:name`, misalnya `ri:linkedin-line` atau `ri:facebook-line`.
- `user.site` saat ini mengarah ke profil LinkedIn.

### Astro Config: `astro.config.mjs`

Integrasi yang aktif:
- `expressiveCode` — syntax highlighting
- `mdx` — support file .mdx
- `icon` — icon library (Iconify)
- `terser` — JS minification
- `sitemap` — auto-generate sitemap.xml
- `playformCompress` — compress output

Markdown plugins:
- `remarkMath` + `rehypeKatex` — rumus matematika
- `remarkReadingTime` — estimasi waktu baca
- `rehypeExternalLinks` — tambah ↗ di link eksternal

---

## Content Management (Decap CMS)

### Apa itu Decap CMS?

Decap CMS adalah admin UI berbasis web yang memungkinkan kamu membuat dan mengedit artikel blog langsung dari browser, tanpa perlu buka code editor. Perubahan disimpan langsung sebagai file Markdown di repository.

### Cara Akses (Lokal)

1. Buka terminal pertama, jalankan proxy server:
   ```sh
   npx decap-server
   ```

2. Buka terminal kedua, jalankan dev server:
   ```sh
   npm run dev
   ```

3. Buka browser: **http://localhost:4321/admin**

4. Langsung masuk tanpa login (local mode)

### Konfigurasi CMS: `public/admin/config.yml`

```yaml
backend:
  name: git-gateway       # Backend untuk production (Netlify)
  branch: main

local_backend: true       # Enable untuk development lokal (tanpa auth)

media_folder: "public/image"   # Folder upload gambar
public_folder: "/image"        # Path gambar di situs

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "src/content/blog"
    create: true
    fields:
      - title (string, required)
      - description (string, required)
      - pubDate (datetime, required)
      - updated (datetime, optional)
      - image (image, optional)
      - badge (string, optional) — set "Pin" untuk pin artikel
      - draft (boolean, optional) — true = tidak tampil di list
      - categories (list, optional)
      - tags (list, optional)
      - body (markdown)
```

### Catatan: File .md vs .mdx di CMS

Decap CMS hanya menampilkan file dengan ekstensi `.md` (dikonfigurasi via `extension: "md"` di `config.yml`). File `.mdx` **tidak muncul** di CMS dan memang sengaja dikelola terpisah.

**Konvensi:**
- **File `.md`** — Artikel biasa, dikelola via Decap CMS (`/admin`) atau langsung edit file.
- **File `.mdx`** — Artikel yang menggunakan komponen interaktif (import custom components seperti `<Collapse>`, `<Info>`, `<LinkCard>`, dll). Dikelola langsung via code editor karena Decap CMS tidak bisa merender syntax JSX/import.

**Kenapa tidak membuat collection kedua untuk MDX?**
1. Di sisi Astro, semua post (`.md` dan `.mdx`) sudah satu content collection `blog`. Memisahkan di CMS membingungkan.
2. Decap CMS tetap tidak bisa mengedit syntax MDX (import/JSX) dengan benar.
3. Duplikasi konfigurasi fields tanpa manfaat nyata.

Jadi jika ada post yang hanya muncul di situs tapi tidak di CMS, kemungkinan besar itu file `.mdx` — dan itu memang by design.

### Catatan Production

Untuk deploy dengan Decap CMS aktif:
- Deploy ke **Netlify** dan aktifkan **Netlify Identity**
- Hapus/comment `local_backend: true` di config.yml
- User bisa login via email di `/admin`

---

## Menulis Artikel

### Via Decap CMS (Recommended)

1. Buka `/admin` di browser
2. Klik "Blog Posts" → "New Blog Post"
3. Isi field-field yang tersedia
4. Klik "Publish"
5. File Markdown otomatis dibuat di `src/content/blog/`

### Via File Manual

Buat file `.md` di `src/content/blog/` dengan format:

```markdown
---
title: "Judul Artikel"
description: "Deskripsi singkat"
pubDate: 2025-01-15
image: "/image/cover.jpg"
categories:
  - Documentation
tags:
  - astro
  - tutorial
draft: false
---

Isi artikel di sini menggunakan Markdown...
```

### Frontmatter Fields

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| title | string | ✅ | Judul artikel |
| description | string | ✅ | Deskripsi untuk SEO |
| pubDate | date | ✅ | Tanggal publikasi |
| updated | date | ❌ | Tanggal update terakhir |
| image | string | ❌ | Path cover image |
| badge | string | ❌ | Set "Pin" untuk pin di atas |
| draft | boolean | ❌ | true = hidden dari list |
| categories | string[] | ❌ | Kategori artikel |
| tags | string[] | ❌ | Tag artikel |

---

## Development

### Prerequisites

- Node.js >= 18
- pnpm (recommended) atau npm
- Untuk pnpm v10+: jalankan `pnpm approve-builds` saat install pertama untuk approve build scripts dari `esbuild`, `sharp`, `swup`, dan `@parcel/watcher`.

### Commands

> Project ini pakai pnpm. Semua command bisa dijalankan via `pnpm <script>`. Kalau pakai npm, ganti `pnpm` dengan `npm run`.

```sh
# Running Decap Server (terminal 1)
npx decap-server
# Akses CMS: http://localhost:4321/admin

# Install dependencies
pnpm install

# Development server (http://localhost:4321) — terminal 2
pnpm dev

# Build untuk production (build + generate Pagefind index)
pnpm build

# Preview build result
pnpm preview

# Type checking
pnpm check

# Linting (Biome)
pnpm lint

# Format code (Biome)
pnpm format

# Generate search index lalu copy ke public/
pnpm search:index
```

### Pertama Kali Setup

```sh
pnpm install
pnpm approve-builds        # Approve build scripts (pilih semua dengan 'a')
pnpm search:index          # Generate Pagefind search index
pnpm dev                   # Start dev server
```

### Workflow Harian

```sh
pnpm dev                   # Start dev server
# Edit artikel via /admin atau langsung di file
# Ctrl+C untuk stop
```

### Setelah Tambah/Edit Artikel

Search index Pagefind tidak auto-update saat dev. Setelah konten berubah signifikan, regenerate index:

```sh
pnpm build
npx cpy-cli "dist/pagefind/**" "public/pagefind"
```

---

## Deployment

### Opsi 1: Netlify (Recommended — gratis + Decap CMS)

1. Push repo ke GitHub
2. Connect repo di [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Aktifkan Netlify Identity untuk Decap CMS login
6. Hapus `local_backend: true` di `public/admin/config.yml`

### Opsi 2: Shared Hosting / cPanel

#### Persiapan sebelum build

1. Edit `frosti.config.yaml`: ganti `user.site` ke domain produksi (misal `https://ngopidulur.my.id`). Pastikan ada `https://` dan **tanpa trailing slash**.
2. Edit `public/admin/config.yml`: comment baris `local_backend: true` (`# local_backend: true`). Decap CMS local backend cuma untuk dev.

#### Build dan compress

Di lokal:

```sh
pnpm install
pnpm search:index
pnpm build
```

Lalu compress isi `dist/`:

```powershell
Compress-Archive -Path dist\* -DestinationPath dist.zip -Force
```

#### Upload dan extract

1. Login ke cPanel → File Manager.
2. Navigate ke `public_html/` (atau folder subdomain).
3. **PENTING — sebelum upload baru, hapus folder lama yang berpotensi konflik:**

   Lewat cPanel **Terminal**, jalankan:

   ```sh
   cd ~/public_html
   rm -rf blog _astro admin image og pagefind
   ```

   Kalau cPanel kamu tidak punya Terminal, hapus folder-folder ini lewat File Manager.

4. Upload `dist.zip` ke `public_html/`.
5. Extract via File Manager (atau Terminal: `unzip -o dist.zip`).
6. Hapus `dist.zip` setelah extract sukses.

#### Pasang `.htaccess`

Buat file `.htaccess` di `public_html/` dengan isi:

```apache
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Custom 404
ErrorDocument 404 /404.html

# Pretty URLs
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+?)/?$ $1.html [L]

DirectoryIndex index.html

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Security
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

#### Catatan penting

- ⚠️ Decap CMS `/admin` tidak akan berfungsi penuh di shared hosting tanpa Netlify Identity atau OAuth proxy. Untuk update konten, edit di lokal lalu re-deploy.
- Setelah deploy, test halaman kategori (`/blog/category/Teknologi`) dan tag (`/blog/tag/...`). Kalau muncul 404, baca section Troubleshooting di bawah.

### Opsi 3: Vercel / Cloudflare Pages

1. Connect GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Untuk Decap CMS, perlu setup [external OAuth client](https://decapcms.org/docs/external-oauth-clients/)

---

## Perubahan yang Dilakukan

### Integrasi Decap CMS (Mei 2025)

**File baru:**
- `public/admin/config.yml` — Konfigurasi Decap CMS dengan field mapping ke blog collection
- `public/admin/index.html` — Entry point HTML untuk Decap CMS (CDN)
- `src/pages/admin.astro` — Astro page route untuk `/admin`

**Tujuan:** Menambahkan admin UI berbasis web untuk mengelola artikel blog tanpa perlu edit file Markdown secara manual.

### Percobaan CMS yang Tidak Jadi

Selama proses setup, beberapa CMS dicoba tapi tidak kompatibel:

1. **Storyblok** — Berbayar (tidak ada free tier yang mudah diakses)
2. **Keystatic** — Belum support Astro 6 (peer dependency conflict, crash di production)

Kedua percobaan ini sudah di-revert sepenuhnya. Tidak ada sisa kode dari Storyblok atau Keystatic di project.

### Penyesuaian UI dan Konfigurasi (Mei 2026)

**Homepage**
- `src/pages/index.astro`: section `Features` diganti menjadi `Blog Terbaru`.
- Homepage sekarang menampilkan maksimal 6 post terbaru dari collection `blog`.
- Layout daftar post di homepage diubah menjadi grid card ringkas 3 kolom di desktop dan tetap responsif di layar kecil.

**About page**
- `src/pages/about.astro`: tombol sosial pertama di section profil diubah dari GitHub menjadi LinkedIn.
- Link sosial yang dipakai di halaman About sudah menyesuaikan profil LinkedIn dan Facebook terbaru.

**Navigasi**
- `frosti.config.yaml`: menu `Friend` dan `Contact` dihapus dari `site.menu`.
- Halaman `src/pages/friend.astro` masih ada di codebase, tetapi tidak lagi muncul di navigasi utama.

**Footer dan social icons**
- `src/components/Footer.astro` tetap menjadi komponen footer utama yang dipakai oleh `src/layouts/BaseLayout.astro`.
- Data social footer tetap dibaca dari `frosti.config.yaml` melalui `src/config.ts`.
- Icon `ri:cup-line` di konfigurasi social footer diganti menjadi `ri:facebook-line`.
- Icon LinkedIn di konfigurasi memakai format yang benar: `ri:linkedin-line`.

### Maintenance & Code Quality (Mei 2026)

**Update dependency untuk kompatibilitas Astro 6**
- `@astrojs/rss` di-update ke `^4.0.18` (fix error `z.function().returns is not a function`).
- `@astrojs/sitemap` di-update ke `^3.7.2` (fix error `Cannot read properties of undefined (reading 'reduce')`).

**Fix prioritas High dari hasil code review**
- **Decap CMS pinned & lokal**: dependency dari CDN (`https://unpkg.com/decap-cms@^3.3.3`) di `src/pages/admin.astro` dan `public/admin/index.html` diganti ke file lokal `public/admin/decap-cms.js` (versi 3.3.3 di-pin). Mencegah breaking change upstream dan mengurangi attack surface.
- **Race condition di search page**: `src/pages/blog/search.astro` di-refactor agar tidak append script tag duplikat saat user navigate via View Transitions. Ada pengecekan `window.PagefindUI` dan attribute `data-pagefind-loader` untuk reuse instance.
- **A11y/SEO homepage**: `src/pages/index.astro` heading `<h1>` ditambah lagi (`sr-only` agar tetap visual-friendly), gambar hero `profile2.png` ditambah `width`, `height`, dan `fetchpriority="high"` untuk cegah CLS dan prioritaskan loading.

**Schema content collection lebih toleran**
- `src/content.config.ts`: field `updated` sekarang menerima string kosong `""` dari Decap CMS dan otomatis convert ke `undefined`. Mencegah error `Expected type "date", received "object"` saat post baru dibuat lewat CMS tanpa mengisi tanggal update.

**TypeScript config**
- `tsconfig.json`: tambah `exclude` untuk `public/admin/decap-cms.js` (5.3 MB minified) dan `public/pagefind/**`. Mencegah `astro check` out-of-memory saat scan vendor files.

**Cleanup file tidak terpakai**
- Dihapus 14 file yang sudah tidak terpakai:
  - Static assets duplikat: `favicon1.ico`, `profile1.png`, `image/l.png`, `image/r.png`, `image/image2.jpg`, `image/uploaded-screenshot.png`.
  - Frosti updater scripts: `frosti.update.sh`, `.updateignore`, `src/i18n/en.sh`, `src/i18n/zh.sh`.
  - Halaman friend dan komponen pendukungnya: `src/pages/friend.astro`, `src/components/mdx/FriendCard.astro`, `src/components/mdx/Showcase.astro`, `src/components/mdx/LinkCard.astro`.

**Setup MCP Astro Docs (global Kiro)**
- File `~/.kiro/settings/mcp.json` ditambah server `astro-docs` dengan `autoApprove: ["search_astro_docs"]`. AI agent sekarang punya akses ke dokumentasi Astro versi terbaru via MCP tanpa konfirmasi manual.

---

## Troubleshooting

### Config tidak update setelah edit `frosti.config.yaml`

**Penyebab:** File dibaca via `fs.readFileSync` saat module di-import, tidak terdeteksi oleh Vite hot-reload.
**Solusi:** Restart dev server (Ctrl+C → `npm run dev`).

### Decap CMS minta login di localhost

**Penyebab:** `local_backend: true` belum di-set, atau `npx decap-server` belum jalan.
**Solusi:**
1. Pastikan `local_backend: true` ada di `public/admin/config.yml`
2. Jalankan `npx decap-server` di terminal terpisah sebelum akses `/admin`

### `/admin` page not found

**Penyebab:** Astro dev server tidak auto-resolve `index.html` di subfolder `public/`.
**Solusi:** Gunakan route `src/pages/admin.astro` (sudah dibuat). Akses via `http://localhost:4321/admin`.

### Build error setelah install package baru

**Solusi:** Jalankan `npm run check` untuk melihat error. Pastikan `astro.config.mjs` tidak ada import yang broken.

### Search tidak berfungsi

**Penyebab:** Search index belum di-generate.
**Solusi:** Jalankan `pnpm search:index` (atau `npm run search:index`) sebelum `pnpm dev`. Setelah build, copy index ke `public/`:
```sh
npx cpy-cli "dist/pagefind/**" "public/pagefind"
```

### Search page error: "Cannot import non-asset file"

**Penyebab:** Pagefind UI di-import via dynamic `import()` yang diproses Vite, padahal file ada di `public/`.
**Solusi:** Sudah di-fix. `src/pages/blog/search.astro` sekarang load `/pagefind/pagefind-ui.js` via `document.createElement("script")` agar bypass Vite.

### Decap CMS error: "data does not match collection schema (updated: Expected date, received object)"

**Penyebab:** Decap CMS menyimpan field datetime kosong sebagai string `""`, sementara schema Zod lama strict.
**Solusi:** Sudah di-fix di `src/content.config.ts`. Field `updated` sekarang menerima `""` dan otomatis convert ke `undefined`. Tidak perlu action manual.

### `astro check` JavaScript heap out of memory

**Penyebab:** Astro mencoba scan file vendor besar di `public/` (`decap-cms.js`, file Pagefind).
**Solusi:** Sudah di-fix di `tsconfig.json` via `exclude`. Kalau muncul lagi setelah tambah file vendor baru, tambahkan ke `exclude` array.

### Build error: `z.function(...).returns is not a function`

**Penyebab:** `@astrojs/rss` versi lama tidak kompatibel dengan Zod yang dibawa Astro 6.
**Solusi:** Sudah di-fix dengan update ke `@astrojs/rss@^4.0.18`. Kalau ketemu di package lain, update ke versi terbaru.

### pnpm install gagal: `[ERR_PNPM_IGNORED_BUILDS]`

**Penyebab:** pnpm v10+ memblokir postinstall scripts secara default.
**Solusi:** Jalankan `pnpm approve-builds`, pilih semua dengan `a` lalu `Enter`, lalu `pnpm install` lagi.

### Deploy cPanel: kategori atau tag muncul 404 setelah upload

**Gejala:** Halaman seperti `/blog/category/Teknologi` atau `/blog/tag/php` muncul 404, padahal halaman lain (homepage, detail post) jalan normal.

**Penyebab:** Saat extract `dist.zip` di cPanel, folder seperti `blog/category/`, `blog/tag/` sudah ada dari deploy sebelumnya tapi dengan permission/ownership yang rusak. Extract membuat folder tujuan tapi gagal extract `index.html` di dalamnya. Folder kosong = 404.

**Indikator:** Saat extract via Terminal cPanel muncul error seperti:
```
checkdir error: cannot create blog/category/Teknologi
Permission denied
unable to process blog/category/Teknologi/index.html.
```

**Solusi:** Hapus folder bermasalah dulu sebelum re-extract.

Via cPanel **Terminal**:
```sh
cd ~/public_html
rm -rf blog/category blog/tag
# atau lebih bersih: rm -rf blog
unzip -o dist.zip
```

Kalau `rm -rf` juga gagal dengan permission denied:
```sh
chmod -R 755 blog/category blog/tag 2>/dev/null
rm -rf blog/category blog/tag
```

Kalau tetap denied, kontak support hosting untuk reset ownership folder ke akun cPanel kamu.

**Pencegahan:** Sebelum upload deploy baru, **selalu hapus folder lama dulu**. Jangan extract overwrite di atas folder lama.

### Deploy cPanel: situs blank putih atau asset tidak load

**Penyebab umum:**
- `index.html` tidak ada di root `public_html/` (mungkin nested di `public_html/dist/`)
- Folder `_astro/` tidak lengkap (file CSS/JS hilang)
- `USER_SITE` di `frosti.config.yaml` salah saat build

**Solusi:**
1. Pastikan `index.html` ada langsung di `public_html/`, bukan di subfolder
2. Cek Console browser (F12) untuk error 404 spesifik
3. Build ulang dengan `USER_SITE` yang benar di `frosti.config.yaml`

---

## Referensi

- [Astro Documentation](https://docs.astro.build/)
- [Frosti Theme](https://github.com/EveSunMaple/Frosti)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [daisyUI Themes](https://daisyui.com/docs/themes/)
- [Iconify Icons](https://icon-sets.iconify.design/)
- [Tailwind CSS](https://tailwindcss.com/docs)
