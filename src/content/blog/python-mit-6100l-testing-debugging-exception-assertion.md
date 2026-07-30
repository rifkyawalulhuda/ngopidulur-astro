---
title: "Python MIT 6.100L: Testing, Debugging, Exception, dan Assertion"
description: Tulis kode Python yang tahan banting — kuasai glass-box dan
  black-box testing, teknik debugging sistematis, exception handling dengan
  try/except, dan assertion dari materi kuliah MIT 6.100L Lecture 12–13.
pubDate: 2026-08-02T08:00:00.000Z
image: /image/python-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Python
  - PemrogramanPemula
  - MIT6100L
  - Debugging
---

Menulis kode yang *berjalan* itu satu hal. Menulis kode yang *benar* dan *tahan terhadap input tak terduga* adalah hal lain. MIT 6.100L Lecture 12–13 mengajarkan tiga pilar kualitas kode: **testing** (membuktikan kode benar), **debugging** (menemukan dan memperbaiki bug), dan **defensive programming** (mencegah bug masuk sejak awal).

## Daftar Isi

- [Testing: Glass-Box vs Black-Box](#testing-glass-box-vs-black-box)
- [Debugging Sistematis](#debugging-sistematis)
- [Exception Handling](#exception-handling)
- [Assertions](#assertions)

---

## Testing: Glass-Box vs Black-Box

Testing adalah proses membuktikan bahwa kode bekerja sesuai spesifikasi.

### Black-Box Testing

Tester **tidak melihat kode** — hanya tahu input dan output yang diharapkan. Tes dirancang dari spesifikasi fungsi.

```python
def akar_kuadrat(x, epsilon=0.001):
    """
    Mengembalikan aproksimasi akar kuadrat x.
    x: float >= 0
    epsilon: float > 0, toleransi error
    Returns: float y sedemikian sehingga abs(y*y - x) < epsilon
    """
    # implementasi tidak terlihat oleh black-box tester
    ...
```

Kasus tes black-box yang baik mencakup:
- **Boundary cases** — nilai batas: `x=0`, `x=1`, bilangan sangat besar
- **Typical cases** — input biasa: `x=4`, `x=25`, `x=2`
- **Edge cases** — kasus ekstrem: `x=0.0001`, `x=1000000`

### Glass-Box Testing

Tester **melihat kode** dan merancang tes untuk menjamin setiap jalur kode dieksekusi minimal sekali.

```python
def cari_nilai(L, x):
    """Cari x di list L, return True jika ada."""
    for item in L:
        if item == x:
            return True    # jalur 1: ketemu
    return False           # jalur 2: tidak ketemu
```

Glass-box test untuk fungsi di atas:
```python
# Uji jalur 1: x ada di L
assert cari_nilai([1, 2, 3], 2) == True

# Uji jalur 2: x tidak ada di L
assert cari_nilai([1, 2, 3], 5) == False

# Uji edge: list kosong
assert cari_nilai([], 1) == False

# Uji edge: x ada di posisi pertama dan terakhir
assert cari_nilai([5, 1, 2], 5) == True
assert cari_nilai([1, 2, 5], 5) == True
```

### Unit Test Sederhana

```python
def faktorial(n):
    """Hitung n! untuk n >= 0."""
    if n == 0:
        return 1
    return n * faktorial(n - 1)

# Test manual
def test_faktorial():
    assert faktorial(0) == 1,   "0! harus 1"
    assert faktorial(1) == 1,   "1! harus 1"
    assert faktorial(5) == 120, "5! harus 120"
    assert faktorial(10) == 3628800
    print("Semua test lulus!")

test_faktorial()
```

---

## Debugging Sistematis

Bug adalah kesalahan dalam kode. Ada tiga tipe:
- **Syntax error** — kode tidak valid, Python menolak menjalankan
- **Runtime error** — kode valid tapi crash saat dijalankan
- **Logic error** — kode berjalan tapi hasil salah (paling susah dicari)

### Print Debugging

Cara paling sederhana: sisipkan `print()` untuk melihat nilai variabel.

```python
def hitung_rata_rata(angka):
    total = 0
    for i, x in enumerate(angka):
        total += x
        print(f"  step {i}: x={x}, total={total}")  # debug
    rata = total / len(angka)
    print(f"  hasil: {rata}")  # debug
    return rata

hasil = hitung_rata_rata([10, 20, 30])
# Hapus print setelah bug ditemukan
```

### Strategi Bisection Debugging

Sama seperti bisection search untuk angka — gunakan binary search untuk mencari letak bug:

```python
# Program panjang dengan bug di suatu tempat
# Daripada cek baris per baris...

def proses_data(data):
    # --- checkpoint 1 ---
    hasil_a = langkah_a(data)
    print(f"[DEBUG] setelah langkah_a: {hasil_a}")  # cek di sini

    # --- checkpoint 2 ---
    hasil_b = langkah_b(hasil_a)
    print(f"[DEBUG] setelah langkah_b: {hasil_b}")  # lalu di sini

    # Kalau checkpoint 1 benar tapi 2 salah → bug di langkah_b
    return langkah_c(hasil_b)
```

### Jangan Panik — Gunakan Metode Ilmiah

MIT 6.100L mengajarkan pendekatan sistematis:

1. **Studi kasus** — pahami error message dengan seksama
2. **Hipotesis** — formulasikan dugaan letak bug
3. **Eksperimen** — buat tes untuk membuktikan/menyangkal hipotesis
4. **Perbaiki** — ubah kode berdasarkan temuan
5. **Verifikasi** — jalankan ulang semua tes

```python
# Contoh: bug pada fungsi penjumlahan list
def jumlah(L):
    total = 0
    for i in range(len(L) + 1):  # BUG: seharusnya range(len(L))
        total += L[i]
    return total

# Error: IndexError: list index out of range
# Hipotesis: range terlalu besar
# Eksperimen: print i dan len(L)
# Perbaikan: ubah len(L)+1 jadi len(L)
```

---

## Exception Handling

Exception adalah cara Python memberitahu bahwa sesuatu yang tidak terduga terjadi.

### Exception Umum

```python
# ZeroDivisionError
10 / 0

# TypeError
"5" + 3

# ValueError
int("abc")

# IndexError
L = [1, 2, 3]
L[10]

# KeyError
d = {"a": 1}
d["z"]

# NameError
print(variabel_tidak_ada)

# FileNotFoundError
open("file_yang_tidak_ada.txt")
```

### Try-Except: Tangkap Exception

```python
try:
    angka = int(input("Masukkan angka: "))
    hasil = 100 / angka
    print(f"100 / {angka} = {hasil}")
except ValueError:
    print("Input bukan angka yang valid!")
except ZeroDivisionError:
    print("Tidak bisa dibagi nol!")
```

### Try-Except-Else-Finally

```python
try:
    f = open("data.txt", "r")
    isi = f.read()
except FileNotFoundError:
    print("File tidak ditemukan")
    isi = ""
except PermissionError:
    print("Tidak punya akses ke file")
    isi = ""
else:
    # Dijalankan HANYA jika try berhasil tanpa exception
    print(f"File berhasil dibaca: {len(isi)} karakter")
finally:
    # SELALU dijalankan, exception atau tidak
    print("Selesai membaca file")
    # Tutup file jika berhasil dibuka
    try:
        f.close()
    except:
        pass
```

### Raise Exception

Kamu bisa melempar exception sendiri:

```python
def bagi(a, b):
    if b == 0:
        raise ValueError("Pembagi tidak boleh nol")
    return a / b

def ambil_elemen(L, i):
    if not isinstance(i, int):
        raise TypeError(f"Index harus integer, bukan {type(i)}")
    if i < 0 or i >= len(L):
        raise IndexError(f"Index {i} di luar range [0, {len(L)-1}]")
    return L[i]

# Pakai fungsi di atas
try:
    print(bagi(10, 0))
except ValueError as e:
    print(f"Error: {e}")
```

### Custom Exception

```python
class NilaiNegatifError(Exception):
    """Raised saat nilai yang diharapkan positif ternyata negatif."""
    pass

def akar_kuadrat(x):
    if x < 0:
        raise NilaiNegatifError(f"Tidak bisa menghitung akar dari {x}")
    return x ** 0.5

try:
    print(akar_kuadrat(-4))
except NilaiNegatifError as e:
    print(f"Input tidak valid: {e}")
```

---

## Assertions

Assertion adalah cara menyatakan *"pada titik ini, kondisi ini PASTI benar"*. Kalau ternyata salah, program langsung berhenti dengan pesan yang jelas.

```python
def hitung_diskon(harga, persen):
    assert 0 <= persen <= 100, f"Persen diskon harus 0-100, dapat: {persen}"
    assert harga >= 0, f"Harga tidak boleh negatif, dapat: {harga}"

    diskon = harga * persen / 100
    harga_akhir = harga - diskon

    assert harga_akhir <= harga, "Bug: harga akhir melebihi harga awal"
    return harga_akhir

print(hitung_diskon(100000, 20))   # 80000.0
print(hitung_diskon(100000, 150))  # AssertionError!
```

### Assert vs Exception: Kapan Pakai Yang Mana?

| | Assert | Exception |
|--|--------|-----------|
| Untuk | Bug programmer — kondisi yang *tidak seharusnya* terjadi | Input tak valid dari user/file/API |
| Bisa dimatikan | Ya (`python -O`) | Tidak |
| Tujuan | Dokumentasi + debugging | Penanganan error runtime |

```python
# Assert: untuk kondisi internal yang "pasti" benar
def bagi_list(L, n):
    assert len(L) % n == 0, "Panjang list harus habis dibagi n"
    # ...

# Exception: untuk input dari luar yang tidak terprediksi
def konversi_suhu(nilai, dari):
    if dari not in ["C", "F", "K"]:
        raise ValueError(f"Satuan '{dari}' tidak dikenal")
    # ...
```

---

## Ringkasan

| Konsep | Fungsi |
|--------|--------|
| Black-box test | Tes dari spesifikasi, tanpa lihat kode |
| Glass-box test | Tes setiap jalur kode |
| Print debugging | Sisipkan print untuk lacak nilai variabel |
| Bisection debug | Cari bug dengan binary search di kode |
| `try/except` | Tangkap dan tangani exception dengan graceful |
| `raise` | Lempar exception eksplisit dengan pesan jelas |
| `assert` | Dokumentasi + early-failure untuk kondisi internal |

---

Artikel berikutnya: **Rekursi, OOP, Class, dan Inheritance** — cara berpikir rekursif dan membangun objek yang memodelkan dunia nyata.

---

**Sumber:** MIT OpenCourseWare — [6.100L Introduction to CS and Programming Using Python, Fall 2022](https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/), Dr. Ana Bell. Lisensi CC BY-NC-SA 4.0.
