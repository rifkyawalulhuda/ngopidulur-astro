---
title: "Python MIT 6.100L: Iterasi, Loop, dan Algoritma Pencarian"
description: Kuasai loop while dan for di Python — dari guess-and-check, binary
  number, float representation, hingga bisection search dan Newton-Raphson dari
  materi kuliah MIT 6.100L Dr. Ana Bell.
pubDate: 2026-07-31T08:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - PemrogramanPemula
  - MIT6100L
  - Algoritma
---

Loop adalah salah satu konsep paling powerful dalam pemrograman. Dengan loop, kamu bisa menyuruh komputer mengulang pekerjaan ribuan kali — pekerjaan yang mustahil dilakukan manual. Artikel ini merangkum Lecture 3–6 dari MIT 6.100L, mencakup iterasi, loop `while` dan `for`, representasi bilangan biner, float, hingga algoritma pencarian efisien.

## Daftar Isi

- [Loop While: Ulangi Selama Kondisi Benar](#loop-while-ulangi-selama-kondisi-benar)
- [Loop For: Iterasi Terstruktur](#loop-for-iterasi-terstruktur)
- [Guess-and-Check: Algoritma Sederhana](#guess-and-check-algoritma-sederhana)
- [Bilangan Biner dan Representasi Desimal](#bilangan-biner-dan-representasi-desimal)
- [Float dan Ketidakakuratan Desimal](#float-dan-ketidakakuratan-desimal)
- [Metode Aproksimasi](#metode-aproksimasi)
- [Bisection Search](#bisection-search)
- [Newton-Raphson](#newton-raphson)

---

## Loop While: Ulangi Selama Kondisi Benar

Loop `while` terus berjalan selama kondisinya `True`. Begitu kondisi menjadi `False`, loop berhenti.

```python
# Hitung mundur dari 5
n = 5
while n > 0:
    print(n)
    n -= 1
print("Selesai!")
# Output: 5, 4, 3, 2, 1, Selesai!
```

### Anatomi Loop While

```python
# Pola umum
inisialisasi_variabel = nilai_awal
while kondisi:
    # lakukan sesuatu
    update_variabel  # WAJIB — tanpa ini loop tak pernah berhenti
```

> **Infinite loop**: kalau kamu lupa mengupdate variabel, program akan berjalan selamanya. Gunakan `Ctrl+C` untuk menghentikannya.

```python
# Contoh infinite loop (JANGAN dijalankan)
x = 5
while x > 0:
    print(x)
    # lupa: x -= 1 → loop selamanya
```

### Break dan Continue

```python
# break — keluar dari loop sepenuhnya
i = 0
while True:
    i += 1
    if i == 5:
        break
print(f"Berhenti di i = {i}")  # Berhenti di i = 5

# continue — lewati iterasi ini, lanjut ke berikutnya
for i in range(10):
    if i % 2 == 0:
        continue  # lewati bilangan genap
    print(i)  # hanya cetak ganjil: 1, 3, 5, 7, 9
```

---

## Loop For: Iterasi Terstruktur

Loop `for` digunakan saat kamu tahu berapa kali ingin mengulang, atau ingin iterasi melalui koleksi data.

```python
# range(n) — dari 0 sampai n-1
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(start, stop) — dari start sampai stop-1
for i in range(2, 7):
    print(i)  # 2, 3, 4, 5, 6

# range(start, stop, step) — dengan langkah tertentu
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# Iterasi mundur
for i in range(5, 0, -1):
    print(i)  # 5, 4, 3, 2, 1
```

### Iterasi pada String

```python
kata = "Python"
for huruf in kata:
    print(huruf)
# P, y, t, h, o, n

# Hitung kemunculan huruf
kata = "programming"
jumlah_g = 0
for c in kata:
    if c == 'g':
        jumlah_g += 1
print(f"Huruf 'g' muncul {jumlah_g} kali")  # 2 kali
```

---

## Guess-and-Check: Algoritma Sederhana

*Guess-and-check* (tebak dan periksa) adalah pendekatan brute-force: coba semua kemungkinan sampai ketemu jawaban yang benar.

```python
# Cari akar kubik dari sebuah bilangan bulat
angka = 27
tebakan = 0
while tebakan ** 3 < abs(angka):
    tebakan += 1

if tebakan ** 3 == abs(angka):
    if angka < 0:
        tebakan = -tebakan
    print(f"Akar kubik dari {angka} adalah {tebakan}")
else:
    print(f"{angka} tidak memiliki akar kubik bulat")
```

Pendekatan ini sederhana tapi lambat — untuk angka besar, perlu jutaan iterasi. Ini yang mendorong kita mencari algoritma lebih efisien.

---

## Bilangan Biner dan Representasi Desimal

Komputer menyimpan semua data dalam biner (basis 2). Memahami ini penting untuk mengerti keterbatasan float.

```python
# Konversi desimal ke biner secara manual
def desimal_ke_biner(n):
    if n == 0:
        return "0"
    hasil = ""
    while n > 0:
        hasil = str(n % 2) + hasil
        n //= 2
    return hasil

print(desimal_ke_biner(10))  # "1010"
print(desimal_ke_biner(255)) # "11111111"

# Python punya bawaan
print(bin(10))   # '0b1010'
print(bin(255))  # '0b11111111'
```

### Konversi Pecahan ke Biner

Pecahan desimal bisa jadi masalah karena tidak semua bisa direpresentasikan tepat dalam biner:

- 0.5 = 1/2 → biner: `0.1` ✓
- 0.25 = 1/4 → biner: `0.01` ✓
- 0.1 = ? → biner: `0.0001100110011...` (berulang tak terbatas) ✗

---

## Float dan Ketidakakuratan Desimal

Ini salah satu jebakan paling umum untuk programmer baru:

```python
# Tampaknya sederhana...
x = 0.1 + 0.2
print(x)          # 0.30000000000000004 (!)
print(x == 0.3)   # False (!)

# Kenapa?
# 0.1 dan 0.2 tidak bisa direpresentasikan tepat dalam biner 64-bit
print(f"{0.1:.20f}")  # 0.10000000000000000555...
```

### Cara Aman Membandingkan Float

```python
# SALAH — jangan bandingkan float dengan ==
if 0.1 + 0.2 == 0.3:
    print("sama")  # tidak akan tercetak

# BENAR — gunakan toleransi (epsilon)
epsilon = 1e-10
if abs(0.1 + 0.2 - 0.3) < epsilon:
    print("cukup sama")  # ✓

# Atau pakai math.isclose()
import math
print(math.isclose(0.1 + 0.2, 0.3))  # True
```

---

## Metode Aproksimasi

Karena tidak semua akar bisa dinyatakan tepat, kita pakai aproksimasi — mencari jawaban yang "cukup dekat".

```python
# Cari akar kuadrat dengan aproksimasi
angka = 2.0
epsilon = 0.001  # toleransi error
langkah = epsilon ** 2
tebakan = 0.0
jumlah_tebakan = 0

while abs(tebakan ** 2 - angka) >= epsilon:
    tebakan += langkah
    jumlah_tebakan += 1

print(f"Tebakan: {tebakan:.4f}")
print(f"Jumlah langkah: {jumlah_tebakan}")
# Tebakan: 1.4142 — tapi perlu ~14.000 langkah!
```

Metode ini benar, tapi tidak efisien. Di sinilah bisection search masuk.

---

## Bisection Search

Bisection search (pencarian bagi dua) jauh lebih efisien. Idenya: selalu tebak di *tengah* range yang mungkin, lalu buang setengah yang tidak mungkin.

```python
# Cari akar kuadrat dengan bisection search
angka = 25
epsilon = 0.001
batas_bawah = 0
batas_atas = max(1, angka)
tebakan = (batas_atas + batas_bawah) / 2
jumlah_tebakan = 0

while abs(tebakan ** 2 - angka) >= epsilon:
    if tebakan ** 2 < angka:
        batas_bawah = tebakan  # jawaban ada di atas
    else:
        batas_atas = tebakan   # jawaban ada di bawah
    tebakan = (batas_atas + batas_bawah) / 2
    jumlah_tebakan += 1

print(f"Akar kuadrat {angka} ≈ {tebakan:.4f}")
print(f"Jumlah langkah: {jumlah_tebakan}")
# Akar kuadrat 25 ≈ 5.0000 — hanya perlu ~13 langkah!
```

### Kenapa Bisection Jauh Lebih Cepat?

Setiap iterasi, range kemungkinan **berkurang setengah**. Untuk mencari nilai di antara 1 juta kemungkinan:
- Aproksimasi linear: ~1.000.000 langkah
- Bisection search: hanya ~20 langkah (log₂ 1.000.000 ≈ 20)

Ini adalah contoh pertama kita tentang **efisiensi algoritma** — topik yang akan kita dalami di artikel tentang Big-O.

---

## Newton-Raphson

Newton-Raphson adalah metode yang bahkan lebih cepat dari bisection, khususnya untuk mencari akar polinomial.

Untuk mencari akar kuadrat dari `p`, kita cari `x` di mana `x² - p = 0`. Rumus Newton-Raphson:

```
tebakan_baru = tebakan - f(tebakan) / f'(tebakan)
```

Untuk `f(x) = x² - p`, maka `f'(x) = 2x`, sehingga:

```
tebakan_baru = tebakan - (tebakan² - p) / (2 × tebakan)
             = (tebakan + p/tebakan) / 2
```

```python
# Newton-Raphson untuk akar kuadrat
p = 24
epsilon = 0.01
k = p / 2.0  # tebakan awal
jumlah = 0

while abs(k * k - p) >= epsilon:
    k = k - ((k ** 2 - p) / (2 * k))
    jumlah += 1

print(f"Akar kuadrat {p} ≈ {k:.4f}")
print(f"Jumlah iterasi: {jumlah}")
# Konvergen sangat cepat — biasanya < 10 iterasi
```

---

## Ringkasan Perbandingan Metode

| Metode | Kelebihan | Kekurangan |
|--------|-----------|------------|
| Guess-and-check | Sederhana, mudah dipahami | Sangat lambat untuk angka besar |
| Aproksimasi linear | Mudah diimplementasi | Masih lambat, banyak langkah kecil |
| Bisection search | Efisien O(log n), selalu konvergen | Lebih kompleks |
| Newton-Raphson | Sangat cepat konvergen | Perlu turunan fungsi |

---

Artikel berikutnya: **Fungsi, Lambda, Tuple, List, dan Dictionary** — membangun blok-blok kode yang bisa digunakan ulang dan menyimpan koleksi data.

---

**Sumber:** MIT OpenCourseWare — [6.100L Introduction to CS and Programming Using Python, Fall 2022](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/), Dr. Ana Bell. Lisensi CC BY-NC-SA 4.0.
