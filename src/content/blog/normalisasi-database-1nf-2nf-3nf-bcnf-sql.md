---
title: "Normalisasi Database: 1NF, 2NF, 3NF, BCNF, 4NF, 5NF dan SQL"
description: Panduan lengkap normalisasi database dari Beginning Database Design -
  anomaly insertion update deletion, functional dependency, normal forms 1NF
  sampai DKNF, denormalization, dan SQL SELECT WHERE JOIN GROUP BY subquery.
pubDate: 2026-10-10T08:00:00.000Z
image: /image/beginning-database-design-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Database
  - Normalization
  - SQL
  - DataModeling
series: "Beginning Database Design"
seriesOrder: 2
---

**Normalization** adalah proses paling penting dalam relational database design — dan topik utama Part II buku *Beginning Database Design* karya Gavin Powell. Normalisasi menghilangkan redundansi data dan mencegah **anomalies** saat insert, update, dan delete. Artikel ini juga mencakup SQL untuk membaca dan menulis data.

## Daftar Isi

- [Apa itu Normalisasi?](#apa-itu-normalisasi)
- [Konsep Anomalies](#konsep-anomalies)
- [Dependency, Determinants, dan Jargon Lain](#dependency-determinants-dan-jargon-lain)
- [Defining Normal Forms](#defining-normal-forms)
- [1st Normal Form (1NF)](#1st-normal-form-1nf)
- [2nd Normal Form (2NF)](#2nd-normal-form-2nf)
- [3rd Normal Form (3NF)](#3rd-normal-form-3nf)
- [Boyce-Codd Normal Form (BCNF)](#boyce-codd-normal-form-bcnf)
- [4th dan 5th Normal Form (4NF, 5NF)](#4th-dan-5th-normal-form-4nf-5nf)
- [Domain Key Normal Form (DKNF)](#domain-key-normal-form-dknf)
- [SQL: Mendefinisikan dan Menggunakan](#sql-mendefinisikan-dan-menggunakan)
- [Query dengan SELECT](#query-dengan-select)
- [Join Queries](#join-queries)
- [Nested dan Composite Queries](#nested-dan-composite-queries)
- [Transactions](#transactions)
- [Kesimpulan](#kesimpulan)
- [Referensi](#referensi)

## Apa itu Normalisasi?

Normalisasi adalah proses **mengorganisir data** untuk:

- **Menghilangkan redundansi** — data tidak diulang berkali-kali
- **Mencegah anomalies** — masalah saat data diubah
- **Memastikan integritas** — data konsisten dan akurat
- **Memudahkan maintenance** — perubahan satu tempat, bukan banyak

Normalisasi dicapai dengan memecah tabel besar menjadi tabel-tabel lebih kecil yang terhubung via keys.

## Konsep Anomalies

**Anomaly** adalah masalah yang muncul saat mengubah data dalam tabel tidak ternormalisasi:

### Insertion Anomaly

Tidak bisa menambah data karena sebagian data belum lengkap.

Contoh: tabel yang menggabungkan Customer + Order — tidak bisa insert customer baru tanpa order (atau harus dummy order).

### Update Anomaly

Mengubah data membutuhkan perubahan di **banyak tempat** — risiko inkonsistensi.

Contoh: nama customer muncul di 10 baris order — update nama berarti update 10 baris; jika 1 terlewat, data inkonsisten.

### Deletion Anomaly

Menghapus data menghapus informasi lain yang seharusnya tetap ada.

Contoh: menghapus order terakhir customer juga menghapus data customer.

## Dependency, Determinants, dan Jargon Lain

- **Functional dependency (X → Y)** — nilai X menentukan nilai Y. Jika dua baris punya X sama, Y-nya pasti sama
- **Determinant** — kolom (atau kombinasi kolom) yang menentukan kolom lain (sisi kiri dependency)
- **Candidate key** — kolom/kombinasi yang bisa jadi primary key
- **Partial dependency** — kolom bergantung hanya pada sebagian composite key
- **Transitive dependency** — kolom bergantung pada kolom non-key (A → B → C, C bergantung transitif pada A)

## Defining Normal Forms

Normal forms (bentuk normal) adalah tingkat-tingkat normalisasi:

| NF | Aturan Utama |
|----|--------------|
| **1NF** | Atomic values, tidak ada repeating groups |
| **2NF** | 1NF + tidak ada partial dependency |
| **3NF** | 2NF + tidak ada transitive dependency |
| **BCNF** | 3NF + setiap determinant adalah candidate key |
| **4NF** | BCNF + tidak ada multi-valued dependency |
| **5NF** | 4NF + join dependency |
| **DKNF** | Semua constraints adalah domain/key constraints |

Buku membahas dua cara memahami normal forms: **cara akademik** (formal) dan **cara mudah** (praktis).

## 1st Normal Form (1NF)

### 1NF Cara Akademik

Setiap atribut dalam tabel harus berisi **satu nilai atomic** — tidak ada repeating groups atau array.

### 1NF Cara Mudah

**Setiap sel berisi satu nilai, setiap record berisi jumlah field yang sama.**

Contoh **pelanggaran 1NF** — multiple values dalam satu field:

```
CUSTOMERS
customer_id | name    | phone_numbers
1           | Rifky   | 0811, 0822, 0833
```

**Perbaikan** — pecah jadi tabel terpisah:

```
CUSTOMERS            CUSTOMER_PHONES
customer_id | name   customer_id | phone
1           | Rifky  1           | 0811
                     1           | 0822
                     1           | 0833
```

Aturan 1NF: tiap field satu nilai; primary key mendefinisikan keunikan.

## 2nd Normal Form (2NF)

### 2NF Cara Akademik

1NF + **tidak ada partial dependency** — setiap kolom non-key bergantung pada **seluruh** primary key (bukan sebagian).

### 2NF Cara Mudah

**Tidak ada kolom yang bergantung hanya pada sebagian dari composite key.**

Contoh **pelanggaran 2NF**:

```
ORDER_ITEMS (PK: order_id + product_id)
order_id | product_id | product_name | quantity
1        | 10         | Mouse        | 2
1        | 11         | Keyboard     | 1
```

`product_name` hanya bergantung pada `product_id` (sebagian key) — bukan seluruh composite key.

**Perbaikan** — pecah PRODUCTS:

```
ORDER_ITEMS           PRODUCTS
order_id | product_id | qty   product_id | product_name
1        | 10         | 2     10         | Mouse
1        | 11         | 1     11         | Keyboard
```

## 3rd Normal Form (3NF)

### 3NF Cara Akademik

2NF + **tidak ada transitive dependency** — kolom non-key tidak boleh bergantung pada kolom non-key lain.

### 3NF Cara Mudah

**Tidak ada kolom yang bergantung pada kolom lain yang bukan key.**

Contoh **pelanggaran 3NF**:

```
ORDERS
order_id | customer_id | customer_name | customer_city
1        | 100         | Rifky         | Jakarta
```

`customer_name` dan `customer_city` bergantung pada `customer_id` (bukan key) — transitive dependency melalui customer_id.

**Perbaikan** — pisahkan CUSTOMERS:

```
ORDERS               CUSTOMERS
order_id | customer_id   customer_id | name  | city
1        | 100           100         | Rifky | Jakarta
```

## Boyce-Codd Normal Form (BCNF)

3NF + **setiap determinant adalah candidate key**.

Aturan: setiap kolom yang menentukan kolom lain harus menjadi key.

Contoh pelanggaran BCNF (3NF tapi bukan BCNF):

```
ENROLLMENT (PK: student_id, course_id)
student_id | course_id | instructor
1          | CS101     | Dr. Smith
1          | CS201     | Dr. Jones
```

`instructor` menentukan `course_id` — tapi `instructor` bukan key. Solusi: pisahkan ke tabel COURSE_INSTRUCTOR.

## 4th dan 5th Normal Form (4NF, 5NF)

### 4NF

BCNF + **tidak ada multi-valued dependency** — dua atribut independen yang keduanya multi-valued dalam satu tabel.

Contoh: satu tabel berisi skills dan languages karyawan → pecah jadi dua tabel (mencegah kombinasi silang berlebihan).

### 5NF

4NF + **tidak ada join dependency** — tabel tidak bisa dipecah dan di-join ulang tanpa kehilangan/menambah data.

5NF jarang dilanggar dalam praktik nyata.

## Domain Key Normal Form (DKNF)

**DKNF** (Domain-Key Normal Form) adalah bentuk paling ketat:

- Setiap constraint adalah **domain constraint** (nilai valid) atau **key constraint** (keunikan)
- Secara teoritis ideal, tapi praktis sangat sulit dicapai
- Kebanyakan database cukup di 3NF/BCNF

**Ringkasan normal forms:**

| NF | Fokus | Level Praktis |
|----|-------|---------------|
| 1NF | Atomic values | Dasar — selalu |
| 2NF | Partial dependency | Umum |
| 3NF | Transitive dependency | **Paling umum di praktik** |
| BCNF | Determinant = key | Jika perlu |
| 4NF/5NF | Multi-valued/join dependency | Kasus spesifik |
| DKNF | Semua constraints | Teoritis |

## SQL: Mendefinisikan dan Menggunakan

**SQL (Structured Query Language)** adalah bahasa standar untuk relational database:

- Diciptakan dari penelitian **IBM System R**
- Diadopsi ANSI dan ISO sebagai standar
- Setiap database punya dialek: Oracle PL/SQL, SQL Server T-SQL, MySQL, PostgreSQL

### Tiga Bagian SQL

- **DDL (Data Definition Language)** — CREATE, ALTER, DROP
- **DML (Data Manipulation Language)** — SELECT, INSERT, UPDATE, DELETE
- **DCL (Data Control Language)** — GRANT, REVOKE

## Query dengan SELECT

### Basic Queries

```sql
-- Semua kolom
SELECT * FROM customers;

-- Kolom tertentu
SELECT customer_id, name, email FROM customers;

-- Kolom dengan alias
SELECT name AS customer_name, city FROM customers;
```

### Filtering dengan WHERE

```sql
-- Filter sederhana
SELECT * FROM orders WHERE status = 'SHIPPED';

-- Operator perbandingan
SELECT * FROM products WHERE price >= 100000;

-- Kombinasi kondisi
SELECT * FROM orders
WHERE status = 'PAID'
  AND total > 500000;

SELECT * FROM customers
WHERE city = 'Jakarta' OR city = 'Bandung';
```

### Precedence

Operator AND lebih tinggi dari OR — gunakan kurung untuk kejelasan:

```sql
SELECT * FROM orders
WHERE (status = 'PAID' OR status = 'SHIPPED')
  AND total > 100000;
```

### Sorting dengan ORDER BY

```sql
SELECT customer_id, name FROM customers
ORDER BY name ASC;

SELECT order_id, total FROM orders
ORDER BY total DESC, order_date ASC;
```

### Aggregating dengan GROUP BY

```sql
SELECT customer_id, COUNT(*) AS order_count, SUM(total) AS total_spent
FROM orders
GROUP BY customer_id
ORDER BY total_spent DESC;
```

Fungsi agregat: COUNT, SUM, AVG, MIN, MAX.

## Join Queries

**Join** menggabungkan data dari beberapa tabel berdasarkan relasi:

### Inner Join

Hanya baris yang cocok di kedua tabel:

```sql
SELECT c.name, o.order_id, o.total
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id;
```

### Left Join

Semua baris tabel kiri + yang cocok dari kanan (NULL jika tidak cocok):

```sql
SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;
```

### Right Join dan Full Join

- **RIGHT JOIN** — kebalikan left join
- **FULL OUTER JOIN** — semua baris kedua tabel

## Nested dan Composite Queries

### Nested Queries (Subquery)

```sql
-- Customer dengan total order di atas rata-rata
SELECT name FROM customers
WHERE customer_id IN (
  SELECT customer_id FROM orders
  GROUP BY customer_id
  HAVING SUM(total) > (SELECT AVG(total) FROM orders)
);
```

### Composite Queries

```sql
-- UNION: gabungkan hasil dua query
SELECT city FROM customers WHERE city = 'Jakarta'
UNION
SELECT city FROM suppliers WHERE city = 'Jakarta';
```

## Transactions

**Transaction** adalah unit kerja yang harus berhasil seluruhnya atau gagal seluruhnya (atomic):

```sql
BEGIN;
UPDATE accounts SET balance = balance - 500000 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 500000 WHERE account_id = 2;
COMMIT;  -- atau ROLLBACK;
```

### ACID Properties

- **A**tomicity — semua atau tidak sama sekali
- **C**onsistency — data valid sebelum dan sesudah
- **I**solation — transaksi tidak saling mengganggu
- **D**urability — perubahan permanen setelah commit

## Kesimpulan

Normalisasi adalah jantung relational database design: 3NF adalah target praktis kebanyakan database, dengan 1NF dan 2NF sebagai langkah wajib. SQL melengkapi normalisasi — struktur yang baik memudahkan query yang efisien.

Di artikel berikutnya: **denormalization, data warehouse, dan performance tuning** (Chapter 6-8).

## Referensi

- Powell, G. (2006). *Beginning Database Design*. Wiley Publishing.
- Codd, E. F. (1970). A Relational Model of Data for Large Shared Data Banks. *Communications of the ACM, 13*(6), 377-387.
- Date, C. J. (2003). *An Introduction to Database Systems* (8th ed.). Addison-Wesley.
- Elmasri, R., & Navathe, S. B. (2016). *Fundamentals of Database Systems* (7th ed.). Pearson.
