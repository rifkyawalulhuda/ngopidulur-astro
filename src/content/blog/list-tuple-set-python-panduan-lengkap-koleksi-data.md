---
title: "List, Tuple, dan Set Python: Panduan Lengkap Koleksi Data"
description: Panduan lengkap List, Tuple, dan Set Python — perbedaan mutable
  vs immutable, operasi CRUD pada list, slicing, list comprehension, tuple
  packing/unpacking, frozenset, set operations (union, intersection, difference),
  dan panduan memilih koleksi yang tepat. Dilengkapi contoh kode praktis.
pubDate: 2026-06-29T16:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - List
  - Tuple
  - Set
  - PemrogramanPython
  - BelajarPython
  - KoleksiData
---

Python punya empat tipe koleksi bawaan: **List, Tuple, Set, dan Dictionary**. Masing-masing punya karakteristik berbeda — memilih yang tepat akan membuat kode lebih efisien dan ekspresif.

## List: Koleksi Mutable dan Terurut

List adalah koleksi yang **bisa diubah** (mutable), **terurut** (ordered), dan **mengizinkan duplikat**.

### Membuat List

```python
# List kosong
mylist = []
mylist = list()

# List dengan elemen
fruits = ['apple', 'banana', 'cherry']
numbers = [1, 2, 3, 4, 5]
mixed = [1, 'hello', 3.14, True, None]   # boleh campuran tipe
nested = [[1, 2], [3, 4], [5, 6]]        # list bersarang

print(type(fruits))   # <class 'list'>
print(len(fruits))    # 3
```

### Indexing dan Slicing

```python
fruits = ['apple', 'banana', 'cherry', 'date', 'elderberry']

# Indexing
print(fruits[0])    # 'apple'
print(fruits[-1])   # 'elderberry'
print(fruits[2])    # 'cherry'

# Slicing
print(fruits[1:3])  # ['banana', 'cherry']
print(fruits[:3])   # ['apple', 'banana', 'cherry']
print(fruits[2:])   # ['cherry', 'date', 'elderberry']
print(fruits[::-1]) # reverse: ['elderberry', 'date', 'cherry', 'banana', 'apple']
```

### Operasi CRUD

```python
fruits = ['apple', 'banana', 'cherry']

# CREATE / INSERT
fruits.append('date')           # tambah di akhir
fruits.insert(1, 'avocado')     # insert di index 1
fruits.extend(['elderberry', 'fig'])  # tambah multiple items

# READ
print(fruits.index('banana'))   # 1 (index pertama)
print(fruits.count('apple'))    # 1 (jumlah kemunculan)
print('cherry' in fruits)       # True

# UPDATE
fruits[0] = 'apricot'           # update by index

# DELETE
fruits.remove('banana')         # hapus by nilai (pertama ditemukan)
popped = fruits.pop()           # hapus & return elemen terakhir
popped2 = fruits.pop(0)         # hapus & return index tertentu
del fruits[1]                   # hapus by index
fruits.clear()                  # hapus semua elemen
```

### Sorting dan Reversing

```python
nums = [3, 1, 4, 1, 5, 9, 2, 6]

# Sort in-place (ubah list asli)
nums.sort()                     # ascending: [1, 1, 2, 3, 4, 5, 6, 9]
nums.sort(reverse=True)         # descending: [9, 6, 5, 4, 3, 2, 1, 1]

# Sort tanpa ubah list asli
sorted_nums = sorted(nums)      # return list baru

# Reverse
nums.reverse()                  # balik urutan in-place
reversed_nums = list(reversed(nums))  # return iterator

# Sort string
words = ['banana', 'apple', 'cherry']
words.sort()                    # ['apple', 'banana', 'cherry']
words.sort(key=len)             # sort by panjang: ['apple', 'banana', 'cherry']
```

### List Comprehension

Cara ringkas membuat list baru dari list lain:

```python
# Syntax: [ekspresi for item in iterable if kondisi]

# Kuadrat semua angka
squares = [x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]

# Filter genap saja
evens = [x for x in range(1, 11) if x % 2 == 0]
# [2, 4, 6, 8, 10]

# Uppercase semua kata
words = ['hello', 'world', 'python']
upper = [w.upper() for w in words]
# ['HELLO', 'WORLD', 'PYTHON']

# Nested list comprehension (flatten 2D list)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
flat = [x for row in matrix for x in row]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Copy List

```python
original = [1, 2, 3, [4, 5]]

# Shallow copy (perubahan nested list ikut terdampak)
copy1 = original.copy()
copy2 = original[:]
copy3 = list(original)

# Deep copy (benar-benar independen)
import copy
deep = copy.deepcopy(original)
```

---

## Tuple: Koleksi Immutable dan Terurut

Tuple mirip list tapi **tidak bisa diubah** setelah dibuat. Lebih cepat dan hemat memori.

### Membuat Tuple

```python
# Tuple kosong
t = ()
t = tuple()

# Tuple dengan elemen
t1 = (1, 2, 3)
t2 = 1, 2, 3        # tanpa tanda kurung
t3 = (42,)          # tuple satu elemen — HARUS ada koma!
t4 = 42,            # juga valid

print(type(t3))     # <class 'tuple'>
print(type(42))     # <class 'int'> — tanpa koma bukan tuple!
```

### Operasi Tuple

```python
t = (10, 20, 30, 40, 50)

# Indexing & slicing — sama seperti list
print(t[0])      # 10
print(t[-1])     # 50
print(t[1:3])    # (20, 30)

# Count & index
print(t.count(20))   # 1
print(t.index(30))   # 2

# Iterasi
for item in t:
    print(item)

# Cek membership
print(30 in t)   # True
```

### Tuple Packing dan Unpacking

```python
# Packing — gabung beberapa nilai ke tuple
point = (3, 4)
person = ('Budi', 25, 'Jakarta')

# Unpacking — ekstrak nilai dari tuple
x, y = point
print(x, y)     # 3 4

name, age, city = person
print(name)     # 'Budi'

# Extended unpacking
first, *rest = (1, 2, 3, 4, 5)
print(first)    # 1
print(rest)     # [2, 3, 4, 5]

# Swap variabel elegan
a, b = 10, 20
a, b = b, a
print(a, b)     # 20 10
```

### Kapan Pakai Tuple vs List?

| | List | Tuple |
|-|------|-------|
| **Mutable** | ✅ Bisa diubah | ❌ Tidak bisa |
| **Kecepatan** | Lebih lambat | Lebih cepat |
| **Memori** | Lebih besar | Lebih kecil |
| **Penggunaan** | Data yang berubah | Data tetap/konstan |
| **Contoh** | Daftar belanja | Koordinat, RGB |

---

## Set: Koleksi Unik dan Tidak Terurut

Set adalah koleksi **tanpa duplikat**, **tidak terurut**, dan menggunakan operasi matematika himpunan.

### Membuat Set

```python
# Set dari literal
s1 = {1, 2, 3, 4, 5}
s2 = {'apple', 'banana', 'cherry'}

# Set dari list (otomatis hapus duplikat)
nums = [1, 2, 2, 3, 3, 3, 4]
unique = set(nums)
print(unique)   # {1, 2, 3, 4}

# Set kosong — HARUS pakai set(), bukan {}
empty = set()   # bukan {} karena itu dict!
```

### Operasi Set

```python
s = {1, 2, 3}

# Tambah elemen
s.add(4)            # {1, 2, 3, 4}
s.update([5, 6])    # {1, 2, 3, 4, 5, 6}

# Hapus elemen
s.remove(3)         # error jika tidak ada
s.discard(99)       # tidak error jika tidak ada
s.pop()             # hapus elemen random

# Cek membership
print(2 in s)       # True
```

### Operasi Matematika Set

```python
A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}

# Union — semua elemen dari A dan B
print(A | B)            # {1, 2, 3, 4, 5, 6, 7, 8}
print(A.union(B))       # sama

# Intersection — elemen yang ada di A DAN B
print(A & B)            # {4, 5}
print(A.intersection(B))

# Difference — elemen di A tapi tidak di B
print(A - B)            # {1, 2, 3}
print(A.difference(B))

# Symmetric Difference — elemen yang hanya ada di salah satu
print(A ^ B)            # {1, 2, 3, 6, 7, 8}
print(A.symmetric_difference(B))

# Subset dan Superset
C = {1, 2, 3}
print(C.issubset(A))    # True  — C ⊆ A
print(A.issuperset(C))  # True  — A ⊇ C
print(A.isdisjoint(B))  # False — ada irisan
```

### Frozenset: Set Immutable

```python
fs = frozenset([1, 2, 3, 4])
print(type(fs))  # <class 'frozenset'>

# Bisa dipakai sebagai dict key atau elemen set lain
d = {frozenset([1,2]): 'pair'}
```

---

## Perbandingan List, Tuple, dan Set

| Aspek | List | Tuple | Set |
|-------|------|-------|-----|
| **Syntax** | `[1, 2]` | `(1, 2)` | `{1, 2}` |
| **Ordered** | ✅ | ✅ | ❌ |
| **Mutable** | ✅ | ❌ | ✅ |
| **Duplikat** | ✅ | ✅ | ❌ |
| **Indexing** | ✅ | ✅ | ❌ |
| **Kecepatan lookup** | O(n) | O(n) | O(1) |
| **Use case** | Data ordered, berubah | Data tetap | Deduplication, operasi himpunan |

## Kesimpulan

- Pakai **List** untuk koleksi yang perlu diubah dan urutannya penting
- Pakai **Tuple** untuk data yang tidak berubah (koordinat, config, return multiple values)
- Pakai **Set** untuk menghapus duplikat atau operasi himpunan (union, intersection)

Di artikel berikutnya: **Dictionary Python** — struktur key-value yang paling powerful.

---

*Referensi: Python Tutorial — Jupyter Notebook by Asif Bhat, Lists, Tuples, Sets.*
