---
title: "Python Pemula: Tipe Data, Variabel, dan Cara Komputer Berpikir"
description: Belajar Python dari nol bersama MIT 6.100L — memahami bagaimana
  komputer bekerja, tipe data dasar, variabel, binding, string, percabangan,
  dan cara menulis program pertamamu.
pubDate: 2026-07-30T08:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - PemrogramanPemula
  - MIT6100L
  - ComputerScience
---

Kalau kamu belum pernah menulis satu baris kode pun, artikel ini adalah titik mulai yang tepat. MIT merilis kuliah **6.100L — Introduction to Computer Science and Programming Using Python** secara gratis di OpenCourseWare, diajarkan oleh Dr. Ana Bell. Seri artikel ini merangkum seluruh materi kuliahnya dalam bahasa Indonesia.

Kita mulai dari yang paling mendasar: *bagaimana komputer sebenarnya "berpikir"*, dan bagaimana kita bicara dengannya melalui Python.

## Daftar Isi

- [Komputer Itu Mesin Kalkulator Bodoh](#komputer-itu-mesin-kalkulator-bodoh)
- [Tipe Data Dasar Python](#tipe-data-dasar-python)
- [Variabel dan Binding](#variabel-dan-binding)
- [Operasi pada String](#operasi-pada-string)
- [Input dan Output](#input-dan-output)
- [Percabangan (Branching)](#percabangan-branching)
- [Indentasi: Aturan Wajib Python](#indentasi-aturan-wajib-python)

---

## Komputer Itu Mesin Kalkulator Bodoh

Komputer tidak pintar. Ia hanya bisa melakukan dua hal: **menyimpan data** dan **melakukan operasi** pada data itu. Yang membuatnya terlihat "pintar" adalah kecepatan dan urutan instruksi yang kita berikan.

Ada dua jenis pengetahuan (knowledge) dalam komputasi:

- **Declarative knowledge** — pernyataan fakta. Contoh: "akar kuadrat dari x adalah y di mana y² = x"
- **Imperative knowledge** — urutan langkah. Contoh: "mulai dari tebakan g, hitung (g + x/g)/2, ulangi sampai cukup akurat"

Python adalah cara kita menuliskan *imperative knowledge* itu ke komputer.

---

## Tipe Data Dasar Python

Python mengenal beberapa tipe data bawaan:

```python
# Integer — bilangan bulat
umur = 25
tahun = 2024

# Float — bilangan desimal
tinggi = 1.75
pi = 3.14159

# Boolean — benar atau salah
aktif = True
selesai = False

# NoneType — tidak ada nilai
kosong = None
```

Kamu bisa cek tipe data dengan fungsi `type()`:

```python
print(type(42))       # <class 'int'>
print(type(3.14))     # <class 'float'>
print(type(True))     # <class 'bool'>
print(type("hello"))  # <class 'str'>
```

### Operasi Aritmatika

```python
5 + 3    # 8   — penjumlahan
5 - 3    # 2   — pengurangan
5 * 3    # 15  — perkalian
5 / 3    # 1.666... — pembagian (selalu float)
5 // 3   # 1   — pembagian bulat (floor division)
5 % 3    # 2   — sisa bagi (modulo)
5 ** 3   # 125 — perpangkatan
```

Urutan operasi mengikuti aturan matematika standar (PEMDAS/BODMAS) — tanda kurung didahulukan.

---

## Variabel dan Binding

**Variabel** adalah nama yang kita tempelkan ke sebuah nilai. Dalam Python, variabel tidak perlu dideklarasikan tipenya — cukup langsung assign.

```python
x = 10          # x menunjuk ke nilai 10
nama = "Rifky"  # nama menunjuk ke string "Rifky"
pi = 3.14159    # pi menunjuk ke float
```

### Cara Python Menyimpan Variabel

Python bekerja dengan sistem **binding** — variabel adalah label yang menempel ke objek di memori:

```python
x = 5
y = x    # y juga menunjuk ke objek 5
x = 10   # x sekarang menunjuk ke objek baru (10)
print(y) # masih 5 — y tidak ikut berubah
```

Ini penting dipahami karena perilakunya berbeda untuk tipe data *mutable* (yang bisa diubah), yang akan kita bahas di artikel berikutnya.

### Aturan Penamaan Variabel

- Boleh: huruf, angka, underscore `_`
- Tidak boleh dimulai dengan angka
- Tidak boleh menggunakan kata kunci Python (`if`, `for`, `while`, dll.)
- Python *case-sensitive*: `nama` ≠ `Nama` ≠ `NAMA`

```python
# Konvensi yang baik
jumlah_siswa = 30
harga_barang = 15000
nama_lengkap = "Ana Bell"
```

---

## Operasi pada String

String adalah teks — ditulis di antara tanda kutip tunggal `'...'` atau ganda `"..."`.

```python
salam = "Halo, dunia!"
nama  = 'Python'

# Panjang string
print(len(salam))   # 13

# Indexing — akses karakter per karakter (dimulai dari 0)
print(salam[0])     # 'H'
print(salam[-1])    # '!' (negatif = dari belakang)

# Slicing — ambil sebagian string
print(salam[0:4])   # 'Halo'
print(salam[6:])    # 'dunia!'

# Penggabungan (concatenation)
kalimat = "Belajar " + "Python"
print(kalimat)      # 'Belajar Python'

# Pengulangan
print("ha" * 3)     # 'hahaha'
```

### f-String (Format String)

Cara modern menyisipkan variabel ke dalam string:

```python
nama = "Rifky"
umur = 25

# cara lama
print("Nama: " + nama + ", Umur: " + str(umur))

# cara modern dengan f-string
print(f"Nama: {nama}, Umur: {umur}")
# Output: Nama: Rifky, Umur: 25

# bisa juga ekspresi di dalamnya
print(f"Tahun depan umur: {umur + 1}")
```

---

## Input dan Output

```python
# Output ke layar
print("Hello, World!")
print("Nilai pi:", 3.14159)

# Input dari pengguna (selalu menghasilkan string)
nama = input("Masukkan namamu: ")
print(f"Halo, {nama}!")

# Konversi tipe jika perlu
umur_str = input("Umur kamu: ")
umur = int(umur_str)  # konversi ke integer
print(f"10 tahun lagi kamu berumur {umur + 10}")
```

> **Perhatian:** `input()` selalu mengembalikan tipe `str`. Kalau perlu angka, konversi dengan `int()` atau `float()`.

---

## Percabangan (Branching)

Program tidak selalu jalan lurus dari atas ke bawah. **Percabangan** memungkinkan program mengambil jalur berbeda tergantung kondisi.

```python
nilai = 75

if nilai >= 80:
    print("A")
elif nilai >= 70:
    print("B")
elif nilai >= 60:
    print("C")
else:
    print("D")
```

### Operator Perbandingan

```python
x == y   # sama dengan
x != y   # tidak sama dengan
x > y    # lebih besar
x < y    # lebih kecil
x >= y   # lebih besar atau sama
x <= y   # lebih kecil atau sama
```

### Operator Logika

```python
# and — keduanya harus True
umur = 20
punya_ktp = True
if umur >= 17 and punya_ktp:
    print("Boleh masuk")

# or — salah satu cukup True
hari = "Sabtu"
if hari == "Sabtu" or hari == "Minggu":
    print("Hari libur")

# not — membalik nilai boolean
aktif = False
if not aktif:
    print("Pengguna tidak aktif")
```

---

## Indentasi: Aturan Wajib Python

Python menggunakan **indentasi** (spasi/tab di awal baris) untuk menandai blok kode. Ini bukan opsional — salah indentasi = error.

```python
# BENAR
if True:
    print("satu")
    print("dua")
print("tiga")  # di luar blok if

# SALAH — IndentationError
if True:
print("satu")  # ← harusnya ada spasi di depan
```

Konvensi standar Python menggunakan **4 spasi** per level indentasi. Jangan campur spasi dan tab.

---

## Ringkasan

| Konsep | Inti |
|--------|------|
| Tipe data | `int`, `float`, `str`, `bool`, `None` |
| Variabel | Label yang menempel ke objek di memori |
| String | Teks, bisa di-*index*, *slice*, dan digabung |
| f-string | `f"teks {variabel}"` — cara modern format string |
| `input()` | Selalu menghasilkan `str`, konversi manual jika perlu |
| Percabangan | `if`, `elif`, `else` dengan operator logika |
| Indentasi | 4 spasi per level — wajib, bukan opsional |

---

Artikel berikutnya: **Iterasi, Loop, dan Algoritma Pencarian** — kita akan belajar bagaimana membuat program yang mengulang pekerjaan ratusan kali tanpa menulis ratusan baris kode.

---

**Sumber:** MIT OpenCourseWare — [6.100L Introduction to CS and Programming Using Python, Fall 2022](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/), Dr. Ana Bell. Lisensi CC BY-NC-SA 4.0.
