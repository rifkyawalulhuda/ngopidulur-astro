---
title: "String Python: Panduan Lengkap Manipulasi Teks dengan Built-in Methods"
description: Panduan lengkap string Python — cara membuat string, indexing,
  slicing, concatenation, iterasi, dan 30+ built-in string methods seperti
  strip, split, join, replace, format, upper, lower, find, count, dan lainnya.
  Dilengkapi contoh kode praktis untuk setiap method.
pubDate: 2026-06-29T15:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - String
  - PemrogramanPython
  - StringMethods
  - BelajarPython
---

String adalah tipe data yang paling sering kamu pakai di Python — dari mencetak pesan, memproses input user, hingga parsing data. Python punya 40+ built-in string methods yang siap pakai tanpa import apapun.

## Membuat String

```python
# 4 cara membuat string
str1 = 'Hello World'           # single quotes
str2 = "Hello World"           # double quotes
str3 = '''Hello
World'''                       # triple single quotes (multiline)
str4 = """Hello
World"""                       # triple double quotes (multiline)

# String concatenation saat definisi
str5 = ('Happy ' 'Monday ' 'Everyone')
print(str5)  # 'Happy Monday Everyone'

# Repetisi
str6 = 'Woohoo ' * 5
print(str6)  # 'Woohoo Woohoo Woohoo Woohoo Woohoo '
print(len(str6))  # 35
```

---

## Indexing dan Slicing

String Python menggunakan **zero-based indexing** dan mendukung index negatif.

```python
str1 = "HELLO PYTHON"
#       0123456789...
#       H E L L O   P Y T H O N

# Indexing positif
print(str1[0])   # 'H'  (pertama)
print(str1[6])   # 'P'
print(str1[11])  # 'N'  (terakhir)

# Indexing negatif (dari belakang)
print(str1[-1])  # 'N'  (terakhir)
print(str1[-6])  # 'P'

# Slicing [start:end] — end tidak termasuk
print(str1[0:5])   # 'HELLO'
print(str1[6:12])  # 'PYTHON'
print(str1[:5])    # 'HELLO'  (dari awal)
print(str1[6:])    # 'PYTHON' (sampai akhir)
print(str1[-4:])   # 'THON'   (4 karakter terakhir)
print(str1[::-1])  # 'NOHTYP OLLEH' (reverse)

# Slicing dengan step [start:end:step]
print(str1[::2])   # 'HLOPTО' (setiap 2 karakter)
```

### String Immutable

String di Python **tidak bisa diubah** setelah dibuat:

```python
str1 = "HELLO PYTHON"
str1[0] = 'h'  # TypeError: 'str' object does not support item assignment

# Solusi: buat string baru
str1 = 'h' + str1[1:]  # 'hELLO PYTHON'

# Hapus string
del str1
```

---

## Operasi String

### Concatenation dan Membership

```python
s1 = "Hello"
s2 = "Python"

# Concatenation
s3 = s1 + " " + s2
print(s3)  # 'Hello Python'

# Membership
mystr = "Hello Everyone"
print('Hello' in mystr)    # True
print('Everyone' in mystr) # True
print('Hi' in mystr)       # False
print('Hi' not in mystr)   # True
```

### Iterasi

```python
mystr = "Hello"

# Iterasi karakter
for char in mystr:
    print(char)  # H e l l o

# Iterasi dengan index
for i, char in enumerate(mystr):
    print(i, char)
# (0, 'H') (1, 'e') (2, 'l') (3, 'l') (4, 'o')
```

### Partitioning

```python
str5 = "Natural language processing with Python and R and Java"

# partition() - pecah di kemunculan pertama
L = str5.partition("and")
print(L)
# ('Natural language processing with Python ', 'and', ' R and Java')

# rpartition() - pecah di kemunculan terakhir
L = str5.rpartition("and")
print(L)
# ('Natural language processing with Python and R ', 'and', ' Java')
```

---

## Built-in String Methods

### Whitespace dan Padding

```python
mystr = "  Hello Everyone  "

mystr.strip()    # 'Hello Everyone'   — hapus spasi awal & akhir
mystr.lstrip()   # 'Hello Everyone  ' — hapus spasi kiri
mystr.rstrip()   # '  Hello Everyone' — hapus spasi kanan

# Strip karakter tertentu
s = "***Hello***"
s.strip('*')     # 'Hello'
s.lstrip('*')    # 'Hello***'
s.rstrip('*')    # '***Hello'

# Padding
"hello".center(11)        # '   hello   '
"hello".center(11, '-')   # '---hello---'
"hello".ljust(10, '.')    # 'hello.....'
"hello".rjust(10, '.')    # '.....hello'
"42".zfill(5)             # '00042'
```

### Case Manipulation

```python
s = "hello world python"

s.upper()       # 'HELLO WORLD PYTHON'
s.lower()       # 'hello world python'
s.title()       # 'Hello World Python'
s.capitalize()  # 'Hello world python'
s.swapcase()    # 'HELLO WORLD PYTHON' → 'hello world python'

# Cek case
"HELLO".isupper()   # True
"hello".islower()   # True
"Hello".istitle()   # True
```

### Search dan Replace

```python
s = "one two three one two two three"

# Count
s.count("one")         # 2
s.count("two")         # 3

# Find (return index, -1 jika tidak ada)
s.find("two")          # 4   (kemunculan pertama)
s.rfind("two")         # 19  (kemunculan terakhir)
s.find("four")         # -1  (tidak ada)

# Index (seperti find tapi raise ValueError jika tidak ada)
s.index("two")         # 4
# s.index("four")      # ValueError!

# Replace
s.replace("two", "2")          # 'one 2 three one 2 2 three'
s.replace("two", "2", 1)       # 'one 2 three one two two three' (max 1x)

# Starts/ends with
s.startswith("one")    # True
s.endswith("three")    # True
s.startswith("two")    # False
```

### Split dan Join

```python
# Split
s = "Hello Everyone Welcome"
words = s.split()           # ['Hello', 'Everyone', 'Welcome']
words = s.split(' ')        # ['Hello', 'Everyone', 'Welcome']
words = s.split(' ', 1)     # ['Hello', 'Everyone Welcome'] (max 1 split)

csv = "a,b,c,d,e"
items = csv.split(',')      # ['a', 'b', 'c', 'd', 'e']

# Splitlines
text = "line1\nline2\nline3"
text.splitlines()           # ['line1', 'line2', 'line3']

# Join — kebalikan split
words = ['Hello', 'Everyone']
' '.join(words)             # 'Hello Everyone'
','.join(['a','b','c'])     # 'a,b,c'
''.join(['H','i'])          # 'Hi'
```

### Validasi String

```python
"123".isdigit()     # True  — semua karakter angka
"abc".isalpha()     # True  — semua karakter huruf
"abc123".isalnum()  # True  — huruf atau angka
"   ".isspace()     # True  — semua whitespace
"Hello".istitle()   # True  — title case
```

### String Formatting

```python
name = "Budi"
age = 25
score = 98.5

# Method 1: % formatting (lama)
print("Nama: %s, Umur: %d" % (name, age))

# Method 2: .format()
print("Nama: {}, Umur: {}".format(name, age))
print("Nama: {0}, Umur: {1}".format(name, age))
print("Nama: {n}, Umur: {a}".format(n=name, a=age))

# Method 3: f-string (Python 3.6+, paling direkomendasikan)
print(f"Nama: {name}, Umur: {age}")
print(f"Nilai: {score:.1f}")      # 98.5 (1 desimal)
print(f"Nilai: {score:.2f}")      # 98.50 (2 desimal)
print(f"2 + 2 = {2 + 2}")         # ekspresi dalam f-string
```

### Encode dan Decode

```python
s = "Hello Python"
encoded = s.encode('utf-8')    # b'Hello Python'
decoded = encoded.decode('utf-8')  # 'Hello Python'
```

---

## Ringkasan String Methods

| Method | Kegunaan |
|--------|---------|
| `strip/lstrip/rstrip` | Hapus whitespace/karakter |
| `upper/lower/title` | Ubah case |
| `split/join` | Pecah/gabung string |
| `replace` | Ganti substring |
| `find/index` | Cari posisi substring |
| `count` | Hitung kemunculan |
| `startswith/endswith` | Cek awalan/akhiran |
| `format` / f-string | Format string |
| `strip('*')` | Hapus karakter tertentu |
| `isdigit/isalpha/isalnum` | Validasi konten |

## Kesimpulan

String Python sangat powerful berkat puluhan built-in methods yang tersedia. Kuasai `split`, `join`, `strip`, `replace`, dan f-string — keempatnya adalah yang paling sering dipakai dalam pemrograman sehari-hari.

Di artikel berikutnya: **List, Tuple, dan Set** — tiga struktur data koleksi Python yang wajib dikuasai.

---

*Referensi: Python Tutorial — Jupyter Notebook by Asif Bhat, Strings.*
