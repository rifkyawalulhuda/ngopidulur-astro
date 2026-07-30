---
title: "Python MIT 6.100L: Kompleksitas Algoritma, Big-O, Sorting, Visualisasi"
description: Pelajari cara mengukur efisiensi algoritma dengan Big-O dan
  Big-Theta, analisis kompleksitas kelas O(1) hingga O(n!), algoritma sorting
  dari bubble sort hingga merge sort, dan visualisasi data dengan matplotlib.
pubDate: 2026-08-04T08:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - MIT6100L
  - Algoritma
  - BigO
---

Kode yang benar belum tentu kode yang baik. Dua program bisa menghasilkan output yang sama tapi salah satunya butuh 1 detik sementara yang lain butuh 10 jam — untuk input yang sama. Artikel terakhir dari seri MIT 6.100L ini membahas cara **mengukur efisiensi** secara matematis (Lecture 21–22), **membandingkan algoritma sorting** (Lecture 23–24), dan **memvisualisasikan data** dengan matplotlib (Lecture 25–26).

## Daftar Isi

- [Mengukur Efisiensi: Kenapa Timing Tidak Cukup](#mengukur-efisiensi-kenapa-timing-tidak-cukup)
- [Menghitung Operasi](#menghitung-operasi)
- [Notasi Big-O](#notasi-big-o)
- [Big-Theta: Batas Atas dan Bawah](#big-theta-batas-atas-dan-bawah)
- [Kelas Kompleksitas](#kelas-kompleksitas)
- [Analisis Algoritma Pencarian](#analisis-algoritma-pencarian)
- [Algoritma Sorting](#algoritma-sorting)
- [Hashing: Akses O(1) untuk Dictionary](#hashing-akses-o1-untuk-dictionary)
- [Visualisasi Data dengan Matplotlib](#visualisasi-data-dengan-matplotlib)

---

## Mengukur Efisiensi: Kenapa Timing Tidak Cukup

Mengukur waktu eksekusi dengan `time` terlihat masuk akal, tapi ada masalah:

```python
import time

def jumlah_kuadrat(n):
    total = 0
    for i in range(n):
        total += i ** 2
    return total

mulai = time.time()
jumlah_kuadrat(100000)
selesai = time.time()
print(f"Waktu: {selesai - mulai:.4f} detik")
```

Masalahnya:
- Hasil berbeda di komputer berbeda (CPU, RAM, beban sistem)
- Hasil berbeda untuk input berbeda
- Tidak memberitahu kita *bagaimana* waktu tumbuh seiring input membesar

Yang kita butuhkan: ukuran yang **independen dari hardware**, fokus pada *pertumbuhan* terhadap ukuran input.

---

## Menghitung Operasi

Daripada mengukur waktu, kita hitung **jumlah operasi dasar** yang dilakukan algoritma.

```python
def cari_maks(L):
    maks = L[0]          # 1 operasi
    for x in L:          # n iterasi
        if x > maks:     # 1 perbandingan per iterasi = n operasi
            maks = x     # paling banyak n assignment
    return maks          # 1 operasi

# Total: 1 + n + n + n + 1 = 3n + 2 operasi
# Untuk n = 1000: 3002 operasi
# Untuk n = 10000: 30002 operasi
# → tumbuh LINEAR terhadap n
```

```python
def cek_duplikat(L):
    for i in range(len(L)):          # n iterasi luar
        for j in range(i + 1, len(L)):  # ~n iterasi dalam
            if L[i] == L[j]:
                return True
    return False

# Total: ~n²/2 operasi
# Untuk n = 1000: ~500.000 operasi
# Untuk n = 10000: ~50.000.000 operasi
# → tumbuh KUADRATIK terhadap n
```

---

## Notasi Big-O

**Big-O** menyatakan batas atas pertumbuhan — kita hanya peduli pada term yang paling dominan, dan abaikan konstanta.

### Aturan Penyederhanaan

```
3n + 2          → O(n)       abaikan konstanta, ambil term dominan
n² + 100n + 50  → O(n²)      n² tumbuh jauh lebih cepat dari 100n
2^n + n¹⁰⁰     → O(2^n)     eksponensial mendominasi polinomial apapun
```

### Kenapa Abaikan Konstanta?

Untuk input besar, konstanta tidak relevan:

| n | 10n | n² |
|---|-----|----|
| 10 | 100 | 100 |
| 100 | 1.000 | 10.000 |
| 1.000 | 10.000 | 1.000.000 |
| 10.000 | 100.000 | 100.000.000 |

Untuk n besar, n² *selalu* mengalahkan 10n, berapapun konstantanya.

```python
# Cara menentukan Big-O dari kode

# O(1) — tidak bergantung pada input
def ambil_pertama(L):
    return L[0]

# O(n) — satu loop linear
def hitung_total(L):
    return sum(L)

# O(n²) — nested loop
def semua_pasangan(L):
    for i in L:
        for j in L:
            print(i, j)

# O(log n) — input dibagi dua tiap iterasi
def bisection(n):
    low, high = 0, n
    while low < high:
        mid = (low + high) // 2
        # ...
        high = mid  # atau low = mid + 1

# O(n log n) — loop + bisection di dalamnya
# O(2^n) — rekursi dengan dua cabang
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)  # dua panggilan rekursif = O(2^n)
```

---

## Big-Theta: Batas Atas dan Bawah

Big-O adalah batas atas. **Big-Theta (Θ)** menyatakan bound yang *ketat* — algoritma tumbuh tepat secepat itu, tidak lebih cepat dan tidak lebih lambat.

```
T(n) = Θ(f(n)) berarti:
  - T(n) = O(f(n))  → tidak tumbuh lebih cepat dari f(n)
  - T(n) = Ω(f(n))  → tidak tumbuh lebih lambat dari f(n)
```

Contoh:
- `3n + 5 = Θ(n)` — tumbuh tepat linear
- `n²/2 + n = Θ(n²)` — tumbuh tepat kuadratik
- Pencarian linear: `Θ(n)` untuk worst case, `Θ(1)` untuk best case

Dalam praktik, kita lebih sering pakai Big-O (worst case) karena itulah jaminan yang kita butuhkan.

---

## Kelas Kompleksitas

Dari yang tercepat ke paling lambat:

| Kelas | Nama | Contoh | n=100 ops |
|-------|------|--------|-----------|
| O(1) | Konstant | Akses dict, akses list by index | 1 |
| O(log n) | Logaritmik | Bisection search | ~7 |
| O(n) | Linear | Loop satu kali, linear search | 100 |
| O(n log n) | Log-linear | Merge sort | ~700 |
| O(n²) | Kuadratik | Bubble sort, nested loop | 10.000 |
| O(n³) | Kubik | Matrix multiplication naif | 1.000.000 |
| O(2^n) | Eksponensial | Fibonacci rekursif naif | 10^30 |
| O(n!) | Faktorial | Permutasi brute-force | 9×10^157 |

```python
import math

# Visualisasi pertumbuhan untuk n = 20
n = 20
print(f"O(1)      : 1")
print(f"O(log n)  : {math.log2(n):.1f}")
print(f"O(n)      : {n}")
print(f"O(n log n): {n * math.log2(n):.1f}")
print(f"O(n²)     : {n**2}")
print(f"O(2^n)    : {2**n}")
print(f"O(n!)     : {math.factorial(n):.2e}")
```

---

## Analisis Algoritma Pencarian

### Linear Search: O(n)

```python
def linear_search(L, target):
    for item in L:          # worst case: n iterasi
        if item == target:
            return True
    return False

# Best case:  O(1) — target di index 0
# Worst case: O(n) — target tidak ada atau di akhir
# Average:    O(n/2) = O(n)
```

### Binary Search: O(log n)

Hanya bekerja pada list yang sudah terurut:

```python
def binary_search(L, target):
    low, high = 0, len(L) - 1
    while low <= high:
        mid = (low + high) // 2
        if L[mid] == target:
            return mid
        elif L[mid] < target:
            low = mid + 1   # buang setengah kiri
        else:
            high = mid - 1  # buang setengah kanan
    return -1

# Setiap iterasi membuang SETENGAH kemungkinan
# n → n/2 → n/4 → ... → 1 : butuh log₂(n) langkah
# Untuk n = 1.000.000: hanya ~20 langkah!
```

---

## Algoritma Sorting

### Bogo Sort: O(n × n!) — Jangan Pakai

```python
import random

def bogo_sort(L):
    """Acak terus sampai terurut — algoritma terburuk."""
    while L != sorted(L):
        random.shuffle(L)
    return L
# Complexity: rata-rata O(n × n!) — praktis tidak berguna
```

### Bubble Sort: O(n²)

```python
def bubble_sort(L):
    n = len(L)
    for i in range(n):
        for j in range(0, n - i - 1):
            if L[j] > L[j + 1]:
                L[j], L[j + 1] = L[j + 1], L[j]  # swap
    return L

# Cara kerja: elemen besar "menggelembung" ke akhir
# [5, 3, 1, 4] → [3, 1, 4, 5] → [1, 3, 4, 5]
# O(n²) — dua nested loop
```

### Selection Sort: O(n²)

```python
def selection_sort(L):
    for i in range(len(L)):
        min_idx = i
        for j in range(i + 1, len(L)):
            if L[j] < L[min_idx]:
                min_idx = j
        L[i], L[min_idx] = L[min_idx], L[i]  # taruh minimum di posisi i
    return L
```

### Merge Sort: O(n log n)

Jauh lebih efisien — strategi divide and conquer:

```python
def merge_sort(L):
    if len(L) <= 1:
        return L

    # Bagi dua
    mid = len(L) // 2
    kiri = merge_sort(L[:mid])   # sort kiri secara rekursif
    kanan = merge_sort(L[mid:])  # sort kanan secara rekursif

    # Gabungkan (merge) dua list yang sudah terurut
    return merge(kiri, kanan)

def merge(kiri, kanan):
    hasil = []
    i = j = 0
    while i < len(kiri) and j < len(kanan):
        if kiri[i] <= kanan[j]:
            hasil.append(kiri[i])
            i += 1
        else:
            hasil.append(kanan[j])
            j += 1
    hasil.extend(kiri[i:])
    hasil.extend(kanan[j:])
    return hasil

# Kompleksitas: O(n log n) — n untuk merge, log n untuk rekursi
# [5,3,1,4,2] → [5,3] [1,4,2] → [5][3] [1][4,2] → ... merge
```

### Python Built-in Sort

Untuk kode produksi, pakai `sorted()` atau `.sort()` bawaan Python — implementasi Timsort O(n log n) yang sangat dioptimalkan:

```python
angka = [5, 2, 8, 1, 9, 3]
terurut = sorted(angka)        # buat list baru
angka.sort()                   # sort in-place
angka.sort(reverse=True)       # descending
```

---

## Hashing: Akses O(1) untuk Dictionary

Dictionary Python bisa melakukan lookup, insert, dan delete dalam **O(1)** rata-rata. Rahasianya adalah **hash table**.

```python
# Mengapa ini O(1)?
d = {"nama": "Rifky", "umur": 25}
print(d["nama"])  # langsung, tidak perlu scan satu per satu
```

Cara kerja hash table:
1. Hitung `hash(key)` — angka integer dari key
2. Tentukan index slot: `hash(key) % ukuran_tabel`
3. Simpan/ambil value di slot itu

```python
print(hash("nama"))   # misalnya: -4384838292
print(hash("umur"))   # misalnya: 8732919123
print(hash(42))       # 42 (integer hash ke dirinya sendiri)

# Demonstrasi mengapa list tidak bisa jadi key dict
d[["a", "b"]] = 1  # TypeError: unhashable type: 'list'
# List mutable → hash bisa berubah → tidak bisa jadi key
# Tuple boleh karena immutable
d[("a", "b")] = 1  # ✓
```

---

## Visualisasi Data dengan Matplotlib

Lecture 25–26 memperkenalkan matplotlib untuk memvisualisasikan data.

```python
import matplotlib.pyplot as plt
import numpy as np

# Plot sederhana
x = list(range(0, 11))
y = [xi ** 2 for xi in x]

plt.figure(figsize=(8, 5))
plt.plot(x, y, 'b-o', label='y = x²')
plt.title('Grafik Kuadrat')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True)
plt.savefig('kuadrat.png', dpi=150)
plt.show()
```

### Membandingkan Kompleksitas Secara Visual

```python
import matplotlib.pyplot as plt
import numpy as np

n = np.linspace(1, 20, 100)

plt.figure(figsize=(10, 6))
plt.plot(n, np.ones_like(n),     label='O(1)',      linewidth=2)
plt.plot(n, np.log2(n),          label='O(log n)',  linewidth=2)
plt.plot(n, n,                   label='O(n)',       linewidth=2)
plt.plot(n, n * np.log2(n),      label='O(n log n)',linewidth=2)
plt.plot(n, n ** 2,              label='O(n²)',      linewidth=2)
plt.plot(n, 2 ** n,              label='O(2^n)',     linewidth=2)

plt.ylim(0, 200)
plt.xlabel('Ukuran Input (n)')
plt.ylabel('Jumlah Operasi')
plt.title('Perbandingan Kelas Kompleksitas')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('kompleksitas.png', dpi=150)
plt.show()
```

### Bar Chart dan Histogram

```python
# Bar chart
kategori = ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)']
nilai_n1000 = [10, 1000, 10000, 1000000]

plt.figure(figsize=(8, 5))
plt.bar(kategori, nilai_n1000, color=['green', 'blue', 'orange', 'red'])
plt.yscale('log')  # skala logaritmik untuk range besar
plt.title('Operasi untuk n = 1000')
plt.ylabel('Jumlah Operasi (skala log)')
plt.savefig('bar_kompleksitas.png')
plt.show()

# Histogram dari data random
data = np.random.normal(loc=50, scale=10, size=1000)
plt.figure(figsize=(8, 5))
plt.hist(data, bins=30, edgecolor='black', color='steelblue', alpha=0.7)
plt.title('Distribusi Normal')
plt.xlabel('Nilai')
plt.ylabel('Frekuensi')
plt.savefig('histogram.png')
plt.show()
```

---

## Ringkasan Seri MIT 6.100L

Kita sudah menyelesaikan perjalanan lengkap dari 26 lecture MIT 6.100L:

| Artikel | Topik | Lecture |
|---------|-------|---------|
| 1 | Tipe data, variabel, string, percabangan | 1–2 |
| 2 | Loop, iterasi, bisection search | 3–6 |
| 3 | Fungsi, lambda, tuple, list, dictionary | 7–11, 14 |
| 4 | Testing, debugging, exception, assertion | 12–13 |
| 5 | Rekursi, OOP, class, inheritance | 15–20 |
| 6 | Kompleksitas, Big-O, sorting, visualisasi | 21–26 |

Dari **"komputer itu mesin kalkulator bodoh"** sampai **merge sort O(n log n)** dan **visualisasi data** — ini adalah fondasi computer science yang solid untuk apapun yang kamu bangun selanjutnya.

---

**Sumber:** MIT OpenCourseWare — [6.100L Introduction to CS and Programming Using Python, Fall 2022](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/), Dr. Ana Bell. Lisensi CC BY-NC-SA 4.0.
