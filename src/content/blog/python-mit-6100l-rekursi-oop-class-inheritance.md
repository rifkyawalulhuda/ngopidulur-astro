---
title: "Python MIT 6.100L: Rekursi, OOP, Class, dan Inheritance"
description: Kuasai pemikiran rekursif dan pemrograman berorientasi objek di
  Python — dari rekursi Fibonacci, Tower of Hanoi, hingga class, dunder method,
  dan inheritance dari MIT 6.100L Lecture 15 sampai 20.
pubDate: 2026-08-03T08:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - PemrogramanPemula
  - MIT6100L
  - OOP
---

Dua topik di artikel ini adalah yang paling mengubah cara berpikir seorang programmer: **rekursi** — fungsi yang memanggil dirinya sendiri — dan **Object-Oriented Programming** — cara memodelkan dunia nyata sebagai objek yang punya data dan perilaku sendiri. Keduanya dibahas di MIT 6.100L Lecture 15–20.

## Daftar Isi

- [Rekursi: Fungsi yang Memanggil Diri Sendiri](#rekursi-fungsi-yang-memanggil-diri-sendiri)
- [Rekursi pada Non-Numerik](#rekursi-pada-non-numerik)
- [Fibonacci dan Memoization](#fibonacci-dan-memoization)
- [Object-Oriented Programming](#object-oriented-programming)
- [Mendefinisikan Class](#mendefinisikan-class)
- [Dunder Methods](#dunder-methods)
- [Inheritance dan Subclass](#inheritance-dan-subclass)

---

## Rekursi: Fungsi yang Memanggil Diri Sendiri

Rekursi adalah teknik di mana sebuah fungsi **memanggil dirinya sendiri** dengan input yang lebih kecil, sampai mencapai kasus dasar (base case).

```python
# Faktorial dengan rekursi
def faktorial(n):
    # Base case: kasus terkecil yang bisa langsung dijawab
    if n == 0 or n == 1:
        return 1
    # Recursive case: pecah ke sub-masalah lebih kecil
    return n * faktorial(n - 1)

print(faktorial(5))  # 120
# Cara kerja:
# faktorial(5) = 5 * faktorial(4)
#              = 5 * 4 * faktorial(3)
#              = 5 * 4 * 3 * faktorial(2)
#              = 5 * 4 * 3 * 2 * faktorial(1)
#              = 5 * 4 * 3 * 2 * 1 = 120
```

### Anatomi Rekursi

Setiap fungsi rekursif HARUS punya dua bagian:

1. **Base case** — kondisi berhenti, tidak memanggil diri lagi
2. **Recursive case** — memanggil diri sendiri dengan input yang *lebih kecil menuju base case*

```python
# Jumlahkan semua angka dari 1 sampai n
def jumlah(n):
    if n == 1:          # base case
        return 1
    return n + jumlah(n - 1)  # recursive case

print(jumlah(10))  # 55
```

### Rekursi vs Iterasi

Setiap masalah rekursif bisa diselesaikan dengan iterasi, dan sebaliknya. Pilih yang lebih mudah dipahami:

```python
# Iterasi
def faktorial_iter(n):
    hasil = 1
    for i in range(1, n + 1):
        hasil *= i
    return hasil

# Rekursi — lebih dekat ke definisi matematika
def faktorial_rekur(n):
    return 1 if n <= 1 else n * faktorial_rekur(n - 1)
```

---

## Rekursi pada Non-Numerik

Rekursi tidak hanya untuk angka — sangat powerful untuk string, list, dan struktur bersarang.

```python
# Balik string secara rekursif
def balik_string(s):
    if len(s) <= 1:          # base case
        return s
    return balik_string(s[1:]) + s[0]  # rekursi

print(balik_string("python"))   # "nohtyp"
print(balik_string("hello"))    # "olleh"

# Cek palindrome
def palindrome(s):
    if len(s) <= 1:
        return True
    if s[0] != s[-1]:
        return False
    return palindrome(s[1:-1])

print(palindrome("radar"))   # True
print(palindrome("python"))  # False
```

### Rekursi pada List

```python
# Jumlahkan semua elemen list secara rekursif
def jumlah_list(L):
    if len(L) == 0:
        return 0
    return L[0] + jumlah_list(L[1:])

print(jumlah_list([1, 2, 3, 4, 5]))  # 15

# Ratakan list bersarang
def ratakan(L):
    if len(L) == 0:
        return []
    if isinstance(L[0], list):
        return ratakan(L[0]) + ratakan(L[1:])
    return [L[0]] + ratakan(L[1:])

print(ratakan([1, [2, 3], [4, [5, 6]]]))  # [1, 2, 3, 4, 5, 6]
```

### Tower of Hanoi

Masalah klasik yang elegan dengan rekursi — pindahkan n cakram dari tiang A ke tiang C, lewat B:

```python
def hanoi(n, dari, ke, lewat):
    if n == 1:
        print(f"Pindahkan cakram 1 dari {dari} ke {ke}")
        return
    hanoi(n - 1, dari, lewat, ke)      # pindah n-1 cakram ke B
    print(f"Pindahkan cakram {n} dari {dari} ke {ke}")
    hanoi(n - 1, lewat, ke, dari)      # pindah n-1 cakram ke C

hanoi(3, 'A', 'C', 'B')
# Butuh 2^n - 1 = 7 langkah untuk n=3
```

---

## Fibonacci dan Memoization

Fibonacci klasik dengan rekursi sangat intuitif tapi sangat lambat:

```python
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# fib(10)  → cepat
# fib(40)  → mulai lambat (jutaan panggilan)
# fib(100) → praktis tidak selesai
```

Solusi: **memoization** — simpan hasil yang sudah dihitung.

```python
# Memoization dengan dictionary
memo = {}
def fib_memo(n):
    if n in memo:
        return memo[n]    # pakai hasil yang sudah ada
    if n <= 1:
        return n
    hasil = fib_memo(n - 1) + fib_memo(n - 2)
    memo[n] = hasil       # simpan untuk nanti
    return hasil

print(fib_memo(100))  # selesai instan!

# Python punya decorator bawaan untuk ini
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_cached(n):
    if n <= 1:
        return n
    return fib_cached(n - 1) + fib_cached(n - 2)
```

---

## Object-Oriented Programming

OOP adalah paradigma pemrograman di mana kita mengorganisasi kode sebagai **objek** — entitas yang punya:
- **Atribut** (data/state): apa yang dimiliki objek
- **Method** (perilaku): apa yang bisa dilakukan objek

```python
# Tanpa OOP — data tersebar
nama1, umur1, nilai1 = "Ana", 20, 85
nama2, umur2, nilai2 = "Budi", 21, 78

# Dengan OOP — data terkapsulasi
class Mahasiswa:
    def __init__(self, nama, umur):
        self.nama = nama
        self.umur = umur
        self.nilai = []

    def tambah_nilai(self, n):
        self.nilai.append(n)

    def rata_rata(self):
        return sum(self.nilai) / len(self.nilai) if self.nilai else 0

ana = Mahasiswa("Ana", 20)
ana.tambah_nilai(85)
ana.tambah_nilai(90)
print(ana.rata_rata())  # 87.5
```

---

## Mendefinisikan Class

```python
class Hewan:
    # Class variable — dibagi semua instance
    jumlah_hewan = 0

    def __init__(self, nama, suara):
        # Instance variable — unik per objek
        self.nama = nama
        self.suara = suara
        Hewan.jumlah_hewan += 1

    def bersuara(self):
        print(f"{self.nama} berbunyi: {self.suara}")

    def info(self):
        return f"Hewan: {self.nama}"

# Membuat instance
kucing = Hewan("Kucing", "meow")
anjing = Hewan("Anjing", "woof")

kucing.bersuara()   # Kucing berbunyi: meow
anjing.bersuara()   # Anjing berbunyi: woof
print(Hewan.jumlah_hewan)  # 2
```

### Self

`self` adalah referensi ke objek itu sendiri. Setiap method yang beroperasi pada data instance harus punya `self` sebagai parameter pertama.

```python
class Lingkaran:
    PI = 3.14159

    def __init__(self, jari_jari):
        self.r = jari_jari

    def luas(self):
        return Lingkaran.PI * self.r ** 2

    def keliling(self):
        return 2 * Lingkaran.PI * self.r

c = Lingkaran(5)
print(c.luas())      # 78.53975
print(c.keliling())  # 31.4159
```

---

## Dunder Methods

**Dunder** (double underscore) methods adalah method khusus yang mengontrol bagaimana objek berperilaku dengan operator dan fungsi bawaan Python.

```python
class Vektor:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    # Representasi string — untuk print()
    def __str__(self):
        return f"Vektor({self.x}, {self.y})"

    # Representasi resmi — untuk debugging
    def __repr__(self):
        return f"Vektor({self.x!r}, {self.y!r})"

    # Penjumlahan dengan +
    def __add__(self, lain):
        return Vektor(self.x + lain.x, self.y + lain.y)

    # Perkalian skalar dengan *
    def __mul__(self, skalar):
        return Vektor(self.x * skalar, self.y * skalar)

    # Panjang vektor dengan len()
    def __len__(self):
        return int((self.x ** 2 + self.y ** 2) ** 0.5)

    # Perbandingan dengan ==
    def __eq__(self, lain):
        return self.x == lain.x and self.y == lain.y

v1 = Vektor(2, 3)
v2 = Vektor(1, 4)
print(v1)           # Vektor(2, 3)
print(v1 + v2)      # Vektor(3, 7)
print(v1 * 3)       # Vektor(6, 9)
print(v1 == v2)     # False
```

### Dunder Methods Umum

| Method | Dipanggil saat |
|--------|---------------|
| `__init__` | `Kelas()` — konstruktor |
| `__str__` | `print(obj)`, `str(obj)` |
| `__repr__` | Debugging, REPL |
| `__len__` | `len(obj)` |
| `__add__` | `obj + lain` |
| `__eq__` | `obj == lain` |
| `__lt__` | `obj < lain` |
| `__contains__` | `item in obj` |
| `__getitem__` | `obj[key]` |

---

## Inheritance dan Subclass

Inheritance memungkinkan sebuah class **mewarisi** atribut dan method dari class lain, lalu menambah atau mengubahnya.

```python
class Hewan:
    def __init__(self, nama):
        self.nama = nama

    def bergerak(self):
        print(f"{self.nama} bergerak")

    def makan(self):
        print(f"{self.nama} makan")

# Subclass mewarisi semua dari Hewan
class Anjing(Hewan):
    def __init__(self, nama, ras):
        super().__init__(nama)  # panggil __init__ parent
        self.ras = ras

    # Override method parent
    def bergerak(self):
        print(f"{self.nama} berlari dengan 4 kaki")

    # Method baru khusus Anjing
    def menggonggong(self):
        print(f"{self.nama}: Woof!")

class Burung(Hewan):
    def bergerak(self):
        print(f"{self.nama} terbang")

# Pakai
anjing = Anjing("Rex", "Labrador")
anjing.bergerak()    # Rex berlari dengan 4 kaki (overridden)
anjing.makan()       # Rex makan (inherited)
anjing.menggonggong()  # Rex: Woof! (new)

burung = Burung("Tweety")
burung.bergerak()    # Tweety terbang (overridden)
```

### isinstance() dan Hierarki

```python
print(isinstance(anjing, Anjing))  # True
print(isinstance(anjing, Hewan))   # True — Anjing adalah Hewan
print(isinstance(burung, Anjing))  # False

# Cek class
print(type(anjing))          # <class '__main__.Anjing'>
print(type(anjing).__name__) # 'Anjing'
```

### Contoh Nyata: Fitness Tracker (Lecture 20)

```python
class Aktivitas:
    def __init__(self, durasi, kalori):
        self.durasi = durasi   # menit
        self.kalori = kalori

    def ringkasan(self):
        return f"{durasi} menit, {self.kalori} kal"

class Lari(Aktivitas):
    def __init__(self, durasi, kalori, jarak):
        super().__init__(durasi, kalori)
        self.jarak = jarak  # km

    def kecepatan(self):
        return self.jarak / (self.durasi / 60)  # km/jam

    def ringkasan(self):
        base = super().ringkasan()
        return f"Lari: {base}, {self.jarak} km ({self.kecepatan():.1f} km/h)"

class Renang(Aktivitas):
    def __init__(self, durasi, kalori, kolam):
        super().__init__(durasi, kalori)
        self.kolam = kolam  # panjang kolam (m)

    def ringkasan(self):
        base = super().ringkasan()
        return f"Renang: {base}, {self.kolam}m kolam"

r = Lari(30, 300, 5)
print(r.ringkasan())  # Lari: 30 menit, 300 kal, 5 km (10.0 km/h)
```

---

## Ringkasan

| Konsep | Inti |
|--------|------|
| Base case | Kondisi berhenti rekursi — wajib ada |
| Memoization | Cache hasil rekursi untuk efisiensi |
| Class | Blueprint untuk membuat objek |
| `__init__` | Konstruktor — inisialisasi atribut |
| `self` | Referensi ke objek saat ini |
| Dunder methods | Override perilaku operator bawaan |
| Inheritance | Subclass mewarisi parent, bisa override |
| `super()` | Akses method/konstruktor parent |

---

Artikel berikutnya: **Kompleksitas Algoritma, Big-O, Sorting, dan Visualisasi** — cara mengukur dan membandingkan efisiensi kode secara matematis.

---

**Sumber:** MIT OpenCourseWare — [6.100L Introduction to CS and Programming Using Python, Fall 2022](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/), Dr. Ana Bell. Lisensi CC BY-NC-SA 4.0.
