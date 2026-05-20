# Dokumentasi Project: ngopidulur

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
| Decap CMS | ^3.3.3 | Admin UI untuk kelola konten |
| Biome | ^2.3.8 | Linter & formatter |
| Sharp | ^0.34.5 | Image optimization |

---

## Struktur Project

```
ngopidulur/
├── public/                    # File statis (langsung di-serve)
│   ├── admin/                 # Decap CMS
│   │   ├── config.yml         # Konfigurasi CMS (collections, fields)
│   │   └── index.html         # Entry point CMS
│   ├── image/                 # Gambar untuk artikel
│   ├── favicon.ico
│   ├── logo.png
│   └── profile.png            # Avatar user
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
│   │   ├── friend.astro       # Friend links page
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
├── tsconfig.json              # TypeScript config
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
  menu: [...]              # Navigasi menu

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
- npm (sudah terinstall)

### Commands

```sh
# Running Decap Server
npx decap-server
http://localhost:4321/admin/index.html

# Install dependencies
npm install

# Development server (http://localhost:4321)
npm run dev

# Build untuk production
npm run build

# Preview build result
npm run preview

# Type checking
npm run check

# Linting
npm run lint

# Format code
npm run format

# Generate search index (jalankan sebelum dev pertama kali)
npm run search:index
```

### Pertama Kali Setup

```sh
npm install
npm run search:index    # Generate Pagefind search index
npm run dev             # Start dev server
```

### Workflow Harian

```sh
npm run dev             # Start dev server
# Edit artikel via /admin atau langsung di file
# Ctrl+C untuk stop
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

1. Build di lokal: `npm run build`
2. Upload isi folder `dist/` ke `public_html`
3. ⚠️ Decap CMS `/admin` tidak akan berfungsi (butuh OAuth)

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
**Solusi:** Jalankan `npm run search:index` sebelum `npm run dev`.

---

## Referensi

- [Astro Documentation](https://docs.astro.build/)
- [Frosti Theme](https://github.com/EveSunMaple/Frosti)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [daisyUI Themes](https://daisyui.com/docs/themes/)
- [Iconify Icons](https://icon-sets.iconify.design/)
- [Tailwind CSS](https://tailwindcss.com/docs)
