---
title: "Pengantar Web Development: HTML, CSS, dan JavaScript untuk Pemula"
description: Panduan lengkap pengantar web development — memahami web
  technologies, perbedaan static vs dynamic website, peran HTML CSS JavaScript,
  client-side frameworks (Angular, React, Bootstrap), cara kerja browser, URL,
  dan langkah pertama membuat halaman web. Cocok untuk pemula absolut.
pubDate: 2026-06-29T19:00:00.000Z
image: /image/ui-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - HTML
  - CSS
  - JavaScript
  - WebDevelopment
  - FrontEnd
  - PemulaCoding
---

Setiap website yang kamu lihat di browser dibuat dengan tiga teknologi dasar: **HTML, CSS, dan JavaScript**. Ketiganya bekerja bersama — HTML membangun struktur, CSS mempercantik tampilan, dan JavaScript menambahkan interaktivitas.

## Apa Itu Web Technologies?

Web technologies adalah kumpulan teknologi yang digunakan untuk membangun website dan aplikasi web. Setiap web developer — baik frontend, backend, maupun fullstack — wajib menguasai HTML, CSS, dan JavaScript.

### Static vs Dynamic Website

| | Static Website | Dynamic Website |
|-|---------------|----------------|
| **Konten** | Sama untuk semua user | Berbeda per user |
| **Teknologi** | HTML, CSS, JS saja | + Server-side (PHP, Java, Python) |
| **Contoh** | Tutorial sites, portfolio | Gmail, tokopedia, e-commerce |
| **Server** | Tidak perlu server-side | Butuh server-side programming |

**Static website** menampilkan konten yang sama untuk semua pengunjung. Contohnya situs tutorial seperti w3schools.com atau htmlreference.io.

**Dynamic website** menghasilkan halaman berbeda untuk tiap user. Contohnya Gmail — halaman inbox kamu berbeda dengan inbox orang lain meski menggunakan aplikasi yang sama.

---

## Tiga Pilar Web Development

### 1. HTML — Struktur

HTML (HyperText Markup Language) menyediakan elemen-elemen untuk membangun halaman web: heading, paragraf, form, tombol, gambar, tabel, dan lainnya.

```html
<!doctype html>
<html>
  <head>
    <title>Halaman Pertama Saya</title>
    <meta name="Keywords" content="HTML, CSS, JavaScript tutorial">
    <meta name="Description" content="Situs tutorial web technologies">
    <link type="text/css" rel="stylesheet" href="styling.css">
  </head>
  <body>
    <h1>Selamat Datang!</h1>
    <p>Ini adalah halaman web pertama saya.</p>
  </body>
</html>
```

### 2. CSS — Tampilan

CSS (Cascading Style Sheets) digunakan untuk menerapkan gaya visual pada elemen HTML: warna, font, border, background, layout, dan lainnya.

```css
h1 {
  color: #3776ab;
  font-size: 2rem;
}

p {
  color: #333;
  line-height: 1.6;
}
```

### 3. JavaScript — Interaktivitas

JavaScript menambahkan fungsionalitas dinamis pada halaman web — validasi form, animasi, fetch data dari API, dan lainnya.

```javascript
function greet(name) {
  alert("Hello, " + name + "!");
}
```

---

## Client-Side Frameworks

Framework client-side adalah library JavaScript yang mempercepat pengembangan aplikasi web modern:

| Framework | Pembuat | Kegunaan Utama |
|-----------|---------|---------------|
| **Angular** | Google | SPA (Single Page App) skala besar |
| **React** | Facebook/Meta | UI komponen, SPA |
| **Bootstrap** | Twitter | Responsive layout, UI components |
| **Vue.js** | Community | SPA ringan dan fleksibel |

---

## Cara Kerja Browser

```
User → URL di browser → Request ke server → Server kirim HTML/CSS/JS
                                                        ↓
Browser parse HTML → Load CSS → Execute JS → Render halaman
```

### Definisi Penting

- **Client** — Sistem pengguna yang terhubung ke jaringan, dilengkapi web browser
- **Web Browser** — Software untuk mengakses halaman web (Chrome, Firefox, Edge)
- **URL** — Unique Resource Locator, alamat unik sebuah halaman web
- **IDE** — Integrated Development Environment, software untuk menulis kode (VS Code, Sublime Text)

---

## Menulis Kode HTML: Dua Pendekatan

Ada dua cara mengorganisasi kode HTML, CSS, dan JavaScript:

### 1. Semua dalam Satu File

Cocok untuk proyek kecil atau belajar:

```html
<!doctype html>
<html>
  <head>
    <style>
      /* CSS di sini */
      p { color: red; }
    </style>
  </head>
  <body>
    <p>Paragraf merah</p>
    <script>
      // JavaScript di sini
      console.log("Hello!");
    </script>
  </body>
</html>
```

### 2. File Terpisah (Direkomendasikan)

Pendekatan profesional — CSS dan JS di file terpisah:

```
project/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

```html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  ...
  <script src="js/script.js"></script>
</body>
```

Keuntungan file terpisah:
- **Code centralization** — perubahan CSS/JS berlaku di semua halaman
- **Caching** — browser cache file CSS/JS, loading lebih cepat
- **Maintainability** — lebih mudah dikelola

---

## HTML: Karakteristik Unik

### Case-Insensitive

HTML tidak membedakan huruf besar dan kecil:

```html
<P>Ini valid</P>
<p>Ini juga valid</p>
<P>Ini juga valid</P>
```

Meski demikian, **best practice** adalah selalu gunakan huruf kecil (lowercase) sesuai standar HTML5.

### Errorless Language

HTML akan tetap dirender meski ada error sintaks — browser akan mencoba "menebak" maksud kode kamu. Ini bisa menyebabkan tampilan yang tidak terduga.

```html
<!-- Tag tidak ditutup — browser tetap render, tapi hasilnya bisa aneh -->
<p>Paragraf tanpa penutup
<p>Paragraf kedua
```

### Program vs Script

- **Program** — berjalan sendiri untuk menghasilkan output (C, Java, Python)
- **Script** — membutuhkan program lain untuk berjalan (JavaScript butuh HTML/browser)

JavaScript adalah **script** — harus dijalankan dari dalam HTML atau browser.

---

## Tools yang Dibutuhkan

Untuk memulai web development, kamu hanya perlu:

1. **Text Editor** — VS Code (direkomendasikan), Sublime Text, Notepad++
2. **Web Browser** — Chrome atau Firefox dengan DevTools
3. **Tidak perlu instalasi server** untuk HTML/CSS/JS statis — cukup buka file `.html` di browser

### Shortcut Memulai di VS Code

1. Install VS Code dari code.visualstudio.com
2. Install extension **Live Server** untuk auto-reload
3. Buat file `index.html`
4. Ketik `!` lalu tekan Tab — VS Code auto-generate struktur HTML dasar
5. Klik kanan → "Open with Live Server"

---

## Kesimpulan

Web development dimulai dari tiga fondasi:
- **HTML** — struktur dan konten
- **CSS** — tampilan dan layout  
- **JavaScript** — interaktivitas dan logika

Kuasai ketiganya secara berurutan sebelum melompat ke framework. Di artikel berikutnya: **HTML Tags dan Attributes** — elemen-elemen dasar untuk membangun halaman web.

---

*Referensi: UI Technologies (HTML, CSS & JavaScript) Including ES6 Features — Srinivas Garapati.*
