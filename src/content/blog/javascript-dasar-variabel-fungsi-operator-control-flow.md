---
title: "JavaScript Dasar: Variabel, Fungsi, Operator, dan Control Flow"
description: Panduan lengkap JavaScript dasar — var let const, tipe data,
  komentar, fungsi biasa dan arrow function, operator aritmatika dan logika,
  control flow if-else switch, loop for while do-while, dan cara menulis
  JavaScript di HTML. Dilengkapi contoh kode praktis untuk pemula.
pubDate: 2026-06-29T22:00:00.000Z
image: /image/ui-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - JavaScript
  - WebDevelopment
  - FrontEnd
  - BelajarJavaScript
  - ES6
---

JavaScript adalah bahasa pemrograman yang membuat halaman web menjadi **interaktif dan dinamis**. Mulai dari validasi form, animasi, hingga fetch data dari API — semuanya menggunakan JavaScript.

## Cara Menulis JavaScript di HTML

JavaScript bisa ditulis di dua lokasi dalam HTML:

```html
<!-- 1. Di Body Location — dieksekusi saat halaman loading -->
<html>
<body>
  <script>
    console.log("Halaman sedang loading...");
  </script>
</body>
</html>

<!-- 2. Di Head Location — dieksekusi saat ada aksi (click, dll) -->
<html>
<head>
  <script>
    function greet() {
      alert("Hello!");
    }
  </script>
</head>
<body>
  <button onclick="greet()">Klik Saya</button>
</body>
</html>

<!-- 3. File eksternal (direkomendasikan) -->
<script src="app.js"></script>
```

> **Best Practice:** Letakkan `<script src="app.js">` sebelum `</body>` agar tidak memblokir rendering halaman.

---

## Output JavaScript

```javascript
// Console — untuk debugging
console.log("Hello World");
console.log("Nilai:", 42);
console.error("Ini error");
console.warn("Ini warning");

// Alert — popup di browser
alert("Pesan untuk user");

// Confirm — popup dengan OK/Cancel
var jawaban = confirm("Yakin ingin menghapus?");
if (jawaban) {
  console.log("User memilih OK");
}

// Prompt — popup dengan input
var nama = prompt("Siapa namamu?");
console.log("Halo, " + nama);

// Tulis ke halaman
document.write("<h2>Hello dari JavaScript!</h2>");
document.getElementById("output").innerHTML = "Teks diubah!";
```

---

## Komentar

```javascript
// Ini komentar satu baris

/*
  Ini komentar
  multi-baris
*/

var x = 10; // komentar di akhir baris
```

---

## Variabel: var, let, dan const

JavaScript punya tiga cara deklarasi variabel:

```javascript
// var — function-scoped, bisa re-declare, hoisting
var nama = "Budi";
var nama = "Siti"; // valid tapi tidak direkomendasikan

// let — block-scoped, bisa re-assign, ES6+
let umur = 25;
umur = 26; // valid
// let umur = 27; // Error: sudah dideklarasi

// const — block-scoped, tidak bisa re-assign, ES6+
const PI = 3.14159;
// PI = 3; // Error: Assignment to constant variable
```

### Perbedaan var, let, const

| | `var` | `let` | `const` |
|-|-------|-------|---------|
| **Scope** | Function | Block | Block |
| **Re-declare** | ✅ | ❌ | ❌ |
| **Re-assign** | ✅ | ✅ | ❌ |
| **Hoisting** | ✅ (undefined) | ❌ | ❌ |
| **Kapan pakai** | Hindari | Variabel biasa | Nilai tetap |

```javascript
// Contoh block scope
{
  var x = 10;  // bisa diakses di luar block
  let y = 20;  // TIDAK bisa diakses di luar block
  const z = 30; // TIDAK bisa diakses di luar block
}
console.log(x); // 10
console.log(y); // ReferenceError!
```

---

## Tipe Data JavaScript

```javascript
// String
let nama = "Budi";
let sapa = 'Hello';
let template = `Halo, ${nama}!`; // template literal ES6

// Number
let umur = 25;
let harga = 99.99;
let negatif = -10;

// Boolean
let aktif = true;
let selesai = false;

// Null — sengaja kosong
let data = null;

// Undefined — belum diisi
let belumDiisi;
console.log(belumDiisi); // undefined

// Object
let orang = { nama: "Budi", umur: 25 };

// Array
let buah = ["apel", "mangga", "jeruk"];

// Cek tipe data
console.log(typeof nama);    // "string"
console.log(typeof umur);    // "number"
console.log(typeof aktif);   // "boolean"
console.log(typeof data);    // "object" (null quirk)
console.log(typeof orang);   // "object"
console.log(typeof buah);    // "object"
```

---

## Fungsi (Functions)

```javascript
// Deklarasi fungsi biasa
function tambah(a, b) {
  return a + b;
}
console.log(tambah(3, 4)); // 7

// Fungsi dengan default parameter (ES6)
function greet(name = "Teman") {
  return "Halo, " + name + "!";
}
console.log(greet());        // "Halo, Teman!"
console.log(greet("Budi"));  // "Halo, Budi!"

// Function expression
const kali = function(a, b) {
  return a * b;
};

// Arrow function (ES6) — lebih ringkas
const bagi = (a, b) => a / b;
const kuadrat = x => x ** 2;
const halo = () => "Hello World!";

console.log(bagi(10, 2));    // 5
console.log(kuadrat(4));     // 16
console.log(halo());         // "Hello World!"
```

---

## Operator

### Aritmatika

```javascript
let a = 10, b = 3;

console.log(a + b);  // 13 — penjumlahan
console.log(a - b);  // 7  — pengurangan
console.log(a * b);  // 30 — perkalian
console.log(a / b);  // 3.333 — pembagian
console.log(a % b);  // 1  — modulus (sisa bagi)
console.log(a ** b); // 1000 — pangkat (ES6)

// Increment & decrement
let x = 5;
x++;       // x = 6 (post-increment)
++x;       // x = 7 (pre-increment)
x--;       // x = 6 (post-decrement)
```

### Assignment

```javascript
let n = 10;
n += 5;   // n = 15
n -= 3;   // n = 12
n *= 2;   // n = 24
n /= 4;   // n = 6
n %= 4;   // n = 2
n **= 3;  // n = 8
```

### Perbandingan

```javascript
console.log(5 == "5");   // true  — hanya cek nilai
console.log(5 === "5");  // false — cek nilai DAN tipe
console.log(5 !== "5");  // true  — strict not equal
console.log(10 > 5);     // true
console.log(10 < 5);     // false
console.log(10 >= 10);   // true
```

> **Best Practice:** Selalu gunakan `===` (strict equality) bukan `==`.

### Logika

```javascript
console.log(true && false);  // false — AND
console.log(true || false);  // true  — OR
console.log(!true);          // false — NOT

// Contoh praktis
let umur = 20;
let punya_ktp = true;
if (umur >= 17 && punya_ktp) {
  console.log("Boleh mendaftar");
}
```

---

## Control Flow

### if - else if - else

```javascript
let nilai = 85;

if (nilai >= 90) {
  console.log("A");
} else if (nilai >= 80) {
  console.log("B");
} else if (nilai >= 70) {
  console.log("C");
} else {
  console.log("D");
}
// Output: B

// Ternary operator — if-else ringkas
let status = nilai >= 60 ? "Lulus" : "Tidak Lulus";
console.log(status); // "Lulus"
```

### switch

```javascript
let hari = "Senin";

switch (hari) {
  case "Senin":
  case "Selasa":
  case "Rabu":
  case "Kamis":
  case "Jumat":
    console.log("Hari kerja");
    break;
  case "Sabtu":
  case "Minggu":
    console.log("Akhir pekan");
    break;
  default:
    console.log("Tidak dikenal");
}
```

---

## Loops (Perulangan)

### for loop

```javascript
// Loop biasa
for (let i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}

// Loop array
let buah = ["apel", "mangga", "jeruk"];
for (let i = 0; i < buah.length; i++) {
  console.log(buah[i]);
}

// for...of (ES6) — iterasi nilai
for (let item of buah) {
  console.log(item); // apel, mangga, jeruk
}

// for...in — iterasi key/index
let orang = { nama: "Budi", umur: 25 };
for (let key in orang) {
  console.log(key + ": " + orang[key]);
}
```

### while dan do-while

```javascript
// while — cek kondisi dulu
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// do-while — eksekusi dulu, baru cek
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);
// Perbedaan: do-while selalu eksekusi minimal 1 kali
```

### break dan continue

```javascript
// break — hentikan loop
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i); // 0 1 2 3 4
}

// continue — skip iterasi ini
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i); // 1 3 5 7 9 (skip genap)
}
```

---

## Kesimpulan

Fondasi JavaScript yang wajib dikuasai:
- `let` dan `const` untuk deklarasi variabel (hindari `var`)
- Arrow function `=>` untuk fungsi ringkas
- `===` untuk perbandingan yang aman
- `for...of` untuk iterasi array yang bersih

Di artikel berikutnya: **JavaScript ES6+** — Array methods, destructuring, spread operator, Map, Set, dan Promises.

---

*Referensi: UI Technologies (HTML, CSS & JavaScript) Including ES6 Features — Srinivas Garapati.*
