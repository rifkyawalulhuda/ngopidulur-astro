---
title: "Dasar-Dasar Python: Keywords, Variabel, Tipe Data, dan Indentasi"
description: Panduan lengkap dasar Python untuk pemula — memahami keywords dan
  identifier, variabel dan assignment, tipe data numerik (int, float, complex),
  boolean, indentasi wajib Python, komentar, docstring, dan cara kerja memori
  objek Python. Dilengkapi contoh kode praktis.
pubDate: 2026-06-29T14:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - PemrogramanPython
  - BelajarPython
  - TipeData
  - Variabel
  - PythonPemula
---

Python adalah bahasa pemrograman yang dirancang untuk **mudah dibaca dan ditulis**. Sintaksnya bersih, ekspresif, dan produktif — itulah kenapa Python jadi bahasa #1 untuk data science, web development, automation, dan AI.

## Keywords: Kata Kunci Khusus Python

Keywords adalah kata-kata yang **sudah dipesan** oleh Python — tidak bisa digunakan sebagai nama variabel, fungsi, atau identifier lain.

```python
import keyword
print(keyword.kwlist)
# ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
#  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
#  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
#  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
#  'try', 'while', 'with', 'yield']

len(keyword.kwlist)  # 35 keywords
```

### Contoh Penggunaan yang Benar vs Salah

```python
# SALAH - tidak bisa pakai keyword sebagai identifier
import = 125        # SyntaxError
1var = 10           # SyntaxError - tidak bisa mulai dengan angka
val2@ = 35          # SyntaxError - tidak bisa pakai simbol khusus

# BENAR
import_data = 125   # tambahkan underscore
var1 = 10           # angka di belakang boleh
val2_data = 35      # underscore boleh
```

### Aturan Penamaan Identifier

| Aturan | Contoh Benar | Contoh Salah |
|--------|-------------|-------------|
| Huruf/angka/underscore saja | `val_2`, `myVar` | `val@2`, `my-var` |
| Tidak boleh mulai angka | `var1` | `1var` |
| Case-sensitive | `name` ≠ `Name` ≠ `NAME` | — |
| Tidak boleh keyword | `for_loop` | `for` |

---

## Komentar dan Docstring

### Komentar

```python
# Single line comment
val1 = 10

# Multiple
# line
# comment
val2 = 20

''' Multiple line comment
    menggunakan triple quotes '''
val3 = 30

""" Multiple line comment
    menggunakan double triple quotes """
val4 = 40
```

### Docstring

Docstring adalah dokumentasi yang melekat pada fungsi, class, atau module:

```python
def square(num):
    '''Square Function: mengembalikan kuadrat dari sebuah angka'''
    return num ** 2

def even_odd(num):
    """Cek apakah angka genap atau ganjil"""
    if num % 2 == 0:
        print("Genap")
    else:
        print("Ganjil")

# Akses docstring
print(square.__doc__)
# 'Square Function: mengembalikan kuadrat dari sebuah angka'

square(4)   # 16
even_odd(3) # Ganjil
even_odd(2) # Genap
```

---

## Indentasi: Aturan Wajib Python

Python menggunakan **indentasi** (spasi di awal baris) untuk menentukan blok kode — bukan kurung kurawal seperti C/Java.

```python
# BENAR
p = 10
if p == 10:
    print("P sama dengan 10")  # indentasi 4 spasi

# SALAH - akan error!
p = 10
if p == 10:
print("P sama dengan 10")  # IndentationError!
```

```python
# Loop dengan indentasi
j = 20
for i in range(0, 5):
    print(i)    # dalam loop - diindentasi
print(j)        # luar loop - tidak diindentasi

# Output:
# 0 1 2 3 4
# 20
```

> **Tips:** Gunakan **4 spasi** per level indentasi (standar PEP 8). Jangan campur tab dan spasi.

---

## Variabel: Menyimpan Data di Memori

Variabel Python adalah **referensi ke objek** di memori — bukan kotak yang menyimpan nilai.

### Deklarasi dan Assignment

```python
# Deklarasi dan assignment sekaligus
intvar = 10           # Integer
floatvar = 2.57       # Float
strvar = "Python"     # String

# Multiple assignment dalam satu baris
intvar, floatvar, strvar = 10, 2.57, "Python"

# Semua variabel menunjuk ke nilai yang sama
p1 = p2 = p3 = p4 = 44
print(p1, p2, p3, p4)  # 44 44 44 44

# Overwrite variabel
p = 20
p = p + 10  # p sekarang 30
```

### Cara Python Menyimpan Variabel di Memori

```python
import sys

p = 20
q = 20  # q menunjuk ke objek yang SAMA dengan p
r = q   # r juga menunjuk ke objek yang sama

print(hex(id(p)))  # '0x7fff6d71a3f0'
print(hex(id(q)))  # '0x7fff6d71a3f0' - alamat sama!
print(hex(id(r)))  # '0x7fff6d71a3f0' - alamat sama!
```

Python mengoptimalkan memori dengan **object interning** — integer kecil (-5 sampai 256) dan string pendek di-cache dan dibagi antar variabel.

---

## Tipe Data Python

### 1. Numerik

#### Integer (int)

```python
import sys

val1 = 10
print(type(val1))           # <class 'int'>
print(sys.getsizeof(val1))  # 28 bytes
print(isinstance(val1, int)) # True

# Operasi integer
print(10 + 3)   # 13  (penjumlahan)
print(10 - 3)   # 7   (pengurangan)
print(10 * 3)   # 30  (perkalian)
print(10 / 3)   # 3.333... (pembagian - hasilnya float)
print(10 // 3)  # 3   (floor division)
print(10 % 3)   # 1   (modulus)
print(10 ** 3)  # 1000 (pangkat)
```

#### Float

```python
val2 = 92.78
print(type(val2))            # <class 'float'>
print(sys.getsizeof(val2))   # 24 bytes
print(isinstance(val2, float)) # True

# Float precision
print(0.1 + 0.2)             # 0.30000000000000004 (floating point issue)
print(round(0.1 + 0.2, 2))   # 0.3
```

#### Complex

```python
val3 = 25 + 10j
print(type(val3))               # <class 'complex'>
print(sys.getsizeof(val3))      # 32 bytes
print(isinstance(val3, complex)) # True
print(val3.real)                # 25.0
print(val3.imag)                # 10.0
```

### 2. Boolean

```python
bool1 = True
bool2 = False

print(type(bool1))  # <class 'bool'>
print(isinstance(bool1, bool))  # True

# Konversi ke bool
print(bool(0))      # False
print(bool(1))      # True
print(bool(None))   # False
print(bool(""))     # False
print(bool("hi"))   # True
print(bool([]))     # False
print(bool([1,2]))  # True
```

> **Catatan:** `bool` adalah subclass dari `int` di Python. `True == 1` dan `False == 0`.

### Ringkasan Tipe Data

| Tipe | Contoh | Ukuran | Keterangan |
|------|--------|--------|-----------|
| `int` | `10`, `-5`, `0` | 28 bytes | Integer tak terbatas |
| `float` | `3.14`, `-0.5` | 24 bytes | Presisi 64-bit |
| `complex` | `3+4j` | 32 bytes | Bilangan kompleks |
| `bool` | `True`, `False` | 28 bytes | Subclass dari int |
| `str` | `"hello"` | variabel | Immutable sequence |
| `list` | `[1,2,3]` | variabel | Mutable sequence |
| `tuple` | `(1,2,3)` | variabel | Immutable sequence |
| `dict` | `{"a":1}` | variabel | Key-value mapping |
| `set` | `{1,2,3}` | variabel | Unordered unique |

---

## Statements: Perintah Python

```python
# Single line statement
p1 = 10 + 20        # p1 = 30
p2 = ['a', 'b', 'c']

# Multi-line statement dengan backslash
p3 = 20 + 30 \
   + 40 + 50 \
   + 70 + 80        # p3 = 290

# Multi-line statement dengan bracket
p4 = ['a', 'b',
      'c', 'd']
```

---

## Kesimpulan

Fondasi Python yang perlu dikuasai pemula:

1. **Keywords** — 35 kata khusus yang tidak bisa dipakai sebagai identifier
2. **Indentasi** — wajib 4 spasi, bukan opsional seperti bahasa lain
3. **Variabel** — referensi ke objek, bukan kotak nilai
4. **Tipe data** — int, float, complex, bool adalah tipe dasar numerik

Di artikel berikutnya: **String Python** — tipe data paling sering digunakan, dengan puluhan method bawaan.

---

*Referensi: Python Tutorial — Jupyter Notebook by Asif Bhat, Keywords, Variables, Data Types.*
