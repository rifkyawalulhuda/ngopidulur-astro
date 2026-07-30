---
title: "Dictionary Python: Panduan Lengkap Struktur Data Key-Value"
description: Panduan lengkap Dictionary Python — membuat dict, operasi CRUD,
  nested dict, dict comprehension, iterasi keys/values/items, method bawaan
  seperti get, update, pop, setdefault, dan perbandingan dengan struktur data
  lain. Dilengkapi contoh kode praktis untuk pemula hingga menengah.
pubDate: 2026-06-29T17:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - Dictionary
  - PemrogramanPython
  - BelajarPython
  - DataStructure
series: "Python Dasar"
seriesOrder: 4
---

**Dictionary** adalah struktur data paling powerful di Python — menyimpan data dalam pasangan key-value, akses O(1), dan sangat fleksibel. Hampir semua Python developer menggunakannya setiap hari.

## Membuat Dictionary

```python
# Dict kosong
d = {}
d = dict()

# Dict literal
person = {
    'name': 'Budi',
    'age': 25,
    'city': 'Jakarta'
}

# Dict dari list of tuples
d = dict([('name', 'Budi'), ('age', 25)])

# Dict dari keyword arguments
d = dict(name='Budi', age=25)

# Dict dengan tipe nilai beragam
data = {
    'nama': 'Siti',
    'nilai': [85, 90, 78],       # list sebagai value
    'aktif': True,
    'alamat': {                   # nested dict
        'kota': 'Bandung',
        'kodepos': '40111'
    }
}

print(type(person))   # <class 'dict'>
print(len(person))    # 3
```

---

## Akses dan Modifikasi

### Read

```python
person = {'name': 'Budi', 'age': 25, 'city': 'Jakarta'}

# Akses by key
print(person['name'])         # 'Budi'
print(person['age'])          # 25

# Pakai get() — lebih aman, tidak raise KeyError
print(person.get('name'))     # 'Budi'
print(person.get('phone'))    # None (key tidak ada)
print(person.get('phone', 'tidak tersedia'))  # 'tidak tersedia'

# Cek key
print('name' in person)       # True
print('phone' in person)      # False
print('phone' not in person)  # True
```

### Create / Update

```python
person = {'name': 'Budi', 'age': 25}

# Tambah key baru
person['city'] = 'Jakarta'
person['email'] = 'budi@email.com'

# Update nilai
person['age'] = 26

# Update multiple sekaligus
person.update({'age': 27, 'phone': '08123456'})
person.update(city='Surabaya')

# setdefault — set jika key belum ada, skip jika sudah ada
person.setdefault('country', 'Indonesia')  # tambah
person.setdefault('name', 'Anonim')        # skip, 'name' sudah ada

print(person)
# {'name': 'Budi', 'age': 27, 'city': 'Surabaya', 'email': '...', ...}
```

### Delete

```python
person = {'name': 'Budi', 'age': 25, 'city': 'Jakarta', 'email': 'b@b.com'}

# pop() — hapus & return value
age = person.pop('age')          # 25
missing = person.pop('phone', 0) # 0 (default jika tidak ada)

# popitem() — hapus & return pasangan key-value terakhir
last = person.popitem()          # ('email', 'b@b.com')

# del
del person['city']

# clear() — hapus semua
person.clear()
```

---

## Iterasi Dictionary

```python
person = {'name': 'Budi', 'age': 25, 'city': 'Jakarta'}

# Iterasi keys (default)
for key in person:
    print(key)          # name, age, city

for key in person.keys():
    print(key)          # sama

# Iterasi values
for val in person.values():
    print(val)          # Budi, 25, Jakarta

# Iterasi key-value pairs
for key, val in person.items():
    print(f"{key}: {val}")
# name: Budi
# age: 25
# city: Jakarta
```

---

## Dict Methods Penting

```python
d = {'a': 1, 'b': 2, 'c': 3}

# keys(), values(), items()
print(list(d.keys()))    # ['a', 'b', 'c']
print(list(d.values()))  # [1, 2, 3]
print(list(d.items()))   # [('a', 1), ('b', 2), ('c', 3)]

# copy()
d2 = d.copy()            # shallow copy

# fromkeys() — buat dict dari list keys
keys = ['x', 'y', 'z']
new_d = dict.fromkeys(keys, 0)
print(new_d)   # {'x': 0, 'y': 0, 'z': 0}

# len()
print(len(d))  # 3
```

---

## Dict Comprehension

```python
# Syntax: {key_expr: val_expr for item in iterable if kondisi}

# Kuadrat angka
squares = {x: x**2 for x in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Filter nilai > 2
d = {'a': 1, 'b': 2, 'c': 3, 'd': 4}
filtered = {k: v for k, v in d.items() if v > 2}
# {'c': 3, 'd': 4}

# Invert dict (swap key-value)
original = {'a': 1, 'b': 2, 'c': 3}
inverted = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}

# Dari dua list
keys = ['name', 'age', 'city']
vals = ['Budi', 25, 'Jakarta']
person = {k: v for k, v in zip(keys, vals)}
# {'name': 'Budi', 'age': 25, 'city': 'Jakarta'}
```

---

## Nested Dictionary

```python
# Dict bersarang
students = {
    'S001': {
        'name': 'Budi',
        'grades': {'math': 90, 'english': 85}
    },
    'S002': {
        'name': 'Siti',
        'grades': {'math': 88, 'english': 92}
    }
}

# Akses nested
print(students['S001']['name'])              # 'Budi'
print(students['S001']['grades']['math'])    # 90

# Update nested
students['S001']['grades']['math'] = 95

# Iterasi nested
for sid, info in students.items():
    print(f"{sid}: {info['name']}")
    for subject, grade in info['grades'].items():
        print(f"  {subject}: {grade}")
```

---

## Merge Dictionary (Python 3.9+)

```python
d1 = {'a': 1, 'b': 2}
d2 = {'c': 3, 'd': 4}

# Merge dengan | (Python 3.9+)
merged = d1 | d2
# {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# Update in-place dengan |=
d1 |= d2

# Cara lama (semua versi Python)
merged = {**d1, **d2}
```

---

## Use Case Umum

```python
# 1. Counter (hitung frekuensi)
words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
counter = {}
for word in words:
    counter[word] = counter.get(word, 0) + 1
print(counter)  # {'apple': 3, 'banana': 2, 'cherry': 1}

# Atau pakai Counter dari collections
from collections import Counter
counter = Counter(words)

# 2. Grouping data
students = [
    {'name': 'Budi', 'kelas': 'A'},
    {'name': 'Siti', 'kelas': 'B'},
    {'name': 'Andi', 'kelas': 'A'},
]
by_class = {}
for s in students:
    kelas = s['kelas']
    by_class.setdefault(kelas, []).append(s['name'])
print(by_class)  # {'A': ['Budi', 'Andi'], 'B': ['Siti']}

# 3. Caching / memoization
cache = {}
def fib(n):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fib(n-1) + fib(n-2)
    return cache[n]
```

---

## Kesimpulan

Dictionary adalah tulang punggung Python — digunakan di mana-mana dari JSON parsing hingga caching. Kuasai:
- `get()` untuk akses aman
- `items()` untuk iterasi
- dict comprehension untuk transformasi data
- `update()` dan `|` untuk merge

Di artikel berikutnya: **Functions dan OOP Python** — fungsi, lambda, decorator, dan class.

---

*Referensi: Python Tutorial — Jupyter Notebook by Asif Bhat, Dictionaries.*
