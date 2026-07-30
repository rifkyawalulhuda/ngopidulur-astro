---
title: "HTML Forms dan CSS: Membuat Form Input dan Styling Halaman Web"
description: Panduan lengkap HTML Forms dan CSS — membuat form login, input
  text, password, radio button, checkbox, dropdown, validasi JavaScript,
  tiga cara penerapan CSS (inline, internal, external), CSS selector class
  dan ID, background, border, dan layout dasar. Contoh kode praktis lengkap.
pubDate: 2026-06-29T21:00:00.000Z
image: /image/ui-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - HTML
  - CSS
  - HTMLForms
  - WebDevelopment
  - FrontEnd
  - Styling
series: "UI Web Dasar"
seriesOrder: 3
---

HTML Forms adalah cara utama mengumpulkan input dari pengguna — login, registrasi, pencarian, pemesanan. CSS kemudian mempercantik tampilan form dan seluruh halaman web.

## HTML Forms

### Dasar Form

```html
<form action="LoginServlet" method="post">
  <!-- Form controls di sini -->
</form>
```

| Atribut | Fungsi |
|---------|--------|
| `action` | URL tujuan pengiriman data |
| `method` | `get` atau `post` |
| `name` | Nama form (untuk akses via JS) |
| `onsubmit` | Event handler saat submit |

---

## Form Controls

### Text Field

```html
<label>Masukkan Username:</label>
<input type="text" name="username" placeholder="contoh: budi123"/>
```

### Password Field

```html
<label>Masukkan Password:</label>
<input type="password" name="password"/>
```

### Email Field (HTML5)

```html
<label>Email:</label>
<input type="email" name="email" placeholder="nama@domain.com"/>
<!-- Browser otomatis validasi format email -->
```

### Radio Button

Pilih satu dari beberapa opsi — gunakan `name` yang sama agar hanya bisa pilih satu:

```html
<p>Jenis Kelamin:</p>
<input type="radio" name="gender" value="L"/> Laki-laki<br/>
<input type="radio" name="gender" value="P"/> Perempuan<br/>
<input type="radio" name="gender" value="O"/> Lainnya
```

### Checkbox

Bisa pilih lebih dari satu opsi:

```html
<p>Bahasa yang dikuasai:</p>
<input type="checkbox" name="html" value="html"/> HTML<br/>
<input type="checkbox" name="css" value="css"/> CSS<br/>
<input type="checkbox" name="js" value="js"/> JavaScript<br/>
<input type="checkbox" name="python" value="python"/> Python
```

### Dropdown (Select)

```html
<label>Pilih Kota:</label>
<select name="kota">
  <option value="">-- Pilih Kota --</option>
  <option value="jkt">Jakarta</option>
  <option value="bdg">Bandung</option>
  <option value="sby">Surabaya</option>
  <option value="mdn">Medan</option>
</select>
```

### Textarea

```html
<label>Pesan:</label><br/>
<textarea name="pesan" rows="5" cols="40" 
          placeholder="Tulis pesan di sini..."></textarea>
```

### Submit dan Reset Button

```html
<input type="submit" value="Kirim"/>
<input type="reset" value="Reset"/>
<button type="submit">Kirim Form</button>
```

---

## Form Lengkap dengan Validasi JavaScript

Validasi di sisi client sebelum data dikirim ke server:

```html
<!DOCTYPE html>
<html>
<head>
  <script>
    function validateForm() {
      var name = document.login.name.value;
      var pass = document.login.pass.value;

      if (name == null || name == "") {
        document.getElementById("err").innerHTML = "Username tidak boleh kosong";
        return false;
      } else if (pass == null || pass == "") {
        document.getElementById("err").innerHTML = "Password tidak boleh kosong";
        return false;
      }
      return true; // lanjutkan submit ke server
    }
  </script>
</head>
<body>
  <h2>Form Login</h2>
  <form name="login" method="post" action="LoginServlet"
        onsubmit="return validateForm()">
    
    <label>Username:</label>
    <input type="text" name="name" placeholder="Masukkan username"/><br/><br/>
    
    <label>Password:</label>
    <input type="password" name="pass" placeholder="Masukkan password"/><br/><br/>
    
    <input type="submit" value="Login"/>
    <p id="err" style="color:red"></p>
  </form>
</body>
</html>
```

---

## CSS — Cascading Style Sheets

CSS digunakan untuk menerapkan gaya visual pada elemen HTML. Ada tiga cara menerapkan CSS:

### 1. Inline CSS — Style Langsung di Element

Cocok untuk gaya yang hanya berlaku pada satu elemen tertentu:

```html
<body>
  <p style="color:red; font-size:16px;">Paragraf merah</p>
  <p style="color:blue; font-weight:bold;">Paragraf biru tebal</p>
  <p style="font-size:24px; text-align:center;">Paragraf besar center</p>
</body>
```

### 2. Internal CSS — `<style>` di `<head>`

Cocok untuk gaya yang berlaku di satu halaman:

```html
<head>
  <style>
    p {
      color: red;
      font-size: 16px;
      line-height: 1.6;
    }
    h1 {
      color: blue;
      font-family: Arial, sans-serif;
    }
    body {
      background-color: #f5f5f5;
      margin: 20px;
    }
  </style>
</head>
```

### 3. External CSS — File Terpisah (Direkomendasikan)

Berlaku di semua halaman yang menggunakan file CSS ini — disebut **code centralization**:

```css
/* style.css */
p {
  color: blue;
  font-size: 16px;
}

h1 {
  color: red;
  margin-bottom: 20px;
}
```

```html
<!-- Hubungkan dari HTML -->
<head>
  <link rel="stylesheet" href="style.css"/>
</head>
```

---

## CSS Selectors

### Element Selector

```css
p { color: red; }
h1 { font-size: 2rem; }
a { text-decoration: none; }
```

### Class Selector (`.`)

Class bisa digunakan oleh banyak elemen — prefix titik (`.`):

```css
.highlight {
  background-color: yellow;
  font-weight: bold;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}
```

```html
<p class="highlight">Teks ini di-highlight</p>
<button class="btn btn-primary">Klik Saya</button>
```

### ID Selector (`#`)

ID hanya boleh digunakan oleh **satu elemen** per halaman — prefix `#`:

```css
#header {
  background-color: #333;
  color: white;
  padding: 20px;
}

#footer {
  text-align: center;
  font-size: 12px;
}
```

```html
<div id="header">Header Website</div>
<div id="footer">Footer Website</div>
```

| | Class | ID |
|-|-------|----|
| **Prefix** | `.nama` | `#nama` |
| **Penggunaan** | Banyak elemen | Satu elemen unik |
| **Contoh** | `.btn`, `.card` | `#header`, `#nav` |

---

## CSS Properties Penting

### Background

```css
div {
  background-color: #f0f0f0;
  background-image: url('bg.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

/* Shorthand */
div {
  background: #f0f0f0 url('bg.jpg') no-repeat center/cover;
}
```

### Border

```css
div {
  border: 2px solid #333;         /* semua sisi sama */
  border-top: 3px dashed red;     /* hanya atas */
  border-right: 1px dotted blue;  /* hanya kanan */
  border-radius: 8px;             /* sudut melengkung */
}
```

### Box Model

```css
div {
  width: 300px;
  height: 200px;
  padding: 20px;          /* jarak dalam */
  margin: 10px auto;      /* jarak luar, auto = center */
  border: 1px solid #ccc;
  box-sizing: border-box; /* width termasuk padding & border */
}
```

### Typography

```css
p {
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  font-weight: bold;       /* normal, bold, 100-900 */
  font-style: italic;
  line-height: 1.6;
  letter-spacing: 1px;
  text-align: center;      /* left, right, center, justify */
  text-decoration: underline;
  color: #333;
}
```

---

## Contoh Form Lengkap dengan CSS

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      padding: 40px;
    }
    .form-card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 400px;
    }
    h2 { color: #333; margin-bottom: 20px; }
    label { display: block; margin-bottom: 5px; color: #555; }
    input[type="text"], input[type="password"], input[type="email"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-bottom: 15px;
      box-sizing: border-box;
    }
    input[type="text"]:focus, input[type="password"]:focus {
      border-color: #007bff;
      outline: none;
    }
    .btn-submit {
      width: 100%;
      padding: 12px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }
    .btn-submit:hover { background: #0056b3; }
    .error { color: red; font-size: 13px; }
  </style>
</head>
<body>
  <div class="form-card">
    <h2>Login</h2>
    <form>
      <label>Email</label>
      <input type="email" placeholder="nama@domain.com"/>
      <label>Password</label>
      <input type="password" placeholder="Masukkan password"/>
      <input type="submit" value="Masuk" class="btn-submit"/>
      <p class="error" id="err"></p>
    </form>
  </div>
</body>
</html>
```

---

## Kesimpulan

HTML Forms + CSS adalah kombinasi dasar untuk membangun UI yang fungsional dan menarik:
- Gunakan **form controls** yang tepat sesuai jenis input
- Selalu validasi form di **client-side** sebelum kirim ke server
- Gunakan **external CSS** untuk project nyata agar mudah dikelola
- Pahami **class vs ID** — class untuk banyak elemen, ID untuk elemen unik

Di artikel berikutnya: **JavaScript Dasar** — variabel, fungsi, operator, dan control flow.

---

*Referensi: UI Technologies (HTML, CSS & JavaScript) — Srinivas Garapati.*
