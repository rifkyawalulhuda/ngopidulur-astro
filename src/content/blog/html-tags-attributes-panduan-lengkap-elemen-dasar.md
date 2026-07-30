---
title: "HTML Tags dan Attributes: Panduan Lengkap Elemen Dasar HTML"
description: Panduan lengkap HTML tags dan attributes — perbedaan paired vs
  unpaired tags, heading, paragraf, anchor, image, lists (ordered, unordered,
  description), nested lists, form elements, HTML comments, dan struktur
  dokumen HTML yang benar. Dilengkapi contoh kode praktis.
pubDate: 2026-06-29T20:00:00.000Z
image: /image/ui-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - HTML
  - HTMLTags
  - WebDevelopment
  - FrontEnd
  - BelajarHTML
series: "UI Web Dasar"
seriesOrder: 2
---

HTML tags adalah blok bangunan dasar setiap halaman web. Memahami tag-tag ini dan cara kerjanya adalah langkah pertama menuju web development yang sesungguhnya.

## Jenis-Jenis HTML Tags

HTML memiliki dua jenis tag:

### 1. Paired Tags (Non-empty Tags)

Tag yang memiliki tag pembuka dan penutup, berisi konten di antaranya:

```html
<p>Ini adalah paragraf</p>
<h1>Ini adalah heading</h1>
<title>Judul Halaman</title>
```

### 2. Empty Tags (Unpaired Tags)

Tag yang hanya memiliki tag pembuka, tidak berisi konten:

```html
<br/>          <!-- Line break -->
<img src="foto.jpg"/>   <!-- Gambar -->
<input type="text"/>    <!-- Input field -->
<hr/>          <!-- Horizontal rule -->
<meta charset="UTF-8"/>
```

---

## HTML Attributes

Attributes memberikan informasi tambahan atau fungsionalitas pada HTML elements. Ditulis di dalam tag pembuka:

```html
<!-- Syntax -->
<tag attribute="nilai">konten</tag>

<!-- Contoh -->
<img src="gambar.jpg" width="300" height="200" alt="Deskripsi gambar"/>
<input type="text" name="username" placeholder="Masukkan username"/>
<a href="https://google.com" target="_blank">Google</a>
```

**Aturan Attributes:**
- Ditulis di dalam tag pembuka
- Format: `nama="nilai"` (nilai dalam tanda kutip)
- Multiple attributes dipisahkan spasi
- Nilai boleh pakai single quotes atau double quotes

---

## Heading Tags

Heading digunakan untuk judul dan subjudul halaman. Ada 6 level heading — h1 paling besar, h6 paling kecil:

```html
<!doctype html>
<html>
<head>
  <title>Contoh Heading</title>
</head>
<body>
  <h1>Heading Level 1 — Judul Utama</h1>
  <h2>Heading Level 2 — Sub Judul</h2>
  <h3>Heading Level 3</h3>
  <h4>Heading Level 4</h4>
  <h5>Heading Level 5</h5>
  <h6>Heading Level 6 — Terkecil</h6>
</body>
</html>
```

> **SEO Tip:** Search engine menggunakan heading untuk memahami struktur halaman. Gunakan satu `<h1>` per halaman sebagai judul utama.

---

## Paragraf dan Text Tags

```html
<!-- Paragraf -->
<p>Ini paragraf pertama. Browser otomatis menambahkan spasi antar paragraf.</p>
<p>Ini paragraf kedua.</p>

<!-- Abbreviation -->
<p>Bahasa <abbr title="HyperText Markup Language">HTML</abbr> digunakan untuk membuat web.</p>

<!-- Marquee (scrolling text) -->
<marquee width="50%" direction="left">Teks berjalan ke kiri</marquee>
<marquee direction="up" height="100px">Teks berjalan ke atas</marquee>

<!-- Line break -->
<p>Baris pertama<br/>Baris kedua dalam paragraf yang sama</p>

<!-- Horizontal rule -->
<hr/>

<!-- Bold, italic, underline -->
<b>Teks tebal</b>
<i>Teks miring</i>
<u>Teks bergaris bawah</u>
<strong>Teks penting (bold + semantic)</strong>
<em>Teks ditekankan (italic + semantic)</em>
```

---

## Anchor Tag — Hyperlink

Tag `<a>` digunakan untuk membuat hyperlink ke halaman lain, file, atau lokasi dalam halaman:

```html
<!-- Link ke website lain -->
<a href="https://www.google.com">Google</a>
<a href="https://www.gmail.com">Gmail</a>

<!-- Buka di tab baru -->
<a href="https://www.youtube.com" target="_blank">YouTube</a>

<!-- Link ke halaman lokal -->
<a href="about.html">Tentang Kami</a>

<!-- Link ke bagian dalam halaman (anchor) -->
<a href="#section1">Pergi ke Section 1</a>
<h2 id="section1">Section 1</h2>

<!-- Link email -->
<a href="mailto:info@example.com">Kirim Email</a>

<!-- Link telepon -->
<a href="tel:+628123456789">Hubungi Kami</a>
```

---

## Image Tag

Tag `<img>` digunakan untuk menampilkan gambar:

```html
<!-- Gambar dasar -->
<img src="foto.jpg"/>

<!-- Dengan atribut lengkap -->
<img src="animal.jpg" 
     height="180" 
     width="300" 
     alt="Foto seekor rusa"/>

<!-- Gambar dari URL eksternal -->
<img src="https://example.com/gambar.jpg" alt="Gambar online"/>
```

**Atribut `<img>` penting:**
| Atribut | Fungsi |
|---------|--------|
| `src` | Path/URL gambar (wajib) |
| `alt` | Teks alternatif jika gambar gagal load |
| `width` | Lebar gambar (px atau %) |
| `height` | Tinggi gambar (px atau %) |
| `loading` | `lazy` untuk lazy loading |

---

## HTML Comments

Komentar tidak ditampilkan di browser — berguna untuk dokumentasi kode:

```html
<!DOCTYPE html>
<html>
<body>
  <p>Selamat datang di website saya</p>
  <!-- Tag <p> digunakan untuk paragraf -->

  <!-- 
    Ini komentar multi-baris
    Berguna untuk penjelasan panjang
    atau menonaktifkan kode sementara
  -->

  <!-- <p>Paragraf ini dinonaktifkan sementara</p> -->
</body>
</html>
```

---

## HTML Lists

### 1. Ordered List — Daftar Bernomor

```html
<h3>Langkah Membuat Website:</h3>
<ol>
  <li>Pelajari HTML</li>
  <li>Pelajari CSS</li>
  <li>Pelajari JavaScript</li>
  <li>Buat proyek pertama</li>
</ol>

<!-- Tipe angka berbeda -->
<ol type="I">  <!-- Romawi besar: I, II, III -->
<ol type="i">  <!-- Romawi kecil: i, ii, iii -->
<ol type="A">  <!-- Huruf besar: A, B, C -->
<ol type="a">  <!-- Huruf kecil: a, b, c -->

<!-- Mulai dari angka tertentu -->
<ol type="1" start="4">  <!-- Mulai dari 4, 5, 6... -->
```

### 2. Unordered List — Daftar Bullet

```html
<h3>Web Technologies:</h3>
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<!-- Tipe bullet berbeda -->
<ul type="square">   <!-- Kotak -->
<ul type="disc">     <!-- Lingkaran penuh (default) -->
<ul type="circle">   <!-- Lingkaran kosong -->
```

### 3. Description List — Daftar Definisi

```html
<dl>
  <dt>HTML</dt>
  <dd>Digunakan untuk membuat struktur halaman web</dd>
  <dt>CSS</dt>
  <dd>Digunakan untuk menerapkan gaya visual pada halaman web</dd>
  <dt>JavaScript</dt>
  <dd>Digunakan untuk validasi form dan fungsionalitas dinamis</dd>
</dl>
```

### 4. Nested List — List Bersarang

```html
<ol>
  <li>Web Technologies
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Server-Side Technologies
    <ul>
      <li>PHP</li>
      <li>Node.js</li>
      <li>Java</li>
    </ul>
  </li>
  <li>Database
    <ul>
      <li>MySQL</li>
      <li>PostgreSQL</li>
      <li>MongoDB</li>
    </ul>
  </li>
</ol>
```

---

## HTML Tables

Tabel digunakan untuk menampilkan data dalam baris dan kolom:

```html
<table border="1">
  <thead>
    <tr>
      <th>Nama</th>
      <th>Umur</th>
      <th>Kota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Budi</td>
      <td>25</td>
      <td>Jakarta</td>
    </tr>
    <tr>
      <td>Siti</td>
      <td>22</td>
      <td>Bandung</td>
    </tr>
  </tbody>
</table>
```

**Tag Table penting:**
| Tag | Fungsi |
|-----|--------|
| `<table>` | Container tabel |
| `<thead>` | Header tabel |
| `<tbody>` | Body tabel |
| `<tr>` | Table row (baris) |
| `<th>` | Table header cell (bold, center) |
| `<td>` | Table data cell |
| `colspan` | Gabung beberapa kolom |
| `rowspan` | Gabung beberapa baris |

---

## Kesimpulan

HTML tags adalah fondasi setiap halaman web. Yang paling penting dikuasai:
- Heading `<h1>-<h6>` untuk struktur konten
- `<p>` untuk paragraf, `<a>` untuk link, `<img>` untuk gambar
- Lists `<ol>`, `<ul>`, `<dl>` untuk daftar
- Attributes untuk menambahkan fungsionalitas

Di artikel berikutnya: **HTML Forms dan CSS** — cara mengumpulkan input user dan mempercantik tampilan halaman.

---

*Referensi: UI Technologies (HTML, CSS & JavaScript) — Srinivas Garapati.*
