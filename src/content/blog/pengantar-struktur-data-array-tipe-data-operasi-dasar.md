---
title: "Pengantar Struktur Data: Array, Tipe Data, dan Operasi Dasar dalam Pemrograman"
description: Panduan lengkap pengantar struktur data untuk pemula — memahami
  pengertian struktur data, perbedaan primitive vs non-primitive, linear vs
  non-linear, static vs dynamic, operasi dasar (insert, delete, search, sort),
  serta implementasi array 1D dan 2D lengkap dengan kalkulasi alamat memori.
pubDate: 2026-06-29T17:00:00.000Z
image: /image/dsa-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - StrukturData
  - Algorithm
  - Array
  - Pemrograman
  - C
  - DataStructure
  - ComputerScience
series: "DSA C"
seriesOrder: 1
---

**Struktur data** adalah fondasi pemrograman. Tanpa memahami cara menyimpan dan mengorganisasi data di memori, kamu tidak bisa menulis program yang efisien — seberapa pun pandai algoritma yang kamu gunakan.

## Apa Itu Struktur Data?

Struktur data adalah cara mengorganisasi dan menyimpan data di memori komputer sehingga dapat diakses dan dimodifikasi secara efisien.

Bayangkan kamu punya 1000 data nilai mahasiswa. Kamu bisa menyimpannya dalam:
- **Array** — akses cepat lewat index, tapi ukuran tetap
- **Linked List** — ukuran fleksibel, tapi akses lebih lambat
- **Hash Table** — akses O(1), tapi butuh memori lebih

Pilihan struktur data yang tepat menentukan **efisiensi program** secara keseluruhan.

## Tipe-Tipe Struktur Data

### 1. Primitive Data Structure

Primitive data structure adalah tipe data dasar yang menyimpan **satu nilai** tunggal:

| Tipe | Ukuran | Contoh |
|------|--------|--------|
| `int` | 4 bytes | 42, -10, 0 |
| `char` | 1 byte | 'A', 'z', '3' |
| `float` | 4 bytes | 3.14, -0.5 |
| `double` | 8 bytes | 3.14159265358979 |
| `pointer` | 4/8 bytes | alamat memori |

### 2. Non-Primitive Data Structure

Non-primitive adalah struktur yang dibangun dari tipe primitive, dibagi dua:

#### Linear Data Structure
Elemen tersusun **sekuensial** — satu elemen terhubung ke tepat satu elemen lain:
- **Array** — koleksi elemen bertipe sama, index berbasis 0
- **Linked List** — node terhubung via pointer
- **Stack** — LIFO (Last In First Out)
- **Queue** — FIFO (First In First Out)

#### Non-Linear Data Structure
Satu elemen bisa terhubung ke **banyak elemen** (hubungan hierarkis/jaringan):
- **Tree** — hierarki seperti pohon keluarga
- **Graph** — jaringan node dan edge (seperti peta jalan)

### 3. Static vs Dynamic

| | Static | Dynamic |
|-|--------|---------|
| **Ukuran** | Ditentukan saat compile | Ditentukan saat runtime |
| **Fleksibilitas** | Tetap, tidak bisa berubah | Bisa bertambah/berkurang |
| **Contoh** | Array biasa | Linked List, Dynamic Array |
| **Kecepatan akses** | Lebih cepat | Sedikit lebih lambat |

## Operasi Dasar Struktur Data

Semua struktur data mendukung 5 operasi fundamental:

| Operasi | Deskripsi |
|---------|-----------|
| **Searching** | Mencari elemen tertentu dalam struktur |
| **Sorting** | Mengurutkan elemen (ascending/descending) |
| **Insertion** | Menambahkan elemen baru |
| **Updation** | Memperbarui nilai elemen yang ada |
| **Deletion** | Menghapus elemen dari struktur |

## Keunggulan Menggunakan Struktur Data yang Tepat

1. **Efisiensi** — Program berjalan cepat dengan penggunaan memori minimal
2. **Reusability** — Struktur data bisa dipakai ulang di berbagai program
3. **Abstraksi** — Client hanya perlu tahu *interface*, bukan *implementasi*

## Array: Struktur Data Paling Dasar

Array adalah **koleksi elemen bertipe sama** yang disimpan di lokasi memori yang berurutan (contiguous).

### Properti Array

1. Setiap elemen bertipe data **sama** dan berukuran sama (misalnya `int` = 4 bytes)
2. Elemen disimpan di **lokasi memori berurutan**
3. Elemen dapat diakses langsung menggunakan **index**

### Deklarasi dan Inisialisasi

```c
// Array 1D
int marks[6];                          // deklarasi saja
int marks[6] = {85, 90, 78, 92, 88, 76}; // deklarasi + inisialisasi
int marks[] = {85, 90, 78, 92, 88, 76};  // ukuran otomatis

// Akses elemen
printf("%d", marks[0]);  // 85 (index pertama)
printf("%d", marks[5]);  // 76 (index terakhir)
marks[2] = 95;           // update nilai index ke-2
```

### Keunggulan Array

- **Nama tunggal** untuk grup variabel bertipe sama
- **Traversal mudah** — cukup increment index
- **Akses langsung** via index (Random Access)

### Alokasi Memori Array

```
Array marks[5] = {10, 20, 30, 40, 50}
Base Address = 100

Index:  [0]  [1]  [2]  [3]  [4]
Value:   10   20   30   40   50
Addr:   100  104  108  112  116
         ↑
      Base Address (tiap int = 4 bytes)
```

**Formula alamat elemen:**
```
Address(A[i]) = Base Address + size × (i - first_index)
```

**Contoh:**
```
Array A[0..9], BA = 200, size = 4 bytes
Address(A[5]) = 200 + 4 × (5 - 0) = 200 + 20 = 220
```

## Array 2D (Matriks)

Array 2D adalah **array of arrays** — cocok untuk merepresentasikan matriks atau tabel database.

### Deklarasi

```c
int matrix[3][3];                    // matriks 3x3
int matrix[3][3] = {                 // inisialisasi
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Atau
int matrix[2][2] = {0, 1, 2, 3};    // flatten
```

### Akses Elemen

```c
int x = matrix[1][2];  // baris 1, kolom 2 → nilai 6

// Isi semua elemen dengan 0
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        matrix[i][j] = 0;
    }
}
```

### Penyimpanan di Memori

Array 2D dipetakan ke array 1D dengan dua cara:

#### Row Major Order (C default)
Semua baris disimpan berurutan:
```
[a00][a01][a02][a10][a11][a12][a20][a21][a22]
```

Formula:
```
Address(a[i][j]) = BA + (i × n + j) × size
```

#### Column Major Order (Fortran, MATLAB)
Semua kolom disimpan berurutan:
```
[a00][a10][a20][a01][a11][a21][a02][a12][a22]
```

Formula:
```
Address(a[i][j]) = BA + (j × m + i) × size
```

### Contoh Kalkulasi Row Major

```
Array a[10..30][55..75], BA = 0, size = 4 bytes
Cari: Address(a[15][68])

Address = 0 + ((15-10) × (75-55+1) + (68-55)) × 4
        = ((5 × 21) + 13) × 4
        = 118 × 4
        = 472
```

## Kesimpulan

Struktur data adalah **pondasi pemrograman efisien**. Pilihan struktur data yang tepat bisa membuat perbedaan antara program yang berjalan dalam milidetik vs beberapa menit.

Di artikel berikutnya: **Stack dan Queue** — dua struktur data yang paling sering digunakan dalam algoritma dan sistem nyata.

---

*Referensi: Data Structure and Algorithm, Unit I — Arrays, Sequential Representations, Stacks and Queues.*
