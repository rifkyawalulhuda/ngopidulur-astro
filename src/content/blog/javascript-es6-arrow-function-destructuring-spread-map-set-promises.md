---
title: "JavaScript ES6+: Arrow Function, Destructuring, Spread, Map, Set, dan Promises"
description: Panduan lengkap fitur modern JavaScript ES6+ — arrow function,
  template literal, destructuring array dan object, spread dan rest operator,
  Map dan Set, class dan inheritance, Array methods (map filter reduce),
  String methods, dan Promise async await. Contoh kode praktis lengkap.
pubDate: 2026-06-29T23:00:00.000Z
image: /image/ui-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - JavaScript
  - ES6
  - WebDevelopment
  - FrontEnd
  - ArrowFunction
  - Promises
---

ES6 (ECMAScript 2015) dan versi setelahnya membawa banyak fitur baru yang membuat JavaScript lebih modern, ringkas, dan powerful. Ini adalah fitur-fitur yang wajib dikuasai developer JavaScript masa kini.

## Arrow Function

Arrow function adalah cara ringkas mendefinisikan fungsi:

```javascript
// Fungsi biasa
function tambah(a, b) {
  return a + b;
}

// Arrow function — sama persis
const tambah = (a, b) => a + b;

// Satu parameter — tanpa kurung
const kuadrat = x => x ** 2;

// Tanpa parameter
const halo = () => "Hello World!";

// Multiple baris — pakai kurung kurawal + return
const proses = (x, y) => {
  let hasil = x * y;
  return hasil + 10;
};

console.log(tambah(3, 4));   // 7
console.log(kuadrat(5));     // 25
console.log(halo());         // "Hello World!"
```

### Arrow Function vs Regular Function

```javascript
// Perbedaan utama: `this` binding
const obj = {
  nama: "Budi",

  // Regular function — this merujuk ke obj
  sapa: function() {
    return "Halo, " + this.nama;
  },

  // Arrow function — this merujuk ke scope luar (bukan obj)
  sapaArrow: () => {
    return "Halo, " + this.nama; // undefined!
  }
};

console.log(obj.sapa());       // "Halo, Budi"
console.log(obj.sapaArrow());  // "Halo, undefined"
```

---

## Template Literal

String dengan ekspresi dan multiline tanpa escape:

```javascript
const nama = "Siti";
const umur = 22;

// ES5 — string concatenation
const pesan1 = "Halo, " + nama + "! Kamu berumur " + umur + " tahun.";

// ES6 — template literal (backtick)
const pesan2 = `Halo, ${nama}! Kamu berumur ${umur} tahun.`;

// Ekspresi dalam template literal
console.log(`2 + 3 = ${2 + 3}`);        // "2 + 3 = 5"
console.log(`${umur >= 18 ? "Dewasa" : "Anak-anak"}`); // "Dewasa"

// Multiline
const html = `
  <div class="card">
    <h2>${nama}</h2>
    <p>Umur: ${umur}</p>
  </div>
`;
```

---

## Destructuring

### Array Destructuring

```javascript
const buah = ["apel", "mangga", "jeruk", "anggur"];

// Cara lama
const b1 = buah[0];
const b2 = buah[1];

// Destructuring
const [pertama, kedua, ketiga] = buah;
console.log(pertama); // "apel"
console.log(kedua);   // "mangga"

// Skip elemen
const [, , tiga] = buah;
console.log(tiga); // "jeruk"

// Rest — ambil sisa
const [head, ...tail] = buah;
console.log(head); // "apel"
console.log(tail); // ["mangga", "jeruk", "anggur"]

// Default value
const [a = "default", b = "lainnya"] = ["ada"];
console.log(a); // "ada"
console.log(b); // "lainnya"

// Swap variabel
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1
```

### Object Destructuring

```javascript
const orang = { nama: "Budi", umur: 25, kota: "Jakarta" };

// Destructuring
const { nama, umur, kota } = orang;
console.log(nama); // "Budi"
console.log(umur); // 25

// Rename variabel
const { nama: fullName, umur: age } = orang;
console.log(fullName); // "Budi"

// Default value
const { nama: n, hp = "tidak ada" } = orang;
console.log(hp); // "tidak ada"

// Nested destructuring
const user = {
  name: "Siti",
  address: { city: "Bandung", zip: "40111" }
};
const { name, address: { city } } = user;
console.log(city); // "Bandung"

// Destructuring di parameter fungsi
function tampilkan({ nama, umur }) {
  console.log(`${nama}, ${umur} tahun`);
}
tampilkan(orang); // "Budi, 25 tahun"
```

---

## Spread dan Rest Operator (`...`)

```javascript
// Spread — menyebarkan elemen
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const gabung = [...arr1, ...arr2];
console.log(gabung); // [1, 2, 3, 4, 5, 6]

// Copy array
const copy = [...arr1];

// Spread object
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }

// Override property
const updated = { ...obj1, b: 99 };
console.log(updated); // { a: 1, b: 99 }

// Rest — kumpulkan argumen
function jumlah(...angka) {
  return angka.reduce((total, n) => total + n, 0);
}
console.log(jumlah(1, 2, 3, 4, 5)); // 15
```

---

## Map dan Set (ES6)

### Map — Key-Value dengan Key Apapun

```javascript
const map = new Map();

// Set nilai
map.set("nama", "Budi");
map.set(1, "satu");
map.set(true, "benar");

// Get nilai
console.log(map.get("nama")); // "Budi"
console.log(map.get(1));      // "satu"

// Cek & size
console.log(map.has("nama")); // true
console.log(map.size);        // 3

// Delete
map.delete("nama");

// Iterasi
for (let [key, value] of map) {
  console.log(`${key}: ${value}`);
}

// Map dari array of pairs
const map2 = new Map([["a", 1], ["b", 2], ["c", 3]]);
```

### Set — Koleksi Unik

```javascript
const set = new Set([1, 2, 3, 2, 1]);
console.log(set);       // Set {1, 2, 3} — duplikat dihapus
console.log(set.size);  // 3

set.add(4);
set.delete(1);
console.log(set.has(2)); // true

// Iterasi
for (let val of set) {
  console.log(val);
}

// Hapus duplikat dari array
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3, 4]
```

---

## Array Methods ES6+

```javascript
const angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map() — transformasi setiap elemen
const kuadrat = angka.map(x => x ** 2);
// [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

// filter() — filter berdasarkan kondisi
const genap = angka.filter(x => x % 2 === 0);
// [2, 4, 6, 8, 10]

// reduce() — akumulasi
const total = angka.reduce((acc, x) => acc + x, 0);
// 55

// find() — elemen pertama yang cocok
const pertama = angka.find(x => x > 5);
// 6

// findIndex() — index elemen pertama yang cocok
const idx = angka.findIndex(x => x > 5);
// 5

// some() — ada yang memenuhi kondisi?
console.log(angka.some(x => x > 9));  // true
// every() — semua memenuhi kondisi?
console.log(angka.every(x => x > 0)); // true

// flat() — ratakan array bersarang
const nested = [[1,2],[3,4],[5,6]];
console.log(nested.flat()); // [1,2,3,4,5,6]

// includes()
console.log(angka.includes(5)); // true
```

---

## Class dan Object (ES6)

```javascript
class Hewan {
  constructor(nama, suara) {
    this.nama = nama;
    this.suara = suara;
  }

  bicara() {
    return `${this.nama} berkata: ${this.suara}`;
  }

  static info() {
    return "Ini adalah class Hewan";
  }
}

class Anjing extends Hewan {
  constructor(nama, ras) {
    super(nama, "Woof!");
    this.ras = ras;
  }

  // Override method
  bicara() {
    return `${this.nama} (${this.ras}) menggonggong: ${this.suara}`;
  }
}

const anjing = new Anjing("Rex", "Labrador");
console.log(anjing.bicara());
// "Rex (Labrador) menggonggong: Woof!"
console.log(Hewan.info());
// "Ini adalah class Hewan"
```

---

## Promise dan Async/Await

```javascript
// Promise — handle operasi async
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const sukses = true;
    if (sukses) {
      resolve({ nama: "Budi", umur: 25 });
    } else {
      reject(new Error("Gagal mengambil data"));
    }
  }, 1000);
});

// Consume dengan .then()
fetchData
  .then(data => console.log("Data:", data))
  .catch(err => console.error("Error:", err.message))
  .finally(() => console.log("Selesai"));

// Async/Await — lebih bersih
async function ambilData() {
  try {
    const data = await fetchData;
    console.log("Data:", data);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    console.log("Selesai");
  }
}

ambilData();

// Fetch API (browser) dengan async/await
async function getUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await response.json();
  console.log(users);
}
```

---

## String Methods ES6+

```javascript
const str = "  Hello World  ";

// includes, startsWith, endsWith
console.log(str.includes("World"));     // true
console.log(str.trim().startsWith("H")); // true
console.log(str.trim().endsWith("d"));   // true

// repeat
console.log("ha".repeat(3));  // "hahaha"

// padStart, padEnd
console.log("5".padStart(3, "0"));  // "005"
console.log("5".padEnd(3, "0"));    // "500"

// replaceAll (ES2021)
const text = "satu dua satu tiga satu";
console.log(text.replaceAll("satu", "1"));
// "1 dua 1 tiga 1"
```

---

## Kesimpulan

Fitur ES6+ yang paling sering dipakai:

| Fitur | Kegunaan |
|-------|---------|
| Arrow function | Fungsi ringkas |
| Template literal | String dengan ekspresi |
| Destructuring | Ekstrak nilai dari array/object |
| Spread `...` | Salin/gabung array & object |
| `Map` & `Set` | Koleksi data yang lebih fleksibel |
| `map/filter/reduce` | Transformasi array |
| `async/await` | Handle operasi async dengan bersih |

Kuasai fitur-fitur ini dan kamu siap bekerja dengan framework modern seperti React, Vue, atau Angular.

---

*Referensi: UI Technologies (HTML, CSS & JavaScript) Including ES6 Features — Srinivas Garapati.*
