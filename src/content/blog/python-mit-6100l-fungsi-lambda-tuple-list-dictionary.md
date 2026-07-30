---
title: "Python MIT 6.100L: Fungsi, Lambda, Tuple, List, dan Dictionary"
description: Pelajari cara membuat fungsi reusable, higher-order function,
  lambda, serta struktur data tuple, list, dan dictionary di Python — materi
  kuliah MIT 6.100L Lecture 7 sampai 14.
pubDate: 2026-08-01T08:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - PemrogramanPemula
  - MIT6100L
  - StrukturData
---

Sejauh ini kita sudah bisa membuat program yang berjalan lurus dan bercabang. Tapi program nyata butuh lebih dari itu — kita perlu **memecah masalah besar** menjadi potongan-potongan kecil yang bisa dipakai ulang, dan **menyimpan koleksi data** secara efisien. Artikel ini merangkum Lecture 7–11 dan 14 dari MIT 6.100L: fungsi, scope, lambda, tuple, list, dan dictionary.

## Daftar Isi

- [Fungsi: Decomposition dan Abstraction](#fungsi-decomposition-dan-abstraction)
- [Scope dan Environment](#scope-dan-environment)
- [Fungsi sebagai Objek](#fungsi-sebagai-objek)
- [Lambda Function](#lambda-function)
- [Keyword dan Default Arguments](#keyword-dan-default-arguments)
- [Tuple](#tuple)
- [List dan Mutabilitas](#list-dan-mutabilitas)
- [Aliasing dan Cloning](#aliasing-dan-cloning)
- [Dictionary](#dictionary)

---

## Fungsi: Decomposition dan Abstraction

Fungsi adalah cara kita **membungkus logika** supaya bisa dipanggil berkali-kali tanpa menulis ulang.

```python
def hitung_luas_lingkaran(jari_jari):
    """Menghitung luas lingkaran dari jari-jari yang diberikan."""
    pi = 3.14159
    return pi * jari_jari ** 2

# Pakai berkali-kali
print(hitung_luas_lingkaran(5))   # 78.53975
print(hitung_luas_lingkaran(10))  # 314.159
```

### Anatomi Fungsi

```python
def nama_fungsi(param1, param2):
    """Docstring — jelaskan apa yang dilakukan fungsi ini."""
    # body fungsi
    hasil = param1 + param2
    return hasil  # nilai yang dikembalikan
```

- `def` — kata kunci untuk mendefinisikan fungsi
- Parameter — variabel input (hanya ada di dalam fungsi)
- `return` — mengembalikan nilai; tanpa `return`, fungsi mengembalikan `None`
- Docstring — opsional tapi sangat disarankan

### Kenapa Fungsi Penting?

Dua prinsip dari MIT 6.100L:

- **Decomposition** — pecah masalah besar menjadi sub-masalah kecil
- **Abstraction** — sembunyikan detail implementasi, fokus pada *apa* bukan *bagaimana*

```python
# Tanpa fungsi — repetitif dan susah diubah
luas1 = 3.14159 * 5 ** 2
luas2 = 3.14159 * 10 ** 2
luas3 = 3.14159 * 7 ** 2

# Dengan fungsi — bersih, reusable
def luas_lingkaran(r):
    return 3.14159 * r ** 2

luas1 = luas_lingkaran(5)
luas2 = luas_lingkaran(10)
luas3 = luas_lingkaran(7)
```

---

## Scope dan Environment

Variabel di dalam fungsi **tidak bisa diakses dari luar** — ini namanya *local scope*.

```python
def hitung():
    x = 10  # variabel lokal
    return x

print(hitung())  # 10
print(x)         # NameError: name 'x' is not defined
```

### Global vs Local

```python
nilai_global = 100  # variabel global

def tambah(n):
    nilai_lokal = 5   # hanya ada di sini
    return nilai_global + n + nilai_lokal  # bisa baca global

print(tambah(10))  # 115
```

### Urutan Pencarian Nama (LEGB Rule)

Python mencari variabel dalam urutan: **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in.

```python
x = "global"

def luar():
    x = "enclosing"
    def dalam():
        # x = "local"  # kalau ini ada, pakai local
        print(x)       # pakai enclosing: "enclosing"
    dalam()

luar()
```

---

## Fungsi sebagai Objek

Di Python, fungsi adalah **objek kelas satu** — bisa disimpan di variabel, dimasukkan ke list, atau dijadikan argumen fungsi lain.

```python
def kuadrat(x):
    return x ** 2

def kubik(x):
    return x ** 3

# Simpan fungsi di variabel
operasi = kuadrat
print(operasi(5))   # 25

operasi = kubik
print(operasi(5))   # 125

# Masukkan fungsi ke list
ops = [kuadrat, kubik]
for op in ops:
    print(op(3))    # 9, lalu 27
```

### Higher-Order Function

Fungsi yang menerima fungsi lain sebagai argumen:

```python
def terapkan(fungsi, daftar):
    """Terapkan fungsi ke setiap elemen daftar."""
    hasil = []
    for item in daftar:
        hasil.append(fungsi(item))
    return hasil

angka = [1, 2, 3, 4, 5]
print(terapkan(kuadrat, angka))  # [1, 4, 9, 16, 25]
print(terapkan(kubik, angka))    # [1, 8, 27, 64, 125]

# Python punya map() bawaan untuk ini
print(list(map(kuadrat, angka))) # [1, 4, 9, 16, 25]
```

---

## Lambda Function

Lambda adalah cara singkat membuat fungsi anonim (tanpa nama) — cocok untuk operasi sederhana satu baris.

```python
# Fungsi biasa
def tambah_dua(x):
    return x + 2

# Versi lambda (setara)
tambah_dua = lambda x: x + 2

print(tambah_dua(5))   # 7

# Lambda dengan beberapa parameter
kali = lambda x, y: x * y
print(kali(3, 4))       # 12
```

Lambda paling berguna saat dipakai langsung sebagai argumen:

```python
angka = [5, 2, 8, 1, 9, 3]

# Sort biasa
print(sorted(angka))  # [1, 2, 3, 5, 8, 9]

# Sort berdasarkan sisa bagi 3 (key function)
print(sorted(angka, key=lambda x: x % 3))  # [3, 9, 1, 2, 5, 8]

# Sort list of tuple berdasarkan elemen kedua
data = [("ana", 85), ("budi", 72), ("cici", 91)]
print(sorted(data, key=lambda x: x[1]))
# [('budi', 72), ('ana', 85), ('cici', 91)]
```

---

## Keyword dan Default Arguments

```python
def perkenalan(nama, umur=17, kota="Jakarta"):
    """Default argument — nilai default dipakai kalau tidak diisi."""
    print(f"Nama: {nama}, Umur: {umur}, Kota: {kota}")

perkenalan("Rifky")                    # pakai default umur & kota
perkenalan("Santi", 25)                # override umur
perkenalan("Budi", kota="Bandung")     # keyword argument, skip umur
perkenalan("Cici", umur=30, kota="Surabaya")  # semua explicit
```

> **Aturan:** argumen dengan default harus selalu di **belakang** argumen tanpa default.

---

## Tuple

Tuple adalah koleksi data yang **tidak bisa diubah** (immutable) setelah dibuat. Ditulis dengan tanda kurung.

```python
# Membuat tuple
koordinat = (3, 4)
rgb = (255, 128, 0)
satu_elemen = (42,)  # perlu koma untuk tuple 1 elemen

# Akses elemen (sama dengan string)
print(koordinat[0])   # 3
print(koordinat[-1])  # 4

# Unpacking
x, y = koordinat
print(f"x={x}, y={y}")  # x=3, y=4

# Swap variabel dengan tuple
a, b = 10, 20
a, b = b, a  # elegant swap
print(a, b)  # 20 10
```

### Fungsi yang Mengembalikan Banyak Nilai

```python
def min_maks(daftar):
    """Kembalikan nilai minimum dan maksimum sekaligus."""
    return min(daftar), max(daftar)

angka = [5, 2, 8, 1, 9]
minimum, maksimum = min_maks(angka)
print(f"Min: {minimum}, Maks: {maksimum}")  # Min: 1, Maks: 9
```

---

## List dan Mutabilitas

List mirip tuple tapi **bisa diubah** (mutable) — elemen bisa ditambah, dihapus, atau dimodifikasi.

```python
buah = ["apel", "mangga", "jeruk"]

# Akses
print(buah[0])    # "apel"
print(buah[-1])   # "jeruk"
print(buah[1:])   # ["mangga", "jeruk"]

# Modifikasi
buah[0] = "pisang"
print(buah)       # ["pisang", "mangga", "jeruk"]

# Tambah elemen
buah.append("anggur")       # tambah di akhir
buah.insert(1, "durian")    # sisipkan di index 1

# Hapus elemen
buah.remove("mangga")       # hapus nilai tertentu
del buah[0]                 # hapus berdasarkan index
terakhir = buah.pop()       # hapus & kembalikan elemen terakhir

# Operasi lain
print(len(buah))            # panjang list
print("jeruk" in buah)      # True/False
buah.sort()                 # sort in-place
buah.reverse()              # balik urutan
```

### List Comprehension

Cara ringkas membuat list baru dari list yang ada:

```python
angka = [1, 2, 3, 4, 5]

# Cara lama
kuadrat = []
for x in angka:
    kuadrat.append(x ** 2)

# List comprehension (lebih ringkas)
kuadrat = [x ** 2 for x in angka]
print(kuadrat)  # [1, 4, 9, 16, 25]

# Dengan kondisi (filter)
genap_kuadrat = [x ** 2 for x in angka if x % 2 == 0]
print(genap_kuadrat)  # [4, 16]

# Nested
matriks = [[i * j for j in range(1, 4)] for i in range(1, 4)]
# [[1, 2, 3], [2, 4, 6], [3, 6, 9]]
```

---

## Aliasing dan Cloning

Ini salah satu konsep paling penting dan sering menyebabkan bug.

```python
# Aliasing — dua nama menunjuk ke OBJEK YANG SAMA
a = [1, 2, 3]
b = a           # b adalah alias a, bukan salinan!

b.append(4)
print(a)        # [1, 2, 3, 4] — a ikut berubah!
print(b)        # [1, 2, 3, 4]
print(a is b)   # True — benar-benar sama
```

```python
# Cloning — buat salinan independen
a = [1, 2, 3]
b = a[:]        # slice kosong = copy
# atau: b = list(a)
# atau: b = a.copy()

b.append(4)
print(a)        # [1, 2, 3] — tidak berubah
print(b)        # [1, 2, 3, 4]
print(a is b)   # False — objek berbeda
```

> **Aturan praktis:** kalau kamu ingin memodifikasi list tanpa mengubah aslinya, selalu *clone* dulu.

### Hati-hati dengan Loop + Mutasi

```python
# BUG — jangan mutasi list yang sedang di-loop
L = [1, 2, 3, 4, 5]
for item in L:
    if item % 2 == 0:
        L.remove(item)  # hasil tidak terduga!
print(L)  # [1, 3, 5]? Tidak selalu...

# BENAR — loop copy, mutasi asli
for item in L[:]:       # iterasi salinan
    if item % 2 == 0:
        L.remove(item)  # aman
```

---

## Dictionary

Dictionary menyimpan pasangan **key–value**. Key harus unik dan immutable (string, int, tuple).

```python
# Membuat dictionary
mahasiswa = {
    "nama": "Rifky",
    "nim": "19252259",
    "ipk": 3.85
}

# Akses nilai
print(mahasiswa["nama"])          # "Rifky"
print(mahasiswa.get("ipk"))       # 3.85
print(mahasiswa.get("alamat", "tidak diketahui"))  # default jika tidak ada

# Tambah / ubah
mahasiswa["angkatan"] = 2019
mahasiswa["ipk"] = 3.90

# Hapus
del mahasiswa["nim"]
nilai = mahasiswa.pop("angkatan")  # hapus & kembalikan nilai

# Iterasi
for key in mahasiswa:
    print(key, ":", mahasiswa[key])

for key, value in mahasiswa.items():
    print(f"{key}: {value}")

# Cek keberadaan key
print("nama" in mahasiswa)   # True
print("email" in mahasiswa)  # False
```

### Dictionary sebagai Counter

```python
teks = "hello world"
frekuensi = {}
for huruf in teks:
    if huruf in frekuensi:
        frekuensi[huruf] += 1
    else:
        frekuensi[huruf] = 1

print(frekuensi)
# {'h': 1, 'e': 1, 'l': 3, 'o': 2, ' ': 1, 'w': 1, 'r': 1, 'd': 1}

# Cara lebih ringkas dengan .get()
frekuensi = {}
for huruf in teks:
    frekuensi[huruf] = frekuensi.get(huruf, 0) + 1
```

---

## Ringkasan Perbandingan Struktur Data

| | Tuple | List | Dictionary |
|--|-------|------|------------|
| Syntax | `(a, b)` | `[a, b]` | `{k: v}` |
| Mutable? | ✗ | ✓ | ✓ |
| Ordered? | ✓ | ✓ | ✓ (Python 3.7+) |
| Akses | index | index | key |
| Duplikat? | ✓ | ✓ | Key unik |
| Use case | Koordinat, return multi-value | Koleksi data sejenis | Mapping key→value |

---

Artikel berikutnya: **Testing, Debugging, Exception, dan Assertions** — cara membuat program yang tahan banting dan mudah diperbaiki saat ada yang salah.

---

**Sumber:** MIT OpenCourseWare — [6.100L Introduction to CS and Programming Using Python, Fall 2022](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/), Dr. Ana Bell. Lisensi CC BY-NC-SA 4.0.
